import react from "react"
import { useNavigate } from "react-router-dom";
import Apply from "../../icons/ApplyIcon.svg";
import Phone from "../../icons/Phone.svg";
import Message from "../../icons/Message.svg";
//this is the colored boxed property card
export default function PropertyCard(props){
    console.log("in property card 2")
    // if(part!=2){
        // const imgS = JSON.parse(props.imgSrc)

    // }
    const navigate = useNavigate();

    const goToApplyToProperty = () => {
        // navigate("/applyToProperty");
        navigate(`/tenantPropertyView/${props.property_uid}`)
    }
    const goToPropertyInfo = () =>{
        
        navigate('/propertyInfo',{
            state:{
                property: props.property,
                type: 1,
            }
        });
    }
    return(
        <div className="prop-card" style={{background:props.color}} onClick = {goToPropertyInfo}>
            <div className="left-side">
                {props.unit!=="" ? <h2 className="p1">{props.add1} , {props.unit}</h2>:
                     <h2 className="p1">{props.add1}</h2>
                }
                <h2 className="p2">${props.cost}/month</h2>
                <h3 className="p3">{props.bedrooms} Bedroom {props.bathrooms} Bathroom</h3>
                <h3 className="p4">Bright Spacious {props.property_type} located in the city of {props.city}</h3>
                {/* {props.unit !== "" && <h4 className="p5">Unit Number: </h4>} */}
                <button className="read-more" style={{background:props.color}} >Read More</button>
            </div>
            
            <div className="right-side">
                <img className="card-img" src = {props.part !== 2? JSON.parse(props.imgSrc)[0]:props.imgSrc[0]}></img>
                {props.part == 2 && 
                <div className= "contacts">
                    <div>
                        {/* {console.log("im trying to print an apply button")} */}
                        <img src={Apply} onClick={goToApplyToProperty} alt="documentIcon"  />
                        <div className="mask flex-center">
                            <p className="white-text" style={{fontSize:"14px"}}>Apply</p>
                        </div>
                    </div>
                    <div>
                        <img
                            // onClick={() =>
                            //     (window.location.href = `tel:${property.manager_phone_number}`)
                            //     }
                            src={Phone}
                            style={{marginRight:"10px"}}
                        />
                        <div className="mask flex-center">
                            <p className="white-text" style={{fontSize:"14px" ,marginRight:"0px"}}>Call</p>
                        </div>

                    </div>
                    <div>
                    <img
                        // onClick={() =>
                        //     (window.location.href = `mailto:${property.manager_email}`)
                        //     }
                            src={Message}
                            style={{marginRight:"10px"}}
                        />
                        <div className="mask flex-center">
                            <p className="white-text" style={{fontSize:"14px",marginLeft:"0px"}}>Email</p>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}