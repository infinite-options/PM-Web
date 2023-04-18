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
import File from "../../icons/File.svg";
import ImgIcon from "../../icons/ImgIcon.png";
import LinkIcon from "../../icons/LinkIcon.svg";
import DocIcon from "../../icons/DocIcon.png";
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
            <TableCell align="center">Manufacturer</TableCell>
            <TableCell align="center">Purchased From</TableCell>
            <TableCell align="center">Purchased On</TableCell>
            <TableCell align="center">Purchase Order Number</TableCell>
            <TableCell align="center">Installed On</TableCell>
            <TableCell align="center">Serial Number</TableCell>
            <TableCell align="center">Model Number</TableCell>
            <TableCell align="center">Warranty Till</TableCell>
            <TableCell align="center">Warranty Info</TableCell>
            <TableCell align="center">URLs</TableCell>
            <TableCell align="center">Images</TableCell>
            <TableCell align="center">Documents</TableCell>
          </TableRow>
        </TableHead>
        {/* {console.log("appliances", appliances, applianceState)} */}
        <TableBody>
          {appliances.map((appliance, i) => {
            return applianceState[0][appliance]["available"] == true ||
              applianceState[0][appliance]["available"] == "True" ? (
              <TableRow>
                <TableCell>{appliance}</TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["manufacturer"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["purchased_from"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["purchased"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["purchased_order"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["installed"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["serial_num"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["model_num"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["warranty_till"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["warranty_info"]}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["url"] !== undefined &&
                  applianceState[0][appliance]["url"].length > 0 ? (
                    <img
                      src={LinkIcon}
                      style={{
                        width: "15px",
                        height: "15px",
                      }}
                    />
                  ) : (
                    "None"
                  )}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["images"] !== undefined &&
                  applianceState[0][appliance]["images"].length > 0 ? (
                    <img
                      src={ImgIcon}
                      style={{
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  ) : (
                    "None"
                  )}
                </TableCell>
                <TableCell align="center">
                  {applianceState[0][appliance]["documents"] !== undefined &&
                  applianceState[0][appliance]["documents"].length > 0 ? (
                    <img
                      src={DocIcon}
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  ) : (
                    "None"
                  )}
                </TableCell>
                {/* <TableCell>{applianceState[0][appliance]["url"]}</TableCell>

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
                {applianceState[0][appliance]["documents"] !== undefined &&
                applianceState[0][appliance]["documents"].length > 0 ? (
                  <TableCell>
                    <Table
                      responsive="md"
                      classes={{ root: classes.customTable }}
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>

                          <TableCell>View</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {applianceState[0][appliance]["documents"].map(
                          (file, i) => {
                            return (
                              <TableRow>
                                <TableCell>{file.description}</TableCell>

                                <TableCell>
                                  <a
                                    href={file.link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={File}
                                      alt="open document"
                                      style={{
                                        width: "15px",
                                        height: "15px",
                                      }}
                                    />
                                  </a>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                ) : (
                  <TableCell>None</TableCell>
                )} */}
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
