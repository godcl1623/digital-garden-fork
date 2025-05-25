import { getPageData, type ParsedPostDirectoryData } from "../lib/utils";
import PageView from "./_components/PageView";

export default async function Home() {
  const pageData = await getPageData();

  return (
    <PageView tree={pageData.tree as ParsedPostDirectoryData} flattenNodes={pageData.flattenNodes}
              graphData={pageData.graphData}
              backLinks={pageData.backLinks} content={pageData.content}/>
  );
}
