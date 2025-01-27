import { memo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  styled,
  Avatar,
  Hidden,
  useTheme,
  MenuItem,
  IconButton,
  useMediaQuery
} from "@mui/material";

// import { NotificationProvider } from "app/contexts/NotificationContext";

// import useAuth from "app/hooks/useAuth";
import useSettings from "../../../hooks/useSettings";

import { Paragraph, Span } from "../../Typography";
// import ShoppingCart from "app/components/ShoppingCart";
import { MatxMenu, MatxSearchBox } from "../../index";
// import { NotificationBar } from "app/components/NotificationBar";
import { themeShadows } from "@app/Components/MatxTheme/themeColors";

import { topBarHeight } from "@app/Utils/constant";

import {
  Menu,
  Person,
  PowerSettingsNew,
} from "@mui/icons-material";
import API from "Constance";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@app/Redux/Sclice/AuthSclice";
import { setComData, setData, setSelectedData } from "@app/Redux/Sclice/MultiSelectSlice";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";
import { handleLogs, setIsLoading } from "@app/Redux/Sclice/manageStateSclice";
import HistoryIcon from '@mui/icons-material/History';
import { getAllRSL } from "../../../API/SideBarData";

// STYLED COMPONENTS
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease"
});

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 }
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" }
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary }
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" }
}));

const Layout1Topbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { user, status, loading, token } = useSelector(state => state.auth)

  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    // console.log(sidebarSettings)
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  const handleSidebarToggle = () => {
    // console.log('knfjdjnkd')
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  useEffect(() => {
    // getAllComapny()
    if (['agent'].includes(user.role) && [1].includes(user?.isMainMA)) {
      getSelectedData()
    }
  }, [user?._id])

  useEffect(() => {
    if (user?._id) {
      fetchData()
    }
  }, [user?._id])

  const fetchData = async () => {
    dispatch(getAllRSL({ user: user, isMainMa: user?.isMainMA }))
  };


  const handleLogout = async () => {
    try {
      // const res = await API.get('/logout')
      dispatch(logout({ navigate }))
      // navigate('/auth/login')
    } catch (error) {
      console.log(error)
    }
  }



  const getAllComapny = async () => {
    try {
      dispatch(setIsLoading({ data: true }))
      try {
        const res = await API.get('/api/property/getallcompany');
        if (res.data.message) {
          dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
        }

        dispatch(setIsLoading({ data: false }))
        dispatch(setComData(res.data.data))
        // console.log(res);
      } catch (error) {
        dispatch(setIsLoading({ data: false }))
        if (error.response?.status === 409) {
          dispatch(logout());
          navigate('/auth/login');
        } else {
          dispatch(showSnackbar({
            message: error.response?.data?.message || "An error occurred",
            severity: "error"
          }));
        }
      }
    } catch (error) {
      dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
    }
  }


  const getSelectedData = async () => {
    try {
      dispatch(setIsLoading({ data: true }))
      try {
        let params = {}
        if (['staff'].includes(user?.role)) {
          params.addedBy = user?.addedBy?._id
        }
        const res = await API.get('/api/user/getSelectedData', { params: { _id: user?._id, role: user?.role, ...params } });
        if (res.data.message) {
          dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
        }
        dispatch(setIsLoading({ data: false }))
        dispatch(setSelectedData({ data: res.data.selectedData }))

      } catch (error) {
        dispatch(setIsLoading({ data: false }))
        if (error.response?.status === 409) {
          dispatch(logout());
          navigate('/auth/login');
        } else {
          console.log(error)
          dispatch(showSnackbar({
            message: error.response?.data?.message || "An error occurred",
            severity: "error"
          }));
        }
      }
    } catch (error) {
      dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
    }
  }

  const openLogs = () => {
    navigate(`/logs?user=${user?._id}`)
  }


  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Menu />
          </StyledIconButton>
          <IconBox>
            <StyledIconButton onClick={openLogs}>
              <HistoryIcon />
            </StyledIconButton>
          </IconBox>
        </Box>

        <Box display="flex" alignItems="center">
          <MatxSearchBox />
          <MatxMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  {["staff", 'agent', 'company-agent'].includes(user?.role) ?
                    (<Span>
                      Hi <strong> {`${user?.fname} ${user?.lname}`}</strong><br />
                      <Paragraph>{user?.role}</Paragraph>
                    </Span>) : (
                      <Span>
                        <strong> {`${user?.companyname}`}</strong><br />
                        <Paragraph>{['company'].includes(user?.role) && 'RSL'}</Paragraph>
                      </Span>
                    )
                  }
                </Hidden>
                <Avatar src={''} sx={{ cursor: "pointer" }} />
              </UserMenu>
            }>


            <StyledItem>
              <Link to={`/user/profile?user=${user?._id}`}>
                <Person />
                <Span>Profile</Span>
              </Link>
            </StyledItem>



            <StyledItem onClick={() => { handleLogout() }}>
              <PowerSettingsNew />
              <Span>Logout</Span>
            </StyledItem>
          </MatxMenu>
        </Box >
      </TopbarContainer >
    </TopbarRoot >
  );
};

export default memo(Layout1Topbar);
