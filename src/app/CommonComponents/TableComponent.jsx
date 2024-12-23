import { useState } from "react";
import {
    Box,
    Icon,
    Table,
    styled,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    IconButton,
    Typography,
    TableSortLabel,
    Paper,
    TableContainer
} from "@mui/material";
import { getDate } from "@app/Utils/utils";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DOMPurify from 'dompurify';

// STYLED COMPONENTS
const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    tableLayout: "fixed", // Ensures columns adjust evenly
    width: "100%", // Ensures the table spans the full width
    "& thead": {
        "& tr": { "& th": { padding: "8px", fontSize: 17 } }
    },
    "& tbody": {
        "& tr": { "& td": { padding: "8px", textTransform: "capitalize" } }
    },
}));

const StyledTableContainer = styled(TableContainer)(() => ({
    width: "100%", // Ensure the container spans the full page width
    overflowX: "auto",
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555',
    },
}));

export default function PaginationTable({ headCells = [], data = [], actionBtn, style }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedRows = data.length > 0 && data.slice().sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    return (
        <Box sx={{
            width: '100%', // Ensure the box spans the full width of the page
            ...style
        }}>
            <StyledTableContainer>
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            {headCells.length > 0 && headCells.map(({ label, key, align, isCheckbox }, i) => {
                                if (label == 'ID') {
                                    return (<TableCell key={i} style={{ fontWeight: 'bold', width: "100%",display:'block' }} align={align || 'center'}>
                                        <TableSortLabel
                                            active={orderBy === key}
                                            direction={orderBy === key ? order : 'asc'}
                                            onClick={() => handleSortRequest(key)}
                                        >
                                            ID
                                        </TableSortLabel>
                                    </TableCell>)
                                } else if (isCheckbox) {
                                    <TableCell key={i} style={{ fontWeight: 'bold', width: "100%",display:'block' }} align={align || 'center'}>
                                        <TableSortLabel
                                            style={{width: "100%",display:'block'}}
                                            active={orderBy === key}
                                            direction={orderBy === key ? order : 'asc'}
                                            onClick={() => handleSortRequest(key)}
                                        >
                                            {label}
                                        </TableSortLabel>
                                    </TableCell>
                                } else {
                                    return (
                                        <TableCell key={i} style={{ fontWeight: 'bold', width: "50%", }} align={align || 'center'}>
                                            <TableSortLabel
                                                style={{ wordBreak: 'break-word' }}
                                                active={orderBy === key}
                                                direction={orderBy === key ? order : 'asc'}
                                                onClick={() => handleSortRequest(key)}
                                            >
                                                {label}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                }
                            })}
                            {actionBtn && <TableCell style={{ position: 'sticky', top: 0, fontWeight: 'bold', width: "40%", wordBreak: 'break-word' }} align="center">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRows.length > 0 ? (
                            sortedRows.map((subscriber, index) => (
                                <TableRow key={index}>
                                    {/* {headCells.map(({ key, date, html }) => (
                                        <TableCell style={{ wordBreak: 'break-word' }} key={key} align="center">
                                            {date || key === 'createdAt'
                                                ? getDate(subscriber[key], "DD-MM-YYYY")
                                                : html
                                                    ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subscriber[key]) }}
                                                        />
                                                    )
                                                    : subscriber[key]}
                                        </TableCell>
                                    ))} */}
                                    {headCells.map(({ key, date, html, isCheckbox, CheckBoxCom }, i) => (
                                        <>
                                            {(CheckBoxCom && isCheckbox) ? <TableCell key={i} style={{ wordBreak: 'break-word' }} align="center">{CheckBoxCom}</TableCell> :

                                                <TableCell style={{ wordBreak: 'break-word' }} key={key} align="center">
                                                    {date || key === 'createdAt' ? (
                                                        getDate(subscriber[key], "DD-MM-YYYY")
                                                    ) : html ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subscriber[key]) }}
                                                        />
                                                    ) : (
                                                        subscriber[key]
                                                    )}
                                                </TableCell>}
                                        </>
                                    ))}

                                    {actionBtn && <TableCell  style={{ wordBreak: 'break-word' }} align="center">{actionBtn(subscriber)}</TableCell>}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={headCells.length + (actionBtn ? 1 : 0)} align="center">
                                    <Paper elevation={0} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 300,
                                    }}>
                                        <SearchOffIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            No data available
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Try adjusting your search or filter to find what you're looking for.
                                        </Typography>
                                    </Paper>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>
        </Box>
    );
}


// import { useState } from "react";
// import {
//     Box,
//     Icon,
//     Table,
//     styled,
//     TableRow,
//     TableBody,
//     TableCell,
//     TableHead,
//     IconButton,
//     TablePagination,
//     Typography,
//     TableSortLabel,
//     Paper,
//     TableContainer
// } from "@mui/material";
// import { getDate } from "@app/Utils/utils";
// import SearchOffIcon from '@mui/icons-material/SearchOff';
// import DOMPurify from 'dompurify';
// // STYLED COMPONENT
// const StyledTable = styled(Table)(() => ({
//     // width: '100%',
//     whiteSpace: "pre",
//     "& thead": {
//         "& tr": { "& th": { paddingLeft: 0, paddingRight: 0, fontSize: 17 } }
//     },
//     "& tbody": {
//         "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
//     },
//     maxWidth: 1500,
//     // tableLayout: "a",
//     '&::-webkit-scrollbar': {
//         width: '8px',
//     },
//     '&::-webkit-scrollbar-thumb': {
//         backgroundColor: '#888', // Scrollbar thumb color
//         borderRadius: '8px',
//     },
//     '&::-webkit-scrollbar-thumb:hover': {
//         backgroundColor: '#555', // Hover effect on scrollbar thumb
//     },
// }));


