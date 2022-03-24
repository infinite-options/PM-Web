import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import samplePDF from "../../assets/CorporateOverview.pdf";
import { makeStyles } from "@material-ui/core/styles";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
const useStyles = makeStyles((theme) => ({
  iframe: {
    width: "720px",
    height: " 600px",
    border: "1px solid #707070",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#52330D",
    border: "none",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "20px",
    borderRadius: "10px",
    margin: " 5px",
    padding: "5px",
    width: "6rem",
  },
}));
/*export default function PDF() {
  const classes = useStyles();
  return (
    <>
      <Box>
        <iframe
          className={classes.iframe}
          style={{ width: "300px", height: "300px" }}
          src={samplePDF}
          type="application/pdf"
          title="title"
        />
      </Box>
    </>
  );
} */
export default function PDF() {
  const classes = useStyles();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <>
      <Box className={classes.iframe}>
        <div>
          <p
            style={{
              color: "#F6A833",
              fontSize: "20px",
            }}
          >
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </p>
          <button
            className={classes.button}
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous
          </button>
          <button
            className={classes.button}
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </button>
          <Document
            style={{ border: "1px solid #707070", padding: "20px" }}
            file={samplePDF}
            onLoadSuccess={onDocumentLoadSuccess}
            height="300"
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      </Box>
    </>
  );
}