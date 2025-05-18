import { convertObject, getDirectoryData, ParsedPostData, ParsedPostDirectoryData } from "./utils";

const cache: { tree?: ParsedPostData | ParsedPostDirectoryData | null } = {};

export const getTree = () => {
  const tree = cache.tree != null ? cache.tree : convertObject(getDirectoryData());
  if (cache.tree == null) {
    cache.tree = tree;
    return tree;
  }
  return cache.tree;

};