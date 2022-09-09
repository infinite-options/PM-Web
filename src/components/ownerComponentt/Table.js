
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
  
  const rows = properties.map((row, index)=>{
    console.log(row.rentalInfo[4])
    const images = JSON.parse(row.images);
    return(
      <tr>
        <th>{images[3]}</th>
        <th>{row.address + " " + row.unit + ', ' + row.city + ', ' + row.state + ' ' + row.zip}</th>
        <th>{null}</th>
        <th>{"$"+row.listed_rent}</th>
        <th>{null}</th>
        <th>{row.property_type}</th>
        <th>{row.num_beds + '/' + row.num_baths}</th>
        <th>{null}</th>
        <th>{row.maintenanceRequests}</th>
        <th>{null}</th>
        <th>{row.num_beds}</th>
      </tr>
    )
  
  })
    return(
      <div>
      <table>
        <thead>
          <tr>
            <th>Indexes</th>
            <th>Addresses</th>
            <th>Tenant</th>
            <th>Rent</th>
            <th>Paid</th>
            <th>Type</th>
            <th>Size</th>
            <th>Cash Flow</th>
            <th>Maintenance</th>
            <th>Property Manager</th>
            <th>Lease End</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
    )
  }