import { Node } from "./node";
import { Transformer } from "./transformer";
import { unified } from "unified";
import markdown from "remark-parse";
import { toString } from "mdast-util-to-string";
import path from "path";
import fs from "fs";
import { PATH_ESCAPE_TABLE } from "../const";
import dirTree from "directory-tree";
import { getTree } from "./postsCache";

const utilsCache: Record<string, any> = {};

export function getContent(slug: string) {
  let currentFilePath = toFilePath(slug);
  if (currentFilePath === undefined || currentFilePath == null) return null;
  return Node.readFileSync(currentFilePath);
}

export function getShortSummary(slug: string) {
  const content = getContent(slug);
  if (content === undefined || content === null) {
    return;
  }

  const tree = unified().use(markdown).parse(content);
  let plainText = toString(tree);
  return plainText.split(" ").splice(0, 40).join(" ");
}

export function getAllMarkdownFiles() {
  if (!("allFiles" in utilsCache)) {
    utilsCache.allFiles = Node.getFiles(Node.getMarkdownFolder()) ?? [] as string[];
  }
  return utilsCache.allFiles as string[];
}

export interface ParsedPostContent {
  id: string;
  data: string[];
}

export function getSinglePost(slug: string): ParsedPostContent | undefined {
  // List of filenames that will provide existing links to wikilink
  const currentFilePath = toFilePath(slug);
  if (!currentFilePath) return;

  const fileContent = Node.readFileSync(currentFilePath);

  // const currentFileFrontMatter = Transformer.getFrontMatterData(fileContent);
  // console.log("===============\n\nFile is scanning: ", slug)
  const [htmlContent]: string[][] = Transformer.getHtmlContent(fileContent);
  // console.log("==================================")
  //console.log("hrmlcontents and backlinks")
  return {
    id: slug,
    // ...currentFileFrontMatter,
    data: htmlContent,
  };
}

export function toFilePath(slug: string) {
  if (!("slugMap" in utilsCache)) {
    utilsCache.slugMap = getSlugHashMap();
  }
  return utilsCache.slugMap.get(slug) ?? utilsCache.slugMap.entries().find(([key]: [string, string]) => key.includes(slug))?.[1];
}

export function getSlugHashMap() {
  // This is to solve problem of converting between slug and filepath,
  // where previously if I convert a slug to a file path sometime
  // it does not always resolve to correct filepath, converting function is not bi-directional
  // and not conflict-free, other solution was considered (hash file name into a hash, but this
  // is not SEO-friendly and make url look ugly ==> I chose this

  const slugMap: Map<string, string> = new Map();
  getAllMarkdownFiles()?.map(aFile => {
    const aSlug = toSlug(aFile);
    // if (slugMap.has(aSlug)) {
    //     slugMap[aSlug].push(aFile)
    // } else {
    //     slugMap[aSlug] = [aFile]
    // }
    // Note: [Future improvement] Resolve conflict
    slugMap.set(aSlug, aFile);
  });

  slugMap.set("index", Node.getMarkdownFolder() + "/index.md");
  slugMap.set("/", Node.getMarkdownFolder() + "/index.md");

  return slugMap;
}

export function toSlug(filePath: string) {
  if (Node.isFile(filePath) && filePath.includes(Node.getMarkdownFolder())) {
    let escapedFilePath = filePath.replace(Node.getMarkdownFolder(), "");
    Object.entries(PATH_ESCAPE_TABLE).forEach(
      ([escapeTarget, escapeString]) =>
        (escapedFilePath = escapedFilePath.replaceAll(escapeTarget, escapeString)),
    );
    return escapedFilePath.replace(".md", "");
  } else {
    //TODO handle this properly
    return "/";
  }
}

interface GraphEdgeDataValue {
  id?: string;
  source: string;
  target: string;
}

export interface GraphRawNodeValue {
  title: string | null;
  slug: string;
  shortSummary?: string;
}

export async function constructGraphData(): Promise<{
  nodes: GraphRawNodeValue[];
  edges: GraphEdgeDataValue[]
}> {
  const filepath = path.join(process.cwd(), "graph-data.json");

  if (Node.isFile(filepath)) {
    const data = fs.readFileSync(filepath);
    return JSON.parse(String(data));
  } else {
    console.log("start constructing graph data");
    const filePaths = getAllMarkdownFiles();
    const batchSize = 50;
    const batches: string[][] = [];

    for (let i = 0; i < filePaths.length; i += batchSize) {
      batches.push(filePaths.slice(i, i + batchSize));
    }
    console.log("Total batches: ", batches.length);

    const edges: GraphEdgeDataValue[] = [];
    const nodes: GraphRawNodeValue[] = [];

    await Promise.all(batches.map(async (batch, index) => {
      console.log("Batch: ", index);
      batch?.forEach((filePath) => {
        const aNode = {
          title: Transformer.parseFileNameFromPath(filePath),
          slug: toSlug(filePath),
          shortSummary: getShortSummary(toSlug(filePath)),
        };
        nodes.push(aNode);

        const internalLinks = Transformer.getInternalLinks(filePath);
        internalLinks.forEach((aLink) => {
          if (aLink.slug === null || aLink.slug.length === 0) return;
          const anEdge = {
            source: toSlug(filePath),
            target: aLink.slug,
          };
          edges.push(anEdge);
        });
      });
    }));

    const data = { nodes, edges };
    fs.writeFileSync(filepath, JSON.stringify(data), "utf-8");
    return data;
  }
}

interface GraphNodeDataValue {
  id: string;
  label: string | null;
}

interface GraphNodeData {
  data: GraphNodeDataValue;
}

interface GraphEdgeData {
  data: GraphEdgeDataValue;
}

export interface GraphData {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
}

