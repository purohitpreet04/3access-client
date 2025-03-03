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
    TableContainer,
    colors,
    FormControlLabel,
    Checkbox,
    Button
} from "@mui/material";
import { getDate } from "@app/Utils/utils";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import '../App.css';

// import { Field } from "formik";

const StyledTable = styled(Table)(({ theme }) => ({
    width: "100%",
    borderCollapse: "collapse", // Ensure proper border spacing
    "& thead": {
        backgroundColor: theme.palette?.primary?.light,
        "& th": {
            color: theme.palette.common.white,
            padding: theme.spacing(1),
            fontSize: 17,
            fontWeight: "bold",
            border: `1px solid ${theme.palette.divider}`
        }
    },
    "& tbody": {
        "& td": {
            padding: theme.spacing(1),
            textTransform: "capitalize",
            border: `1px solid ${theme.palette.divider}`,
            wordBreak: "break-word",
        },
        "& tr:hover": {
            backgroundColor: theme.palette.action.hover
        }
    },

    "& table": {
        tableLayout: "auto",
    },

}));


const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    width: "190%",
    overflowX: "auto",
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
    "&::-webkit-scrollbar": {
        width: 8,
        height: 8,
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.grey[500],
        borderRadius: 8,
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: theme.palette.grey[700],
    },

    "& css-1w9byxw-MuiTableContainer-roo": {
        width: "max-content"
    },

    "& span.MuiButtonBase-root.MuiTableSortLabel-root.css-1q574bi-MuiButtonBase-root-MuiTableSortLabel-root": {
        // display: "block",
        width: "max-content"
    },

    "& .MuiTableCell-root": {
        padding: "10px 16px",
        maxWidth: "fit-content",
        whiteSpace: "nowrap",
        width: "fit-content",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: "clamp(12px, 1vw, 16px)" /* Responsive font size */
    },

    '& .css-167e5dj': {
        width: "150%"
    }
}));

const TableCellstyle = styled(TableCell)(() => ({
    // fontSize: 20,
    fontWeight: 'bold',
    padding: "10px 16px !important",
    maxWidth: "fit-content !important",
    whiteSpace: "nowrap !important",
    width: "fit-content !important",
    overflow: "hidden !important",
    textOverflow: "ellipsis !important",
    fontSize: "clamp(12px, 1vw, 16px) !important"
}));


