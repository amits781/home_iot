import * as React from 'react';
import Box from '@mui/material/Box';
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
import GlassSurface from '../LiquidGlass/GlassSurface';
import { getHeadersFromToken, hostUrl } from '../Utils/Utils';
import { useAuth } from '@clerk/clerk-react';


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

// Radius of the header's outer top corners. Smaller than the glass panel's
// own 28px so the header reads as a pane sitting inside the panel rather than
// fighting its curve.
const HEADER_RADIUS = 16;

// `stickyHeader` fills head cells with an opaque `palette.background.default`
// so scrolled rows can't show through, which lands as a solid black rectangle
// inside the rounded glass panel. Swap it for a translucent dark pane: the
// blurred wallpaper the GlassSurface already refracts shows through it, and
// rounding the first/last cell's outer top corner lets the bar follow the
// panel instead of cutting a square out of it.
const headCellSx = (isFirst, isLast) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.42)',
  backdropFilter: 'blur(14px) saturate(140%)',
  WebkitBackdropFilter: 'blur(14px) saturate(140%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
  ...(isFirst && { borderTopLeftRadius: HEADER_RADIUS }),
  ...(isLast && { borderTopRightRadius: HEADER_RADIUS }),
});

const columns = [
  { id: 'startByOperator', label: 'Start By', minWidth: 100, format: (value) => value? value:"---", },
  { id: 'endByOperator', label: 'Stop By', minWidth: 100, format: (value) => value? value:"---", },
  { id: 'startTime', label: 'Start At', minWidth: 120, format: (value) => formatDate(value), },
  { id: 'endTime', label: 'Stop At', minWidth: 120, format: (value) => formatDate(value), },
  {
    id: 'duration',
    label: 'Duration',
    minWidth: 80,
    align: 'right',
    format: (value) => value? convertToTime(value):"---",
  },
];

export default function StickyHeadTable({ fromDate, toDate }) {
  const { getToken } = useAuth();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Reset back to the first page whenever the date filter changes, since the
  // previously selected page may no longer exist in the new, filtered range.
  React.useEffect(() => {
    setPage(0);
  }, [fromDate, toDate]);

  React.useEffect(() => {
    let cancelled = false;

    const fetchActivities = async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(rowsPerPage),
      });
      if (fromDate) {
        params.set('from', fromDate.format('YYYY-MM-DD'));
      }
      if (toDate) {
        params.set('to', toDate.format('YYYY-MM-DD'));
      }

      try {
        const token = await getToken();
        const response = await fetch(`${hostUrl}/activities?${params.toString()}`, {
          method: 'GET',
          headers: getHeadersFromToken(token),
        });
        const responseData = await response.json();

        if (!cancelled && response.status === 200) {
          const pageData = responseData.payload;
          setRows(pageData.content);
          setTotalCount(pageData.totalElements);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();

    return () => {
      cancelled = true;
    };
  }, [page, rowsPerPage, fromDate, toDate, getToken]);

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
    <GlassSurface padding='0px' borderRadius={28} sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          {/* Cell border-radius is ignored under the default collapsed
              border model, so the header's rounded corners need separated
              borders; zero spacing keeps the rows looking identical. */}
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={headCellSx(index === 0, index === columns.length - 1)}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </GlassSurface>
  );
}
