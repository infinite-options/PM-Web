// import React from "react"
import axios from "axios"
import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from 'react';
import Navbar from "../components/ownerComponentt/NavBar"
import Table from '../components/ownerComponentt/Table'
export default function OwnerDashboard2(){
    const [ownerData, setOwnerData] = useState([]) 
    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        axios.get('https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/propertiesOwner?owner_id=100-000003')
        .then(res => {console.log(res.data.result);setOwnerData(res.data)})
        .catch(err => console.log(err))
    },[]);


    useEffect(() => {
        axios.get("https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/propertiesOwner?owner_id=100-000003")
        .then(res => {console.log(res.data); console.log(res.data.result[0].address);
            console.log(res.data.result[4].rentalInfo[0].tenant_first_name); console.log(res.data.result[0].owner[0].owner_first_name);setDataTable(res.data.result)})
          .catch(err => console.log(err))
      }, []);

    //   owner.owner_first_name
    
    return(
        
        <div className="OwnerDashboard2">
                {ownerData.length !== 0 && <h3 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>{ownerData.result[0].owner[0].owner_first_name + " " +ownerData.result[0].owner[0].owner_last_name}</h3> }
                <h8 style={{paddingLeft: "7rem", paddingTop:"2rem"}}>Owner</h8>
                
                <Row>
                    <Col xs={2}><Navbar/></Col>
                    <Col>{dataTable.length!==0 && <Table data ={dataTable}/>}</Col>
                </Row>
                


                
        </div>
    )
}
