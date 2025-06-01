import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { GraphRawNodeValue } from "../../lib/utils";
import Link from "next/link";

interface MDContentProps {
  content: string[];
  backLinks: (GraphRawNodeValue | undefined)[];
}

export default function MDContent({ content, backLinks }: Readonly<MDContentProps>) {
  //   function handleInternalLinkClick() {
  //Processing fetching
  //pass result up to parent container
  //TODO: handle clicking on internal link, go fetching md content from file then passing it up to parent
  // handleOpenNewContent(content);
  //   }

  return (
    <div className="markdown-rendered" style={{ display: "flex", flexDirection: "column" }}>
      <Alert severity="info">
        <AlertTitle>Note</AlertTitle>
        This project is a fork of the original{" "}
        <Link href={"https://github.com/TuanManhCao/digital-garden"}>
          <strong>MindStone</strong>
        </Link> project by{" "}
        <Link href={"https://github.com/TuanManhCao"}>
          <strong>Tuan Cao</strong>
        </Link>.
        <br/>
        If you have any feedback, please feel free to contact me on{" "}
        <Link href={"mailto:godcl1623@gmail.com"}>
          <strong>email</strong>
        </Link>
      </Alert>
      <div dangerouslySetInnerHTML={{ __html: content }} style={{ flex: "1" }}/>
      {/*<button onClick={handleInternalLinkClick}>Click me</button>*/}
      {/*<hr/>*/}
      <div>
        <BackLinks linkList={backLinks}/>
      </div>
      <hr/>
      <footer>
        <p>
          Powered by <a href="https://github.com/TuanManhCao/digital-garden">Mind Stone</a>, © 2022
        </p>
      </footer>
    </div>
  );
}

interface BackLinksProps {
  linkList: (GraphRawNodeValue | undefined)[];
}

function BackLinks({ linkList }: Readonly<BackLinksProps>) {
  return (
    <div className="note-footer">
      <h3 className="backlink-heading">Link to this note</h3>
      {linkList != null && linkList.length > 0 ? (
        <div className="backlink-container">
          {linkList.map(aLink => (
            <div key={aLink?.slug ?? ""} className="backlink">
              {/*<Link href={aLink.slug}>*/}
              <a href={aLink?.slug ?? ""}>
                <p className="backlink-title">{aLink?.title ?? ""}</p>
                <p className="backlink-preview">{aLink?.shortSummary ?? ""} </p>
              </a>
              {/*</Link>*/}
            </div>
          ))}
        </div>
      ) : (
        <>
          {" "}
          <p className="no-backlinks"> No backlinks found</p>{" "}
        </>
      )}
    </div>
  );
}