export default function PaginationTable({ headCells = [], data = [], actionBtn, style, rowStye = () => { }, cellStye = () => ({}), getSelectedRows }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selectedRows, setSelectedRows] = useState([])
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


    const handleSelectedRows = () => {
        getSelectedRows && getSelectedRows(selectedRows)
    }



    return (

        <StyledTableContainer sx={{ width: '100%', ...style }} overflowX="auto">
            <StyledTable sx={{ tableLayout: 'auto' }} aria-label="data table">
                <TableHead width="100%">
                    <TableRow >
                        {headCells.length > 0 && headCells.map(({ label, key, align, isCheckbox }, i) => {
                            if (label == 'ID') {
                                return (<TableCellstyle key={i} style={{ fontWeight: 'bold', fontSize: 20 }} >
                                    <TableSortLabel
                                        align={align || 'center'}
                                        active={orderBy === key}
                                        direction={orderBy === key ? order : 'asc'}
                                        onClick={() => handleSortRequest(key)}
                                    >
                                        ID
                                    </TableSortLabel>
                                </TableCellstyle>)
                            } else if (isCheckbox) {
                                return (
                                    <TableCellstyle key={i} style={{ fontWeight: 'bold', fontSize: 20, wordBreak: 'break-word' }} align={align || 'center'}>

                                        <label htmlFor="headcheckbox">
                                            <input
                                                id={`headcheckbox`}
                                                type="checkbox"
                                                checked={selectedRows.length == data?.length}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedRows((pre) => ([...sortedRows.map((row) => row?._id)]))
                                                    } else {
                                                        setSelectedRows([])
                                                    }
                                                }}
                                                name={"headcheckbox"}
                                                style={{ width: "20px", height: "20px", marginRight: "10px" }}
                                            />
                                            {label}
                                        </label>

                                    </TableCellstyle>
                                )

                            } else {
                                return (
                                    <TableCellstyle key={i}
                                        style={{ fontWeight: 'bold', fontSize: 20, wordBreak: 'break-word' }}
                                        align={align || 'center'}>
                                        <TableSortLabel
                                            align={align || 'center'}
                                            active={orderBy === key}
                                            direction={orderBy === key ? order : 'asc'}
                                            onClick={() => handleSortRequest(key)}
                                        >
                                            {label}
                                        </TableSortLabel>
                                    </TableCellstyle>
                                )
                            }
                        })}
                        {actionBtn && <TableCellstyle style={{ fontWeight: 'bold', fontSize: 20, wordBreak: 'keep-all' }} align="center">Actions</TableCellstyle>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedRows.length > 0 ? (
                        sortedRows.map((subscriber, index) => (
                            <TableRow key={index} style={{ ...rowStye(subscriber) }}>

                                {headCells.map(({ key, date, html, isCheckbox, CheckBoxCom, formate }, i) => {

                                    let testhtml = '<p>hbhjvghv</p>'
                                    let senizedData = DOMPurify.sanitize(subscriber[key], {
                                        ALLOWED_TAGS: ['table', 'tr', 'td', 'strong', 'br'],
                                        ALLOWED_ATTR: ['style']
                                    });

                                    // console.log(senizedData);

                                    return (
                                        <>
                                            {(CheckBoxCom && isCheckbox) ?
                                                <TableCell key={i} style={{ wordBreak: 'break-word' }} align="center">
                                                    <input
                                                        id={`checkbox-${subscriber?._id}`}
                                                        type="checkbox"
                                                        checked={selectedRows.includes(subscriber?._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedRows((pre) => ([...pre, subscriber?._id]))
                                                            } else {
                                                                setSelectedRows((pre) => ([...selectedRows.filter(id => id != subscriber?._id)]))
                                                            }
                                                        }}
                                                        name={`checkbox-${subscriber?._id}`}
                                                        style={{ width: "20px", height: "20px", marginRight: "10px" }}
                                                    />
                                                    {/* {CheckBoxCom} */}
                                                </TableCell> :
                                                <TableCell
                                                    sx={{

                                                    }}
                                                    style={{ wordBreak: 'break-word', fontSize: 18, ...cellStye(subscriber)[key] }} key={key} align="center">
                                                    {date || key === 'createdAt' ? (
                                                        getDate(subscriber[key], formate ? formate : "DD-MM-YYYY")
                                                    ) : html ? (
                                                        <Box sx={{
                                                            '& table': {
                                                                width: '100%',
                                                                borderCollapse: 'separate !important',
                                                                borderSpacing: '0',
                                                                margin: '0 !important',
                                                                border: 'none',
                                                            },
                                                            '& td': {
                                                                // padding: '4px 8px',
                                                                border: 'none',
                                                                verticalAlign: 'top',
                                                                fontSize: '0.875rem',
                                                                lineHeight: '1.5',
                                                            },
                                                            '& tr': {
                                                                background: 'transparent !important',
                                                            },
                                                            '& strong': {
                                                                fontWeight: 600,
                                                                color: 'inherit',
                                                            }
                                                        }} dangerouslySetInnerHTML={{ __html: senizedData }} >
                                                           
                                                        </Box>
                                                    ) : (
                                                        subscriber[key]
                                                    )}
                                                </TableCell>}
                                        </>
                                    )
                                })}

                                {actionBtn && <TableCell

                                    sx={{
                                        padding: "10px 16px !important",
                                        maxWidth: "fit-content !important",
                                        whiteSpace: "nowrap !important",
                                        width: "fit-content !important",
                                        overflow: "hidden !important",
                                        textOverflow: "ellipsis !important",
                                        fontSize: "clamp(12px, 1vw, 16px) !important"
                                    }}
                                    style={{ wordBreak: 'break-word', fontSize: 18 }} align="center">{actionBtn(subscriber)}</TableCell>}
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
                {selectedRows.length > 0 && <Box display={'flex'} gap={3} my={3}>
                    <Typography variant="h5" sx={{ color: "text.secondary", fontWeight: 400 }} >
                        Selected:{selectedRows.length}
                    </Typography>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => { handleSelectedRows() }}
                    >
                        Delete
                    </Button>
                </Box>
                }
        </StyledTableContainer>
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