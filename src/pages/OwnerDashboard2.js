import React from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/ownerComponentt/NavBar";
import Table from "../components/ownerComponentt/Table";
import Table2 from "../components/ownerComponentt/Table2";
import AppContext from "../AppContext";
import LandingNavbar from "./LandingNavbar";
import { get } from "../utils/api";
export default function OwnerDashboard2() {
  const [ownerData, setOwnerData] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userData, refresh } = useContext(AppContext);
  const { access_token, user } = userData;

  const fetchOwnerDashboard = async () => {
    if (access_token === null || user.role.indexOf("OWNER") === -1) {
      navigate("/");
      return;
    }
    const response = await get("/ownerDashboard", access_token);
    console.log("second");
    console.log(response);
    setIsLoading(false);

    if (response.msg === "Token has expired") {
      console.log("here msg");
      refresh();

      return;
    }
    setOwnerData(response);
    setDataTable(response.result);
  };

  useEffect(() => {
    console.log("in use effect");
    fetchOwnerDashboard();
  }, []);

  //   useEffect(() => {
  //     axios
  //       .get(
  //         "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/ownerDashboard?",
  //         {
  //           headers: {
  //             // 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2MjYwODg4MywianRpIjoiZTk4YThmNmEtNjUxMC00Y2IyLWJkM2EtNzQ3ZmUxNDIxNDJlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VyX3VpZCI6IjEwMC0wMDAwMTgiLCJmaXJzdF9uYW1lIjoiVmloYSIsImxhc3RfbmFtZSI6IlNoYWgiLCJwaG9uZV9udW1iZXIiOiI0MDg3Njc4MTU3IiwiZW1haWwiOiJ2aWhhLnNoYWhAc2pzdS5lZHUiLCJyb2xlIjoiVEVOQU5ULE9XTkVSIiwiZ29vZ2xlX2F1dGhfdG9rZW4iOiJ5YTI5LmEwQVZBOXkxdGxDd2RzZEwtTVg1SnFaN3l1Xy1MY2phZXFLZm5aNlE0SGZvY0cwaHMzQ3d2RVhmaFowUUxQcGs2RzN5STN6U3o1bUNaMGJqMHhvaEcxNDBDZHgzY1BBZzlsQ08xQ2NVUXRqZ3pER1NvM3dqdE1pRDMwRUllVjF5LWVISU85TUdEcnlzaWVfVDZpaXBHSTE2ODRoOS1JYUNnWUtBVEFTQVFBU0ZRRTY1ZHI4enA2NHVpS3kzMFI0UVptOW52TDBMQTAxNjMiLCJidXNpbmVzc2VzIjpbXX0sIm5iZiI6MTY2MjYwODg4MywiZXhwIjoxNjYyNjEyNDgzfQ.PehfaVCiNWlYNDy9fjn7MJc9Rqb9ajlCr2S2YpzHIa4'
  //             // 'Authorization': 'Bearer ' + access_token
  //             Authorization:
  //               "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2MzI3NDE3MSwianRpIjoiZDU1YTcyZDUtZTg4MS00NDIyLWFmYWYtYmU2NDVlY2I5NGFkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VyX3VpZCI6IjEwMC0wMDAwMDIiLCJmaXJzdF9uYW1lIjoiQW51IiwibGFzdF9uYW1lIjoiU2FuZGh1IiwicGhvbmVfbnVtYmVyIjoiMjEzODU4MTM0NCIsImVtYWlsIjoiYW51LnNhbmRodTc4OTNAZ21haWwuY29tIiwicm9sZSI6Ik1BTkFHRVIsT1dORVIsVEVOQU5ULE1BSU5URU5BTkNFIiwiZ29vZ2xlX2F1dGhfdG9rZW4iOiJ5YTI5LmEwQWE0eHJYTS16MEhFdTJpb2VUWW55c1d0VElnLTE2SDFQT05VMWlGYkNCS1hlSUVCLVdycjVlSk1DNURTdjU5LTFKQTlRSzI1anhmd2ZoMTE5dFVDcU1VeTVEUXVvSzdLS1F4TGQ3ei04cVVUMF9YZjNQOGpiYzRxQU5xSWhmdVZiVHA5YVZTRjVmbllZYU1BR2RnNnRmVndhN1FxOTRJYUNnWUtBVEFTQVJJU0ZRRWpEdkw5RjRiaGZJcEVZVUNDZmF6YUpyWDhhUTAxNjYiLCJidXNpbmVzc2VzIjpbeyJidXNpbmVzc191aWQiOiI2MDAtMDAwMDAxIiwiYnVzaW5lc3NfdHlwZSI6Ik1BTkFHRU1FTlQiLCJlbXBsb3llZV9yb2xlIjoiT3duZXIifSx7ImJ1c2luZXNzX3VpZCI6IjYwMC0wMDAwMDMiLCJidXNpbmVzc190eXBlIjoiTUFJTlRFTkFOQ0UiLCJlbXBsb3llZV9yb2xlIjoiT3duZXIifV19LCJuYmYiOjE2NjMyNzQxNzEsImV4cCI6MTY2MzI3Nzc3MX0.DktVw6ACqKB_oVtkIGhJssz88PwJj_3frUZVqP2B2HM",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         console.log(res);
  //         setOwnerData(res.data);
  //       })
  //       .catch((err) => console.log(err));
  //   }, []);
  //   useEffect(() => {
  //     axios
  //       .get(
  //         "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/ownerDashboard",
  //         {
  //           headers: {
  //             // 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2MjYwODg4MywianRpIjoiZTk4YThmNmEtNjUxMC00Y2IyLWJkM2EtNzQ3ZmUxNDIxNDJlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VyX3VpZCI6IjEwMC0wMDAwMTgiLCJmaXJzdF9uYW1lIjoiVmloYSIsImxhc3RfbmFtZSI6IlNoYWgiLCJwaG9uZV9udW1iZXIiOiI0MDg3Njc4MTU3IiwiZW1haWwiOiJ2aWhhLnNoYWhAc2pzdS5lZHUiLCJyb2xlIjoiVEVOQU5ULE9XTkVSIiwiZ29vZ2xlX2F1dGhfdG9rZW4iOiJ5YTI5LmEwQVZBOXkxdGxDd2RzZEwtTVg1SnFaN3l1Xy1MY2phZXFLZm5aNlE0SGZvY0cwaHMzQ3d2RVhmaFowUUxQcGs2RzN5STN6U3o1bUNaMGJqMHhvaEcxNDBDZHgzY1BBZzlsQ08xQ2NVUXRqZ3pER1NvM3dqdE1pRDMwRUllVjF5LWVISU85TUdEcnlzaWVfVDZpaXBHSTE2ODRoOS1JYUNnWUtBVEFTQVFBU0ZRRTY1ZHI4enA2NHVpS3kzMFI0UVptOW52TDBMQTAxNjMiLCJidXNpbmVzc2VzIjpbXX0sIm5iZiI6MTY2MjYwODg4MywiZXhwIjoxNjYyNjEyNDgzfQ.PehfaVCiNWlYNDy9fjn7MJc9Rqb9ajlCr2S2YpzHIa4'
  //             // 'Authorization': 'Bearer ' + access_token
  //             Authorization:
  //               "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2MzI3NDE3MSwianRpIjoiZDU1YTcyZDUtZTg4MS00NDIyLWFmYWYtYmU2NDVlY2I5NGFkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VyX3VpZCI6IjEwMC0wMDAwMDIiLCJmaXJzdF9uYW1lIjoiQW51IiwibGFzdF9uYW1lIjoiU2FuZGh1IiwicGhvbmVfbnVtYmVyIjoiMjEzODU4MTM0NCIsImVtYWlsIjoiYW51LnNhbmRodTc4OTNAZ21haWwuY29tIiwicm9sZSI6Ik1BTkFHRVIsT1dORVIsVEVOQU5ULE1BSU5URU5BTkNFIiwiZ29vZ2xlX2F1dGhfdG9rZW4iOiJ5YTI5LmEwQWE0eHJYTS16MEhFdTJpb2VUWW55c1d0VElnLTE2SDFQT05VMWlGYkNCS1hlSUVCLVdycjVlSk1DNURTdjU5LTFKQTlRSzI1anhmd2ZoMTE5dFVDcU1VeTVEUXVvSzdLS1F4TGQ3ei04cVVUMF9YZjNQOGpiYzRxQU5xSWhmdVZiVHA5YVZTRjVmbllZYU1BR2RnNnRmVndhN1FxOTRJYUNnWUtBVEFTQVJJU0ZRRWpEdkw5RjRiaGZJcEVZVUNDZmF6YUpyWDhhUTAxNjYiLCJidXNpbmVzc2VzIjpbeyJidXNpbmVzc191aWQiOiI2MDAtMDAwMDAxIiwiYnVzaW5lc3NfdHlwZSI6Ik1BTkFHRU1FTlQiLCJlbXBsb3llZV9yb2xlIjoiT3duZXIifSx7ImJ1c2luZXNzX3VpZCI6IjYwMC0wMDAwMDMiLCJidXNpbmVzc190eXBlIjoiTUFJTlRFTkFOQ0UiLCJlbXBsb3llZV9yb2xlIjoiT3duZXIifV19LCJuYmYiOjE2NjMyNzQxNzEsImV4cCI6MTY2MzI3Nzc3MX0.DktVw6ACqKB_oVtkIGhJssz88PwJj_3frUZVqP2B2HM",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         console.log(res);
  //         setDataTable(res.data.result);
  //       })
  //       .catch((err) => console.log(err));
  //   }, []);

  //   owner.owner_first_name
  return (
    <div className="OwnerDashboard2">
      {ownerData.length !== 0 && (
        <h3 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>
          {ownerData.result[0].owner[0].owner_first_name +
            " " +
            ownerData.result[0].owner[0].owner_last_name}
        </h3>
      )}
      <h8 style={{ paddingLeft: "7rem", paddingTop: "2rem" }}>Owner</h8>

      <Row>
        <Col xs={2}>
          <Navbar />
        </Col>
        <Col>{dataTable.length !== 0 && <Table data={dataTable} />}</Col>
      </Row>
      <Row>
        <Col xs={2}>{""}</Col>
        <Col>{dataTable.length !== 0 && <Table2 data={dataTable} />}</Col>
      </Row>
    </div>
  );
}
// important stuff
// import { get } from "../utils/api";
// import React, { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AppContext from "../AppContext";
// import axios from "axios"
// import { Row, Col } from "react-bootstrap";
// import Navbar from "../components/ownerComponentt/NavBar"
// import Table from '../components/ownerComponentt/Table'
// export default function OwnerDashboard2(){

