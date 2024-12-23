import React, { Fragment, useState } from 'react';
// import {  } from '@mui/material';
import { styled } from '@mui/system';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Button, Container, Paper } from '@mui/material';
import { Bed, Group, House, Room } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import { useGetApi } from '@app/Utils/CustomHooks';
import { PropertyList, StackCards } from './shared';

const FixedHeightPaper = styled(Paper)(({ theme }) => ({
    height: 240,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: theme.shadows[6],
    },
}));

const IconContainer = styled(CardMedia)(({ theme }) => ({
    width: 60,
    height: 60,
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
}));


const ContentBox = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" }
}));


const Dashboard = () => {
    const dispatch = useDispatch()
    const { open, message, severity } = useSelector((state) => state.snack);
    const { user } = useSelector(state => state.auth);
    const [show, setShow] = useState(false)



    const stacklist = [
        { name: 'Total Property', Icon: House, count: 10, key: '' },
        { name: 'Total Rooms', Icon: Room, count: 48, key: '' },
        { name: 'Active Tenants', Icon: Group, count: 3, key: '' },
        { name: 'Void Rooms', Icon: Bed, count: 8, key: '' },
    ]


    return (
        <Fragment>
            <ContentBox className="analytics">
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {/* <StackCards cardList={stacklist} /> */}
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <PropertyList />
                    </Grid>

                </Grid>
            </ContentBox>
        </Fragment>


    );
};

export default Dashboard;
