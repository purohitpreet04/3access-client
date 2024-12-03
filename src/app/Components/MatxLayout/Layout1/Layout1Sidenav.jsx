import { memo, useCallback, useEffect, useState } from "react";
import { Box, styled, useTheme, FormGroup, FormControlLabel, Checkbox, Typography, Button } from "@mui/material";

import useSettings from "../../../hooks/useSettings";

import Brand from "../../Brand";
import Sidenav from "../../Sidenav";
// import { themeShadows } from "app/components/MatxTheme/themeColors";
import { themeShadows } from "../../MatxTheme/themeColors";

import { convertHexToRGB } from "../../../Utils/utils";
import { sidenavCompactWidth, sideNavWidth } from "../../../Utils/constant";
import { useDispatch, useSelector } from "react-redux";
import API from "Constance";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";
import { addSelectedValue, removeSelectedValue, setData, setSelectedData } from "@app/Redux/Sclice/MultiSelectSlice";
import { setIsLoading } from "@app/Redux/Sclice/manageStateSclice";

// STYLED COMPONENTS
const SidebarNavRoot = styled(Box)(({ theme, width, bg, image }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: width,
  boxShadow: themeShadows[8],
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top",
  backgroundSize: "cover",
  zIndex: 111,
  overflow: "hidden",
  color: theme.palette.text.primary,
  transition: "all 250ms ease-in-out",
  backgroundImage: `linear-gradient(to bottom, rgba(${bg}, 0.96), rgba(${bg}, 0.96)), url(${image})`,
  "&:hover": {
    width: sideNavWidth,
    "& .sidenavHoverShow": { display: "block" },
    "& .compactNavItem": {
      width: "100%",
      maxWidth: "100%",
      "& .nav-bullet": { display: "block" },
      "& .nav-bullet-text": { display: "none" }
    }
  }
}));

const NavListBox = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column"
});

const Layout1Sidenav = () => {
  const { user, token, isAuthenticate } = useSelector(state => state.auth)
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode, bgImgURL } = leftSidebar;



  const getSidenavWidth = () => {
    switch (mode) {
      case "compact":
        return sidenavCompactWidth;

      default:
        return sideNavWidth;
    }
  };


  const primaryRGB = convertHexToRGB(theme.palette.primary.main);

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  const handleSidenavToggle = () => {
    updateSidebarMode({ mode: mode === "compact" ? "full" : "compact" });
  };

  function DynamicCheckboxGroup({ }) {
    const { user, token, isAuthenticate } = useSelector(state => state.auth)
    const { data, selectedValues } = useSelector(state => state.sideselect)
    // console.log(data)
    const [options, setOptions] = useState([...data])
    const [selectedIds, setSelectedIds] = useState(selectedValues.map((item) => item._id));
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleCheckboxChange = (event, option) => {
      const { checked } = event.target;
      setSelectedIds((prevIds) =>
        checked ? [...prevIds, option?._id] : prevIds.filter((id) => id !== option._id)
      );
    };
   

    // console.log(selectedValues)
    return (
      <Box
        p={3}
        sx={{
          backgroundColor: 'transparent',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: 400,
          // margin: 'auto',
        }}
      >
        <Typography>{user.role !== 'company' ? "Companies" : "Agents"}</Typography>
        <FormGroup sx={{ padding: 1 }}>
          {data.map((option) => (
            <FormControlLabel
              key={option?._id}
              control={
                <Checkbox
                  checked={selectedIds.includes(option._id)}
                  onChange={(e) => handleCheckboxChange(e, option)}
                  name={option.lable}
                  sx={{
                    color: '#fff',
                    '&.Mui-checked': {
                      color: '#fff',
                    },
                    '& .MuiSvgIcon-root': {
                      backgroundColor: 'transparent',
                      borderRadius: '4px',
                    }
                  }}
                />
              }
              label={option.lable}
              sx={{
                marginBottom: 1,
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                  color: '',
                  fontWeight: 400,
                },
              }}
            />
          ))}
        </FormGroup>
        <Button variant="contained" type="button" onClick={() => { dispatch(addSelectedValue({ data: selectedIds, _id: user._id })) }}>save</Button>
      </Box>
    );
  }




  return (
    <SidebarNavRoot image={bgImgURL} bg={primaryRGB} width={getSidenavWidth()}>
      <NavListBox>
        <Brand></Brand>
        <Sidenav />
        {['agent'].includes(user.role) && <DynamicCheckboxGroup />}
      </NavListBox>
    </SidebarNavRoot>
  );
};

export default memo(Layout1Sidenav);
