import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import moment from 'moment';


const formatDate = (value) => {
  if(value === null){
    return "---";
  }
  const date =  moment(value);
  const formattedDate = date.format('Do MMM YY [at] h:mm:ss A');
  return formattedDate;
};

const convertToTime = (value) => {
  if (value === 0) {
    return "0sec";
  }

  const duration = moment.duration(value, 'seconds');
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  const result = [];

  if (hours > 0) {
    result.push(`${hours}hr`);
  }

  if (minutes > 0) {
    result.push(`${minutes}min`);
  }

  if (seconds > 0) {
    result.push(`${seconds}sec`);
  }

  return result.join(' ');
};

const columns = [
  { id: 'startByOperator', label: 'Start By', minWidth: 100, format: (value) => value? value:"---", },
  { id: 'endByOperator', label: 'Stop By', minWidth: 100, format: (value) => value? value:"---", },
  { id: 'startTime', label: 'Start\u00a0At', minWidth: 120, format: (value) => formatDate(value), },
  { id: 'endTime', label: 'Stop\u00a0At', minWidth: 120, format: (value) => formatDate(value), },
  {
    id: 'duration',
    label: 'Duration',
    minWidth: 80,
    align: 'right',
    format: (value) => value? convertToTime(value):"---",
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

  // eslint-disable-next-line
  function EnhancedTableToolbar(props) {
    const { numSelected } = props;
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Activity
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }

  

  return (
    <Paper sx={{ width: '100%', background: (t) =>
    t.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(225,225,225,0.4)',
  boxShadow: (t) => t.palette.mode === 'dark' ? '0px 0px 16px -2px rgba(255,255,255,0.1)' : '',}}>
    
    {/* <EnhancedTableToolbar numSelected={0} /> */}
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
            {activityState.filteredData
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
        count={activityState.filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}