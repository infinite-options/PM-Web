import React from "react"

export default function Maintenence(props){
    const main = props?.data; //array of objects 
    const noRows = "No data available"
    var counter = 0;
    //implement date.now and calculate amount of days
    const rows = main?.map((row,index)=>{//row is an element in the array 
        if(row.title != null){
            const numDays = (date_1, date_2) => {
                let difference = date_2.getTime() - date_1.getTime();
                let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
            
                return totalDays;
              };
              const created_date = new Date(row.request_created_date);
              // console.log(created_date)
              const current = new Date();
            counter+=1;
            const imgUrl = JSON.parse(row.images)
            return(
            
                <tr>
                    <th className="table-col">{counter}</th>
                    <th className="table-col">{props?.address}</th>
                    <th className="table-col">{row.title}</th>
                    <th className="table-col">{row.request_created_date.substring(0,10)}</th>
                    <th className="table-col">{numDays(created_date, current)}</th>
                    <th className="table-col">{row.priority}</th>
                    <th className="table-col">{row.request_status}</th>
                    <th className="table-col"><img src = {imgUrl[0]} className="table-img"></img></th>
                </tr>
            )
           
        }
        
    })
    return(
        <div className= "maintenence">
            Maintenence
            <table className="table-upcoming-payments">
            <thead>
                <tr className="table-row blue-text">
                    <th className="table-col">ID</th>
                    <th className="table-col">Address</th>
                    <th className="table-col">Issue</th>
                    <th className="table-col">Date Reported</th>
                    <th className="table-col">Days Open</th>
                    <th className="table-col">Type</th>
                    <th className="table-col">Status</th>
                    <th className="table-col">Upload Images</th>
            
                </tr>
            </thead>
            <tbody>
                {/* {main === '' && <tr className="table-row no-data">{noRows}</tr>} */}
                {/* {main?rows:<tr className="table-row no-data">{noRows} */}
                {rows}
            </tbody>

            </table>
        </div>
    )
}