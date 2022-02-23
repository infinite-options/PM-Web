import React,{ useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {Container} from 'react-bootstrap';
import Header from '../components/Header';
import { get } from "../utils/api";

import PropertyCard from '../components/PropertyCard';


function TenantAvailableProperties(props) {
    const {hideBackButton } = props;
    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            const response = await get( "/availableProperties");
            console.log(response);
            const res = response.result;
          if(res){
            res.forEach((property) => {
              if(property.images && property.images.length){
                 property.images = JSON.parse(property.images);
              }
            });
          }
            setProperties(res);
        };
        fetchProperties();
    }, []);


     return (
        <div className='mb-5 pb-5'>
          <Header title='Available Properties' leftText={hideBackButton ? '' : '< Back'} leftFn={() => navigate("/tenant")}
            rightText='Filter by' />
            {/* <Header title='Available Properties' 
            rightText='Filter by' /> */}
          <Container>
           
            {properties.map((value, i) => (
              <div  key={i} style={{marginBottom:"10px"}}>
                 <PropertyCard property={value}> 
                 </PropertyCard>
              </div>
            ))}
            
          </Container>
        </div>
      );
}

export default TenantAvailableProperties;
