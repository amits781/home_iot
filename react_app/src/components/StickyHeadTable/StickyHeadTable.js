import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';



const formatDate = (value) => {
  const dateObject = value === null?  null : new Date(value);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  return dateObject === null? "---" : dateObject.toLocaleString('en-US', options);
};

const columns = [
  { id: 'startByOperator', label: 'Started By', minWidth: 170, format: (value) => value? value:"---", },
  { id: 'endByOperator', label: 'Ended By', minWidth: 170, format: (value) => value? value:"---", },
  { id: 'startTime', label: 'Start\u00a0Time', minWidth: 100, format: (value) => formatDate(value), },
  { id: 'endTime', label: 'End\u00a0Time', minWidth: 100, format: (value) => formatDate(value), },
  {
    id: 'duration',
    label: 'Duration\u00a0(sec)',
    minWidth: 170,
    align: 'right',
    format: (value) => value? value.toLocaleString('en-US'):"---",
  },
];

export default function StickyHeadTable({ activityState }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  

  

  return (
    <Paper sx={{ width: '100%', background: (t) =>
    t.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(225,225,225,0.4)',
  boxShadow: (t) => t.palette.mode === 'dark' ? '0px 0px 16px -2px rgba(255,255,255,0.1)' : '',}}>
      <TableContainer sx={{ maxHeight: 440, }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activityState.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format 
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={activityState.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}