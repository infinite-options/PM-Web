
import react from "react"

export default function PersonalInfo(props){
    console.log(props.data);
    
    return(
        <div className= "profile">
            Profile
            <br></br>
            Personal Info
            <table className="table-upcoming-payments profTable">

            <tbody>
                <tr>
                    <th className="table-col">Phone</th>
                    <th className="table-col">{props.data.properties[0].tenantInfo[0].tenant_phone_number}</th>
                </tr>
                <tr>
                    <th className="table-col">Email</th>
                    <th className="table-col">{props.data.properties[0].tenantInfo[0].tenant_email}</th>
                </tr>
                <tr>
                    <th className="table-col">Birthday</th>
                    <th className="table-col">No info</th>
                </tr>
                <tr>
                    <th className="table-col">SSN</th>
                    <th className="table-col">{props.data.tenant_ssn}</th>
                </tr>
            </tbody>

            </table>
            Children
            <table className="table-upcoming-payments">

            <tbody>
                <tr>
                    <th>Children Occupants: </th>
                    <th>{props.data.properties[0].children_occupants}</th>
                </tr>
            </tbody>
            </table>

            

        </div>

        
    )
}