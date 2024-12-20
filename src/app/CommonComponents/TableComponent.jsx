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
    TablePagination,
    Typography,
    TableSortLabel,
    Paper
} from "@mui/material";
import { getDate } from "@app/Utils/utils";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DOMPurify from 'dompurify';
// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
    width: '100%',
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0, fontSize: 17 } }
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
    }
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
        <Box style={{ ...style }} overflow="auto">
            <StyledTable>
                <TableHead>
                    <TableRow>
                        {headCells.length > 0 && headCells.map(({ label, key, align }) => {
                            if (label == 'ID') {
                                return (<TableCell style={{ fontWeight: 'bold', width: "10%", }} align={align || 'center'}>
                                    <TableSortLabel
                                        active={orderBy === key}
                                        direction={orderBy === key ? order : 'asc'}
                                        onClick={() => handleSortRequest(key)}
                                    >
                                        ID
                                    </TableSortLabel>
                                </TableCell>)
                            } else {
                                return (
                                    <TableCell style={{ fontWeight: 'bold', width: "20%", }} align={align || 'center'}>
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
                        {actionBtn && <TableCell style={{ fontWeight: 'bold', width: "20%", }} align="center">Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedRows.length > 0 ? (
                        sortedRows.map((subscriber, index) => {
                            return (
                                <TableRow>
                                    {
                                        headCells.map(({ key, date, html }) => {
                                            if (key == 'createdAt') {
                                                return (
                                                    <>
                                                        <TableCell style={{ wordBreak: 'break-word' }} key={index} align="center">{getDate(subscriber[key], "DD-MM-YYYY hh:mm A")}</TableCell>
                                                    </>
                                                )
                                            } else if (date) {
                                                return (
                                                    <>
                                                        <TableCell style={{ wordBreak: 'break-word' }} key={index} align="center">{getDate(subscriber[key], "DD-MM-YYYY")}</TableCell>
                                                    </>
                                                )
                                            } else if (key == 'id') {
                                                return (
                                                    <>
                                                        <TableCell style={{ wordBreak: 'break-word' }} key={index} align="center">{index + 1}</TableCell>
                                                    </>
                                                )
                                            } else if (html) {
                                                return (
                                                    <>
                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                whiteSpace: 'normal', // Allow text wrapping
                                                                wordBreak: 'break-word', // Handle long words
                                                                padding: '10px', // Adjust padding if needed
                                                            }}
                                                        >
                                                            <div
                                                                style={{ overflowX: 'auto', maxWidth: '100%' }}
                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subscriber[key]) }}
                                                            ></div>
                                                        </TableCell>
                                                    </>
                                                )
                                            }
                                            else {
                                                return (
                                                    <>
                                                        <TableCell style={{ wordBreak: 'break-word' }} key={index} align="center">{subscriber[key]}</TableCell>
                                                    </>
                                                )
                                            }
                                        }
                                        )
                                    }
                                    {actionBtn && <TableCell style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }} key={index} align="center">{actionBtn(subscriber)}</TableCell>}
                                </TableRow>

                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={12} sx={{ borderBottom: 'none', padding: 0 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 300, // Adjust height to ensure it looks centered
                                        backgroundColor: '#f9f9f9',
                                        color: 'text.secondary',
                                        textAlign: 'center',
                                    }}
                                >
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

        </Box>
    );
}