export async function getLocalGraphData(currentNodeId: string) {
  const { nodes, edges } = await constructGraphData();

  const newNodes: GraphNodeData[] = nodes?.map(aNode => ({
    data: {
      id: aNode.slug.toString(),
      label: Transformer.parseFileNameFromPath(toFilePath(aNode.slug) ?? "") ?? "",
    },
  }));

  const newEdges: GraphEdgeData[] = edges?.map(anEdge => ({
    data: {
      source: anEdge.source,
      target: anEdge.target,
    },
  }));

  const existingNodeIDs = newNodes.map(aNode => aNode.data.id);
  currentNodeId = !currentNodeId.startsWith("$2F") ? `$2F${currentNodeId}` : currentNodeId;
  if (currentNodeId != null && existingNodeIDs.includes(currentNodeId)) {
    const outGoingNodeIds = newEdges
      .filter(anEdge => anEdge.data.source === currentNodeId)
      .map(anEdge => anEdge.data.target);

    const incomingNodeIds = newEdges
      .filter(anEdge => anEdge.data.target === currentNodeId)
      .map(anEdge => anEdge.data.source);

    outGoingNodeIds.push(currentNodeId);

    const localNodeIds = incomingNodeIds.concat(
      outGoingNodeIds.filter(item => incomingNodeIds.indexOf(item) < 0),
    );
    if (localNodeIds.indexOf(currentNodeId) < 0) {
      localNodeIds.push(currentNodeId);
    }

    const localNodes = newNodes.filter(aNode => localNodeIds.includes(aNode.data.id));
    let localEdges = newEdges
      .filter(edge => localNodeIds.includes(edge.data.source))
      .filter(edge => localNodeIds.includes(edge.data.target));

    // Filter self-reference edges
    localEdges = localEdges
      .slice(localEdges.length)
      .concat(localEdges.filter(edge => edge.data.source !== edge.data.target));

    // TODO: Find out why target ==='/' in some case
    localEdges = localEdges
      .slice(localEdges.length)
      .concat(localEdges.filter(edge => edge.data.target !== "/"));

    return {
      nodes: localNodes,
      edges: localEdges,
    };
  } else {
    // const filteredEdges = newEdges
    //   .filter(edge => existingNodeIDs.includes(edge.data.source))
    //   .filter(edge => existingNodeIDs.includes(edge.data.target));

    // return {
    //   nodes: newNodes,
    //   edges: filteredEdges,
    // };
    return {
      nodes: [],
      edges: [],
    };
  }
}

export function getAllSlugs() {
  //console.log("\n\nAll Posts are scanning")
  // Get file names under /posts
  const filePaths = getAllMarkdownFiles().filter(
    f => !(f.endsWith("index") || f.endsWith("sidebar")),
  );
  return filePaths.map(f => toSlug(f));
}

type EndsWith<T extends string, S extends string> = T extends `${infer Rest}${S}` ? T : never;

interface RawPostData {
  path: string;
  name: string;
}

interface RawDirectoryData {
  path: string;
  name: string;
  children?: dirTree.DirectoryTree[] | undefined;
}

export function getDirectoryData(): RawDirectoryData {
  return dirTree(Node.getMarkdownFolder(), { extensions: /\.md/ });
}

interface BasicParsedData {
  id: string;
  name: string;
}

export interface ParsedPostData extends BasicParsedData {
  routePath: string;
}

export interface ParsedPostDirectoryData extends BasicParsedData {
  children: (ParsedPostData | ParsedPostDirectoryData)[];
}

export function convertObject(
  directoryData: RawDirectoryData | RawPostData,
): ParsedPostData | ParsedPostDirectoryData {
  if ("children" in directoryData) {
    return parseToDirectoryData(directoryData);
  } else {
    return parseToPostData(directoryData);
  }
}

function parseToDirectoryData(rawData: RawDirectoryData): ParsedPostDirectoryData {
  return {
    id: rawData.name,
    name: rawData.name,
    children: rawData.children?.map(rawPost => convertObject(rawPost)) ?? [],
  };
}

function parseToPostData(rawData: RawPostData): ParsedPostData {
  const routeFromFilePath = getAllSlugs().find(slug => {
    const fileName = Transformer.parseFileNameFromPath(toFilePath(slug) ?? "");
    return Transformer.normalizeFileName(fileName ?? "") === Transformer.normalizeFileName(rawData.name);
  });
  const routePath = `/note/${routeFromFilePath}`;
  return {
    id: rawData.name,
    name: rawData.name,
    routePath,
  };
}

function flat(array: (ParsedPostData | ParsedPostDirectoryData)[]) {
  let result: (ParsedPostData | ParsedPostDirectoryData)[] = [];
  array.forEach(function(directoryData) {
    result.push(directoryData);
    if ("children" in directoryData && Array.isArray(directoryData.children)) {
      result = result.concat(flat(directoryData.children));
    }
  });
  return result;
}

export function getFlattenArray(thisObject: ParsedPostDirectoryData): (ParsedPostData | ParsedPostDirectoryData)[] {
  return flat(thisObject.children);
}

export async function getPageData(postId: string = "index") {
  const { nodes, edges } = await constructGraphData();
  const tree = getTree();
  const content = getSinglePost(postId);
  const flattenNodes = getFlattenArray(tree as ParsedPostDirectoryData);
  const listOfEdges = edges.filter(anEdge => anEdge.target === postId);
  const internalLinks = listOfEdges
    .map(anEdge => nodes.find(aNode => aNode.slug === anEdge.source))
    .filter(element => element !== undefined);
  const backLinks = Array.from(new Set(internalLinks)).filter((link) => link?.slug !== postId);
  const graphData = await getLocalGraphData(postId);

  return {
    content,
    tree,
    flattenNodes,
    graphData,
    backLinks,
  };
}
