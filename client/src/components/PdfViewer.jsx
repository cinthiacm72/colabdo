import useIsMobile from "../hooks/useIsMobile.js";

const PdfViewer = ({ file }) => {
  const isMobile = useIsMobile();

  /*   if (isMobile) {
    return (
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        Ver PDF
      </a>
    );
  } */

  return <iframe className="card-carrousel-pdf" src={file} title="PDF" />;
};

export default PdfViewer;
