import React from "react";
import { Button } from "react-bootstrap";
import File from "../icons/File.svg";
import { get } from "../utils/api";
import { smallPillButton, mediumBold } from "../utils/styles";

function LeaseDocs(props) {
  const { addDocument, property, selectAgreement } = props;
  const [agreements, setAgreements] = React.useState([]);
  let pageURL = window.location.href.split("/");

  React.useEffect(async () => {
    const response = await get(
      `/rentals?rental_property_id=${property.property_uid}`
    );
    setAgreements(response.result);
  }, []);

  return (
    <div className="mx-4 d-flex flex-column gap-2">
      {agreements.map((agreement, i) => (
        <div key={i} onClick={() => selectAgreement(agreement)}>
          <div className="d-flex justify-content-between align-items-end">
            <h6 style={mediumBold}>Lease {i + 1}</h6>
            <img src={File} />
          </div>
          <hr style={{ opacity: 1 }} className="mb-0 mt-2" />
        </div>
      ))}
      {pageURL[3] !== "owner" ? (
        <div>
          <Button
            variant="outline-primary"
            style={smallPillButton}
            onClick={addDocument}
          >
            Add Document
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default LeaseDocs;
