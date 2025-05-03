import Layout from '../components/Layout';
import {
  getSinglePost,
  getFlattenArray,
  getLocalGraphData,
  constructGraphData,
  GraphData,
  ParsedPostContent,
  ParsedPostDirectoryData,
  ParsedPostData,
  GraphRawNodeValue,
} from '../lib/utils';
import FolderTree from '../components/FolderTree';
import dynamic from 'next/dynamic';
import MDContent from '../components/MDContent';
import { getTree } from '../lib/postsCache';

interface HomeProps {
  graphData: GraphData;
  content: ParsedPostContent | undefined;
  tree: ParsedPostDirectoryData;
  flattenNodes: (ParsedPostDirectoryData | ParsedPostData)[];
  backLinks: GraphRawNodeValue[];
}

// This trick is to dynamically load component that interact with window object (browser only)
const DynamicGraph = dynamic(() => import('../components/Graph'), {
  loading: () => <p>Loading ...</p>,
  ssr: false,
});

export default function Home({ graphData, content, tree, flattenNodes, backLinks }: HomeProps) {
  return (
    <Layout>
      <div className='container'>
        <nav className='nav-bar'>
          <FolderTree tree={tree} flattenNodes={flattenNodes} />
        </nav>
        <MDContent content={content?.data ?? []} backLinks={backLinks} />
        <DynamicGraph graph={graphData} />
      </div>
    </Layout>
  );
}

export function getStaticProps(): { props: HomeProps } {
  const { nodes, edges } = constructGraphData();
  const tree = getTree();
  const content = getSinglePost('index');
  const flattenNodes = getFlattenArray(tree);
  const listOfEdges = edges.filter(anEdge => anEdge.target === 'index');
  const internalLinks = listOfEdges
    .map(anEdge => nodes.find(aNode => aNode.slug === anEdge.source))
    .filter(element => element !== undefined);
  const backLinks = Array.from(new Set(internalLinks));

  const graphData = getLocalGraphData('index');
  return {
    props: {
      content,
      tree,
      flattenNodes,
      graphData,
      backLinks,
    },
  };
}
