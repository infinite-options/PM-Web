import react from "react"

export default function PropertyCard(props){
    return(
        <div className="prop-card" style={{background:props.color}}>
            <div className="left-side">
                <h2 className="p1">{props.add1}</h2>
                <h2 className="p2">{props.cost}/month</h2>
                <h3 className="p3">{props.bedrooms} Bedroom {props.bathrooms} Bathroom</h3>
                <h3 className="p4">Bright Spacious apartment located in the Castro District</h3>
            </div>
            {/* <div className="right-side">
                <img src = {props.propImg}></img>
            </div> */}
        </div>
    )
}