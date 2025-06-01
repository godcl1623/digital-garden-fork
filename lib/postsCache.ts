import { convertObject, getDirectoryData, ParsedPostData, ParsedPostDirectoryData } from "./utils";

const cache: { tree?: ParsedPostData | ParsedPostDirectoryData | null } = {};

export const getTree = () => {
  if (cache.tree == null) {
    cache.tree = convertObject(getDirectoryData());
  }
  return cache.tree;
};