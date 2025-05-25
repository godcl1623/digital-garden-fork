import {
  constructGraphData,
  getFlattenArray,
  getLocalGraphData,
  getSinglePost,
  type ParsedPostDirectoryData,
} from "../lib/utils";
import { getTree } from "../lib/postsCache";
import PageView from "./_components/PageView";

export default async function Home() {
  const pageData = await getPageData();

  return (
    <PageView tree={pageData.tree as ParsedPostDirectoryData} flattenNodes={pageData.flattenNodes}
              graphData={pageData.graphData}
              backLinks={pageData.backLinks} content={pageData.content}/>
  );
}

async function getPageData() {
  const { nodes, edges } = await constructGraphData();
  const tree = getTree();
  const content = getSinglePost("index");
  const flattenNodes = getFlattenArray(tree as ParsedPostDirectoryData);
  const listOfEdges = edges.filter(anEdge => anEdge.target === "index");
  const internalLinks = listOfEdges
    .map(anEdge => nodes.find(aNode => aNode.slug === anEdge.source))
    .filter(element => element !== undefined);
  const backLinks = Array.from(new Set(internalLinks));
  const graphData = await getLocalGraphData("index");

  return {
    content,
    tree,
    flattenNodes,
    graphData,
    backLinks,
  };
}