// export default function PaginationTable({ headCells = [], data = [], actionBtn, style }) {
//     const [order, setOrder] = useState('asc');
//     const [orderBy, setOrderBy] = useState('');

//     const handleSortRequest = (property) => {
//         const isAsc = orderBy === property && order === 'asc';
//         setOrder(isAsc ? 'desc' : 'asc');
//         setOrderBy(property);
//     };

//     const sortedRows = data.length > 0 && data.slice().sort((a, b) => {
//         if (order === 'asc') {
//             return a[orderBy] > b[orderBy] ? 1 : -1;
//         } else {
//             return a[orderBy] < b[orderBy] ? 1 : -1;
//         }
//     });

//     const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//         // maxWidth:'100vh',
//         // maxHeight: '100vh',
//         overflowX: 'auto',
//         '&::-webkit-scrollbar': {
//             width: '10px',
//         },
//         '&::-webkit-scrollbar-track': {
//             background: theme.palette.grey[200],
//         },
//         '&::-webkit-scrollbar-thumb': {
//             background: 'gray',
//             borderRadius: '10px',
//         },
//         '&::-webkit-scrollbar-thumb:hover': {
//             background: theme.palette.primary.dark,
//         },
//     }));

//     return (
//         <Box sx={{
//             maxWidth: '100%',
//             ...style
//         }} overflowX="auto">
//             <StyledTableContainer>
//                 <StyledTable aria-label="data table">
//                     <TableHead>
//                         <TableRow>
//                             {headCells.length > 0 && headCells.map(({ label, key, align }) => {
//                                 if (label == 'ID') {
//                                     return (<TableCell style={{ position: 'sticky', top: 0, fontWeight: 'bold', width: "30%", }} align={align || 'center'}>
//                                         <TableSortLabel
//                                             active={orderBy === key}
//                                             direction={orderBy === key ? order : 'asc'}
//                                             onClick={() => handleSortRequest(key)}
//                                         >
//                                             ID
//                                         </TableSortLabel>
//                                     </TableCell>)
//                                 } else {
//                                     return (
//                                         <TableCell style={{ position: 'sticky', top: 0, fontWeight: 'bold', width: "50%", }} align={align || 'center'}>
//                                             <TableSortLabel
//                                                 style={{ wordBreak: 'break-word' }}
//                                                 active={orderBy === key}
//                                                 direction={orderBy === key ? order : 'asc'}
//                                                 onClick={() => handleSortRequest(key)}
//                                             >
//                                                 {label}
//                                             </TableSortLabel>
//                                         </TableCell>
//                                     )
//                                 }
//                             })}
//                             {actionBtn && <TableCell style={{ position: 'sticky', top: 0, fontWeight: 'bold', width: "40%", wordBreak: 'break-word' }} align="center">Actions</TableCell>}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {sortedRows.length > 0 ? (
//                             sortedRows.map((subscriber, index) => {
//                                 return (
//                                     <TableRow>
//                                         {
//                                             headCells.map(({ key, date, html }) => {
//                                                 if (key == 'createdAt') {
//                                                     return (
//                                                         <>
//                                                             <TableCell style={{ wordBreak: 'break-word' }} key={index} align="center">{getDate(subscriber[key], "DD-MM-YYYY hh:mm A")}</TableCell>
//                                                         </>
//                                                     )
//                                                 } else if (date) {
//                                                     return (
//                                                         <>
//                                                             <TableCell style={{ wordBreak: 'break-word' }} key={index} align="center">{getDate(subscriber[key], "DD-MM-YYYY")}</TableCell>
//                                                         </>
//                                                     )
//                                                 } else if (key == 'id') {
//                                                     return (
//                                                         <>
//                                                             <TableCell style={{ wordBreak: 'break-word' }} key={index} align="center">{index + 1}</TableCell>
//                                                         </>
//                                                     )
//                                                 } else if (html) {
//                                                     return (
//                                                         <>
//                                                             <TableCell
//                                                                 align="center"
//                                                                 sx={{
//                                                                     whiteSpace: 'normal', // Allow text wrapping
//                                                                     wordBreak: 'break-word', // Handle long words
//                                                                     padding: '10px', // Adjust padding if needed
//                                                                 }}
//                                                             >
//                                                                 <div
//                                                                     style={{ overflowX: 'auto', maxWidth: '100%' }}
//                                                                     dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subscriber[key]) }}
//                                                                 ></div>
//                                                             </TableCell>
//                                                         </>
//                                                     )
//                                                 }
//                                                 else {
//                                                     return (
//                                                         <>
//                                                             <TableCell style={{ wordBreak: 'break-word' }} key={index} align="center">{subscriber[key]}</TableCell>
//                                                         </>
//                                                     )
//                                                 }
//                                             }
//                                             )
//                                         }
//                                         {actionBtn && <TableCell style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }} key={index} align="center">{actionBtn(subscriber)}</TableCell>}
//                                     </TableRow>

//                                 )
//                             })
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={12} sx={{ borderBottom: 'none', padding: 0 }}>
//                                     <Paper
//                                         elevation={0}
//                                         sx={{
//                                             display: 'flex',
//                                             flexDirection: 'column',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             height: 300, // Adjust height to ensure it looks centered
//                                             backgroundColor: '#f9f9f9',
//                                             color: 'text.secondary',
//                                             textAlign: 'center',
//                                         }}
//                                     >
//                                         <SearchOffIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
//                                         <Typography variant="h6" gutterBottom>
//                                             No data available
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Try adjusting your search or filter to find what you're looking for.
//                                         </Typography>
//                                     </Paper>
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </StyledTable>
//             </StyledTableContainer>
//         </Box>
//     );
// }