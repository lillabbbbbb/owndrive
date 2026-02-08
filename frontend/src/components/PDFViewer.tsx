import React from "react";

interface PdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {

    //Suggested by AI
  return (
    <iframe
      src={`${url}#toolbar=0`}
      width="100%"
      height="800px"
      style={{ border: "none" }}
      title="PDF Viewer"
    />
  );
};

export default PdfViewer;