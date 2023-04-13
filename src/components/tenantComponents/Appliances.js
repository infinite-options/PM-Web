import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageModal from "../ImageModal";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "2px 2px",
      border: "0.5px solid grey ",
      wordBreak: "break-word",
    },
    width: "100%",
    tableLayout: "fixed",
  },
});
export default function Appliances(props) {
  const classes = useStyles();

  const { appliances, applianceState } = props;

  const showImage = (src) => {
    setOpenImage(true);
    setImageSrc(src);
  };
  const unShowImage = () => {
    setOpenImage(false);
    setImageSrc(null);
  };
  const [openImage, setOpenImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  return (
    <Row className="m-3" style={{ overflow: "scroll" }}>
      <ImageModal src={imageSrc} isOpen={openImage} onCancel={unShowImage} />
      <Table
        responsive="md"
        classes={{ root: classes.customTable }}
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell>Appliance</TableCell>
            <TableCell>Manufacturer</TableCell>
            <TableCell>Purchased From</TableCell>
            <TableCell>Purchased On</TableCell>
            <TableCell>Purchase Order Number</TableCell>
            <TableCell>Installed On</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Model Number</TableCell>
            <TableCell>Warranty Till</TableCell>
            <TableCell>Warranty Info</TableCell>
            <TableCell>URLs</TableCell>
            <TableCell>Images</TableCell>
          </TableRow>
        </TableHead>
        {/* {console.log("appliances", appliances, applianceState)} */}
        <TableBody>
          {appliances.map((appliance, i) => {
            return applianceState[0][appliance]["available"] == true ||
              applianceState[0][appliance]["available"] == "True" ? (
              <TableRow>
                <TableCell>{appliance}</TableCell>
                <TableCell>
                  {applianceState[0][appliance]["manufacturer"]}
                </TableCell>
                <TableCell>
                  {applianceState[0][appliance]["purchased_from"]}
                </TableCell>
                <TableCell>
                  {applianceState[0][appliance]["purchased"]}
                </TableCell>
                <TableCell>
                  {applianceState[0][appliance]["purchased_order"]}
                </TableCell>
                <TableCell>
                  {applianceState[0][appliance]["installed"]}
                </TableCell>
                <TableCell>
                  {applianceState[0][appliance]["serial_num"]}
                </TableCell>
                <TableCell>
                  {applianceState[0][appliance]["model_num"]}
                </TableCell>
                <TableCell>
                  {applianceState[0][appliance]["warranty_till"]}
                </TableCell>
                <TableCell>
                  {applianceState[0][appliance]["warranty_info"]}
                </TableCell>
                <TableCell>{applianceState[0][appliance]["url"]}</TableCell>

                {applianceState[0][appliance]["images"] !== undefined &&
                applianceState[0][appliance]["images"].length > 0 ? (
                  <TableCell>
                    <Row className="d-flex justify-content-center align-items-center p-1">
                      <Col className="d-flex justify-content-center align-items-center p-0 m-0">
                        <img
                          src={`${
                            applianceState[0][appliance]["images"][0]
                          }?${Date.now()}`}
                          style={{
                            borderRadius: "4px",
                            objectFit: "contain",
                            width: "50px",
                            height: "50px",
                          }}
                          onClick={() =>
                            showImage(
                              `${
                                applianceState[0][appliance]["images"][0]
                              }?${Date.now()}`
                            )
                          }
                          alt="Property"
                        />
                      </Col>
                    </Row>
                  </TableCell>
                ) : (
                  <TableCell>None</TableCell>
                )}
              </TableRow>
            ) : (
              ""
            );
          })}
        </TableBody>
      </Table>
    </Row>
  );
}
