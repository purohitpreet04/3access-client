import { Box, Card, Grid, IconButton, styled, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ArrowRightAlt } from "@mui/icons-material";
import { Small } from "@app/Components/Typography";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(115deg, #4780b8, #495374)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  marginLeft: 10,
  width: "250px",
  height: "150px",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center", // Center text under icons
  gap: theme.spacing(1), // Better spacing
  "& .icon": {
    fontSize: "36px",
    color: "white", // Icon color
  },
  "& small": {
    fontSize: "16px", // Slightly larger text for readability
    color: "white", // Text color
  },
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: theme.spacing(1),
  fontSize: "16px",
  fontWeight: "600", // Stronger weight for better emphasis
  color: theme.palette.primary.main,
}));

const StackCards = ({ cardList = [{ Icon: {}, name: '', path: '', count: 0 }] }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
 
  if (cardList.length === 0) {
    return null
  }

  return (
    <Box sx={{ mb: "24px", overflowX: "auto", }}>
      <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
        {cardList && cardList.length !== 0 ? cardList.map((item, index) => {
          let { Icon, name, path, count } = item || {}
          return (
            // <Grid item xs={6} md={4} lg={3} key={index}>
            <StyledCard sx={{
              margin: { xs: "10px", sm: "10px", md: "10px", lg: "10px" },
              padding: { xs: "16px", sm: "20px", md: "24px" }, // Adjust padding based on screen size
            }} key={index}>
              <ContentBox>
                <Box gap={1} display='flex' flexDirection='row' justifyContent='center' alignItems='center' >
                  {Icon && <Icon className="icon" />}
                  <Small sx={{ fontWeight: 'bold' }}>{name}</Small>
                </Box>
                <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{count}</Typography>
              </ContentBox>
            </StyledCard>
            // </Grid>
          )
        }) : null}
      </Grid>
    </Box>
  );
}

export default StackCards;