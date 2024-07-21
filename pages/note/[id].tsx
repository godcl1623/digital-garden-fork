import Head from 'next/head';
import Layout from '../../components/Layout';
import {
  getAllSlugs,
  getSinglePost,
  constructGraphData,
  getLocalGraphData,
  getFlattenArray,
  ParsedPostContent,
  GraphRawNodeValue,
  ParsedPostDirectoryData,
  ParsedPostData,
  GraphData,
} from '../../lib/utils';
import FolderTree from '../../components/FolderTree';
import MDContent from '../../components/MDContent';
import dynamic from 'next/dynamic';
import { getTree } from '../../lib/postsCache';

interface DetailPageProps {
  note: ParsedPostContent;
  backLinks: GraphRawNodeValue[];
  tree: ParsedPostDirectoryData;
  flattenNodes: (ParsedPostDirectoryData | ParsedPostData)[];
  graphData: GraphData;
}

const DynamicGraph = dynamic(() => import('../../components/Graph'), {
  loading: () => <p>Loading ...</p>,
  ssr: false,
});

export default function Detail({
  note,
  backLinks,
  tree,
  flattenNodes,
  graphData,
}: DetailPageProps) {
  return (
    <Layout>
      <Head>{note.id && <meta name='title' content={note.id} />}</Head>
      <div className='container'>
        <nav className='nav-bar'>
          <FolderTree tree={tree} flattenNodes={flattenNodes} />
        </nav>
        <MDContent content={note.data} backLinks={backLinks} />
        <DynamicGraph graph={graphData} />
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const allPostsData = getAllSlugs();
  const paths = allPostsData.map(p => ({ params: { id: p } }));

  return {
    paths,
    fallback: false,
  };
}

const { nodes, edges } = constructGraphData();

interface GetStaticPropsProps {
  params: {
    [key in string]: string;
  };
}

export function getStaticProps({ params }: GetStaticPropsProps): { props: DetailPageProps } {
  const note = getSinglePost(params.id);
  const tree = getTree();
  const flattenNodes = getFlattenArray(tree);

  const listOfEdges = edges.filter(anEdge => anEdge.target === params.id);
  const internalLinks = listOfEdges
    .map(anEdge => nodes.find(aNode => aNode.slug === anEdge.source))
    .filter(element => element !== undefined);
  const backLinks = Array.from(new Set(internalLinks)).filter(link => link.slug !== params.id);
  const graphData = getLocalGraphData(params.id);
  return {
    props: {
      note,
      tree,
      flattenNodes,
      backLinks,
      graphData,
    },
  };
}
