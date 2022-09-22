import React from "react";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

export const SortableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Property Images</TableCell>
        <TableCell>Street Address</TableCell>
        <TableCell>City,State</TableCell>
        <TableCell>Zip</TableCell>
        <TableCell>Rent Status</TableCell>
        <TableCell>Days Late</TableCell>
        <TableCell>Maintenance Requests Open</TableCell>
        <TableCell>Longest duration</TableCell>
      </TableRow>
    </TableHead>
  );
};
