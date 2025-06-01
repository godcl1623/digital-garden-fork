"use client";

import FolderTree from "./FolderTree";
import MDContent from "./MDContent";
import {
  GraphData,
  GraphRawNodeValue,
  ParsedPostContent,
  ParsedPostData,
  ParsedPostDirectoryData,
} from "../../lib/utils";
import Graph from "./Graph";

interface RootViewProps {
  graphData: GraphData;
  content: ParsedPostContent | undefined;
  tree: ParsedPostDirectoryData;
  flattenNodes: (ParsedPostDirectoryData | ParsedPostData)[];
  backLinks: (GraphRawNodeValue | undefined)[];
}

export default function PageView({ graphData, content, tree, flattenNodes, backLinks }: RootViewProps) {
  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <nav className="nav-bar">
        <FolderTree tree={tree} flattenNodes={flattenNodes}/>
      </nav>
      <MDContent content={content?.data ?? []} backLinks={backLinks}/>
      <Graph graph={graphData}/>
    </div>
  );
}