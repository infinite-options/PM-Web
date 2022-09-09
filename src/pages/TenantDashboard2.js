//I need to make this page the main page first
import React from "react"
import axios from "axios"
import TopBar from "../components/tenantComponents/TopBar"
export default function TenantDashboard2(){
    const [tenantData, setTenantData] = React.useState([]) 
    const getDataFromApi = () => { //process to get data from aateButtons(pi using axios
        axios.get('https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev/propertiesOwner?owner_id=100-000003')
        .then(response => {
          setTenantData(response.data) //useState is getting the data
          
    
        }).catch(err =>{
          console.log(err)
        })
        
    
    }
    React.useEffect(()=>{ //gets the data from api only once. 
        getDataFromApi();
    },[]) //empty brackets prevents stuff from refreshing
    // console.log(tenantData.result[0].owner[0].owner_first_name)
    return(
        <div>
            {/* <TopBar firstName={tenantData.result[0].address}/> */}
            {/* {typeof(tenantData)!=[] && <TopBar firstName={tenantData.result[0].address}/>} */}
            {/* <TopBar firstName={tenantData.result[0].address}/> */}
            {tenantData.length !== 0 && <TopBar firstName={tenantData.result[0].owner[0].owner_first_name}/> }
            Hello this is the tenant dashboard
        </div>
    )
}