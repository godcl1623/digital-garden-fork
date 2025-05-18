import {
  constructGraphData,
  getAllSlugs,
  getFlattenArray,
  getLocalGraphData,
  getSinglePost,
  ParsedPostDirectoryData,
} from "../../../lib/utils";
import { getTree } from "../../../lib/postsCache";
import PageView from "../../_components/PageView";
import { SearchParams } from "next/dist/server/request/search-params";

export interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<SearchParams>;
}

export default async function Detail({ params }: PageProps) {
  const paramId = (await params).id;
  const postData = getPost(decodeURIComponent(paramId));

  return (
    <PageView graphData={postData.graphData} content={postData.note} tree={postData.tree as ParsedPostDirectoryData}
              flattenNodes={postData.flattenNodes} backLinks={postData.backLinks}/>
  );
}

export async function generateStaticParams() {
  const allPostsData = getAllSlugs();
  return allPostsData.map((path) => ({ id: path }));
}

const { nodes, edges } = constructGraphData();

function getPost(postId: string) {
  const note = getSinglePost(postId);
  const tree = getTree();
  const flattenNodes = getFlattenArray(tree as ParsedPostDirectoryData);
  const listOfEdges = edges.filter(anEdge => anEdge.target === postId);
  const internalLinks = listOfEdges
    .map(anEdge => nodes.find(aNode => aNode.slug === anEdge.source))
    .filter(element => element !== undefined);
  const backLinks = Array.from(new Set(internalLinks)).filter(link => link?.slug !== postId);
  const graphData = getLocalGraphData(postId);

  return {
    note,
    tree,
    flattenNodes,
    backLinks,
    graphData,
  };
}
