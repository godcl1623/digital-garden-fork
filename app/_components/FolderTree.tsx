"use client";

import * as React from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { ParsedPostData, ParsedPostDirectoryData } from "../../lib/utils";

interface FolderTreeProps {
  tree: ParsedPostDirectoryData;
  flattenNodes: (ParsedPostData | ParsedPostDirectoryData)[];
}

export default function FolderTree({ tree, flattenNodes }: Readonly<FolderTreeProps>) {
  const router = useRouter();
  const renderTree = (nodes: ParsedPostDirectoryData | ParsedPostData) => (
    <TCTreeItem key={nodes.id} label={nodes.name} itemId={nodes.id}>
      {"children" in nodes ? nodes.children.map(node => renderTree(node)) : null}
    </TCTreeItem>
  );
  return (
    <SimpleTreeView
      aria-label="rich object"
      onItemFocus={(event, selectedItemText) => {
        const selectedPost = flattenNodes.find(aNode => {
          return aNode.id === selectedItemText;
        });
        if (selectedPost != null && "routePath" in selectedPost && selectedPost.routePath != null) {
          router.push(selectedPost.routePath);
        }
      }}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      {renderTree(tree)}
    </SimpleTreeView>
  );
}

const TCTreeItem = styled(TreeItem)(({ theme }) => ({
  "& .MuiTreeItem-content": {
    "& .MuiTreeItem-label": {
      fontSize: "1rem",
      paddingLeft: "6px",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif,",
      lineHeight: 2.0,
    },
  },
}));