// const navigate = useNavigate();
// const { userData, refresh } = useContext(AppContext);
// const { access_token, user } = userData;
// const [dataTable, setDataTable] = useState([]);

// const [isLoading, setIsLoading] = useState(true);

//   const fetchTenantDashboard = async () => {
//     if (access_token === null || user.role.indexOf("OWNER") === -1) {
//       navigate("/");
//       return;
//     }
//     const response = await get("/Dashboard", access_token);
//     console.log("second");
//     console.log(response);
//     setIsLoading(false);

//     if (response.msg === "Token has expired") {
//       console.log("here msg");
//       refresh();

//       return;
//     }
//     setDataTable(response);
//   };
// useEffect(() => {
//     console.log("in use effect");
//     fetchTenantDashboard();
// }, []);
// console.log(dataTable)
// console.log(access_token)
// const [ownerData, setOwnerData] = useState([])

// useEffect(() => {
//     axios.get('https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/propertiesOwner?owner_id=100-000003')
//     .then(res => {console.log(res.data.result);setOwnerData(res.data)})
//     .catch(err => console.log(err))
// },[]);
// end of important stuff

// useEffect(() => {
//     axios.get("https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/propertiesOwner?owner_id=100-000003")
//     .then(res => {console.log(res.data); console.log(res.data.result[0].address);
//         console.log(res.data.result[4].rentalInfo[0].tenant_first_name); console.log(res.data.result[0].owner[0].owner_first_name);setDataTable(res.data.result)})
//       .catch(err => console.log(err))
//   }, []);

//   owner.owner_first_name

//     return(

//         <div className="OwnerDashboard2">
//                 {ownerData.length !== 0 && <h3 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>{ownerData.result[0].owner[0].owner_first_name + " " +ownerData.result[0].owner[0].owner_last_name}</h3> }
//                 <h8 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>Owner</h8>

//                 <Row>
//                     <Col xs={2}><Navbar/></Col>
//                     <Col>{dataTable.length!==0 && <Table data ={dataTable}/>}</Col>
//                 </Row>

//         </div>
//     )
// }
