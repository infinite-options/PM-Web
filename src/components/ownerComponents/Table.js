
// import './table.css'
// const Table = ({ data, column }) => {
//   return (
//     <table>
//       <thead>
//         <tr>
//           {column.map((item, index) => <TableHeadItem item={item} />)}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, index) => <TableRow item={item} column={column} />)}
//       </tbody>
//     </table>
//   )
// }

// const TableHeadItem = ({ item }) => <th>{item.heading}</th>
// const TableRow = ({ item, column }) => (
//   <tr>
//     {column.map((columnItem, index) => {
//       return <td>{item[`${columnItem.value}`]}</td>
//     })}

//   </tr>
// )

// export default Table
import React from "react";
import './table.css'
export default function Table(props){
  const properties = props.data;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d = new Date();
  const monthName= months[d.getMonth()]
  var total_rented = 0;
  var total_unpaid = 0;
  var total_paid = 0;
  const rows = properties.map((row, index)=>{
    if(row.owner_expected_revenue.length>0){
      if(row.owner_expected_revenue.amount_paid !== "Vacant"){
        total_rented = total_rented+1;
      }
      if(row.owner_expected_revenue.purchase_status === "UNPAID"){
        total_unpaid = total_unpaid+1;
      }
      if(row.owner_expected_revenue.purchase_status === "PAID"){
        total_paid = total_unpaid+1;
      }
    }
    
    // const tenant_check = () =>{
    //   if(typeof(row.rentalInfo.tenant_first_name) !== undefined || row.rentalInfo.tenant_first_name !== null){
    //     tenant_check = row.rentalInfo.tenant_first_name
    //   } else{
    //     tenant_check = "tenant not found"
    //   }
    // console.log(tenant_check)
    // }
    // console.log(row)

  //tests if the rentalInfo has info, then it would check if the tenant first name has information or not. 
  // if(row.rentalInfo.length !==0){
  //   if(row.rentalInfo[0].tenant_first_name.length!==0){
  //     console.log(row.rentalInfo[0].tenant_first_name)
  //   }else{
  //     console.log(row.rentalInfo[0])
  //   }
  // }else{
  //   console.log("no rentalInfo")
  // }

  
  const newimage = JSON.parse(row.images);
    return(
      
      <tr>
        <th><img style={{width:"150px"}} src ={newimage[0]}/></th>
        <th>{row.address + " " + row.unit + ', ' + row.city + ', ' + row.state + ' ' + row.zip}</th>
        <th style={{color:"blue"}}>{row.rentalInfo.length !==0 ? row.rentalInfo[0].tenant_first_name : "None"}</th>
        <th style={{color:"green"}}>{"$"+row.listed_rent}</th>
        <th>{row.owner_expected_revenue.length !==0 ? row.owner_expected_revenue[0].purchase_status : "None"}</th>
        <th style={{color:"blue"}}>{row.property_type}</th>
        <th style={{color:"blue"}}>{row.num_beds + '/' + row.num_baths}</th>
        <th>{"N/A"}</th>
        <th>{"N/A"}</th>
        <th style={{color:"blue"}}>{row.property_manager.length !==0 ? row.property_manager[0].manager_business_name : "None"}</th>
        <th style={{color:"blue"}}>{row.owner_expected_revenue.length !==0 ? row.owner_expected_revenue[0].lease_end : "None"}</th>
      </tr>
    )
  
  })
    return(
      <div>

      <table>
        <thead>
          <tr>
            <th colSpan={"2"} style={{fontSize: "40px", color:"blue"}}>{monthName + " "}{new Date().getFullYear()}</th>
            <th colSpan={"2"} style={{fontSize: "25px"}, {textAlign: "center"}}><span style={{color: "blue", fontSize: '40px'}}>{properties.length}</span>{"    Properties"}</th>
            <th colSpan={"2"} style={{fontSize: "25px"}, {textAlign: "center"}}><span style={{color: "Gold", fontSize: '40px'}}>{total_rented}</span>{" Rented"}</th>
            <th colSpan={"3"} style={{fontSize: "25px"}, {textAlign: "center"}}><span style={{color: "red", fontSize: '40px'}}>{total_unpaid}</span>{" Unpaid"}</th>
            <th colSpan={"2"} style={{fontSize: "25px"}, {textAlign: "center"}}><span style={{color: "green", fontSize: '40px'}}>{total_paid}</span>{" Paid"}</th>
          </tr>
          <tr>
            <th style={{textAlign: "center"}}>Images</th>
            <th style={{textAlign: "center"}}>Addresses</th>
            <th style={{textAlign: "center"}}>Tenant</th>
            <th style={{textAlign: "center"}}>Rent</th>
            <th style={{textAlign: "center"}}>Paid</th>
            <th style={{textAlign: "center"}}>Type</th>
            <th style={{textAlign: "center"}}>Size</th>
            <th style={{textAlign: "center"}}>Cash-Flow</th>
            <th style={{textAlign: "center"}}>Maintenance</th>
            <th style={{textAlign: "center"}}>Property Manager</th>
            <th style={{textAlign: "center"}}>Lease End</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
    )
  }