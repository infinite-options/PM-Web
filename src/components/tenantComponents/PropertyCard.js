import react from "react"

export default function PropertyCard(props){
    const imgS = JSON.parse(props.imgSrc)
    return(
        <div className="prop-card" style={{background:props.color}}>
            <div className="left-side">
                <h2 className="p1">{props.add1}</h2>
                <h2 className="p2">${props.cost}/month</h2>
                <h3 className="p3">{props.bedrooms} Bedroom {props.bathrooms} Bathroom</h3>
                <h3 className="p4">Bright Spacious {props.property_type} located in the city of {props.city}</h3>
                <button className="read-more" style={{background:props.color}}>Read More</button>
            </div>
            
            <div className="right-side">
                <img className="card-img" src = {imgS}></img>
            </div>
        </div>
    )
}