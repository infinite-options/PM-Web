import React from "react"
import {useLocation} from 'react-router-dom';
import Appliances from "../components/tenantComponents/Appliances";
export default function PropertyInfo(){
    const location = useLocation();
    const data = location.state.property;
    const imgs = data.images;
    const util = Object.entries(JSON.parse(data.utilities));
    console.log(util);
    var counter = 0;
    const availUtils = util?.map((u)=>{
        
        if(u[1] == true){
            counter+=1;
            return(
                <h4>{counter}. {u[0]}</h4>
            )
        }
        
    })
    const showImgs = imgs?.map((img)=>{
        return(
            <img src={img}/>
        )
    })
    
    return(
        <div className="prop-info-container">
            <h3>{data.address}</h3>
            <h3>{showImgs}</h3>
            <h3>Appliances:</h3>
            <br></br>
            <Appliances data = {data.appliances}/>
            <h3>Property Type: {data.property_type}</h3>
            <h3>Included Utilities <br/></h3>
            {availUtils}
            <h3>Num Beds: {data.num_beds}</h3>
            <h3>Num Baths: {data.num_baths}</h3>
            <h3>Rent : ${data.listed_rent} / month</h3>
            <h3>Active Since: {data.active_date}</h3>
            <h3>Area : {data.area} SqFt</h3>
            <h3>City: {data.city}</h3>
        </div>
    )
}