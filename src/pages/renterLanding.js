import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import PropertyCard from "../components/tenantComponents/PropertyCard";
import { get } from "../utils/api";
import RenterMap from "../icons/RenterRoadMap.webp";
import "./renterLand.css";
const useStyles = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 6px 6px 6px", // <-- arbitrary value
    },
  },
});
export default function RenterLanding() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  // sorting variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const getDataFromApi = async () => {
    //process to get data from aateButtons(pi using axios
    // axios
    //   .get(
    //     "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/availableProperties"
    //   )
    //   .then((response) => {
    //     console.log(response.data.result);
    //     setData(response.data.result); //useState is getting the data
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    const response = await get(`/availableProperties`);
    console.log(response);
    const res = response.result;
    if (res) {
      res.forEach((property) => {
        if (property.images && property.images.length) {
          property.images = JSON.parse(property.images);
        }
      });
    }
    await setData(res);
  };
  useEffect(() => {
    // so that this program doesn't run too many times.
    getDataFromApi();
  }, []);
  console.log(data);

  const featuredProperties = data;

  console.log(featuredProperties);
  const colors = ["#628191", "#FB8500", "rgb(255,183,3)", "rgb(33,158,188)"];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: "images",
      numeric: false,
      label: "Property Images",
    },
    {
      id: "address",
      numeric: false,
      label: "Street Address",
    },
    {
      id: "city",
      numeric: false,
      label: "City,State",
    },
    {
      id: "zip",
      numeric: true,
      label: "Zip",
    },
    {
      id: "listed_rent",
      numeric: true,
      label: "Rent",
    },
    {
      id: "type",
      numeric: true,
      label: "Type",
    },
    {
      id: "beds",
      numeric: true,
      label: "Size",
    },
  ];
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="center"
              size="small"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                align="center"
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const mapProperty = featuredProperties?.map((prop, index) => {
    if (prop.featured == "True") {
      return (
        <PropertyCard
          color={colors[index % 4]}
          add1={prop.address}
          cost={prop.listed_rent}
          bedrooms={prop.num_beds}
          bathrooms={prop.num_baths}
          property_type={prop.property_type}
          city={prop.city}
          imgSrc={prop.images}
          uid={prop.property_uid}
          property={prop}
          unit={prop.unit}
          description={prop.description}
        />
      );
    } else {
    }
  });
  return (
    <div className="main-renter-page">
      {/* <LandingNavbar/> */}
      <img className="main-img" src={RenterMap} />
      <h1>Search For Your New Home </h1>
      <div className="options">
        {/* <div className="o">All cities</div>
        <div className="o">All neighborhoods</div>
        <div className="o">Bedrooms</div> */}
        <div className="o search" onClick={() => setShowTable(true)}>
          Search
        </div>
      </div>
      <h1>Schedule A Tour Today</h1>
      <h1>Featured Properties</h1>
      {/* <PropertyCard propImg={PropImg}/> */}
      {data.length !== 0 && <div className="p-container">{mapProperty}</div>}
      {showTable ? (
        <Row className="m-3">
          <Table classes={{ root: classes.customTable }} size="small">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />{" "}
            <TableBody>
              {stableSort(data, getComparator(order, orderBy)).map(
                (property, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={property.address}
                    >
                      <TableCell padding="none" size="small" align="center">
                        {property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            // onClick={() => {
                            //   navigate(
                            //     `/manager-properties/${property.property_uid}`,
                            //     {
                            //       state: {
                            //         property: property,
                            //         property_uid: property.property_uid,
                            //       },
                            //     }
                            //   );
                            // }}
                            alt="Property"
                            style={{
                              borderRadius: "4px",
                              objectFit: "cover",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.address}
                        {property.unit !== "" ? " " + property.unit : ""}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.city}, {property.state}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.zip}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.listed_rent}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.property_type}
                      </TableCell>
                      <TableCell padding="none" size="small" align="center">
                        {property.num_beds + "/" + property.num_baths}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </Row>
      ) : (
        ""
      )}
    </div>
  );
}
