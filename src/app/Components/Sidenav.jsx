import { Fragment, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Scrollbar from "react-perfect-scrollbar";

import { MatxVerticalNav } from "@app/Components";
import useSettings from "@app/hooks/useSettings";
import { Checkbox, FormControlLabel, FormGroup, Box } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";
import API from "Constance";
import { mainAgent, staffnavigations, usernavigations } from "@app/navigations";

// STYLED COMPONENTS
const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: "1rem",
  paddingRight: "1rem",
  position: "relative"
}));

const SideNavMobile = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  width: "100vw",
  background: "rgba(0, 0, 0, 0.54)",
  [theme.breakpoints.up("lg")]: { display: "none" }
}));

export default function Sidenav({ children }) {
  const { settings, updateSettings } = useSettings();
  const { user } = useSelector(state => state.auth)
  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings
        }
      }
    });
  };


  const navigation =
    ['staff', 'company-agent'].includes(user.role)
      ? staffnavigations
      : user?.isMainMA === 1
        ? mainAgent
        : usernavigations;

  return (
    <Fragment>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        {children}
        <MatxVerticalNav
          // items={['staff', 'company-agent'].includes(user.role) ? staffnavigations : user?.isMainMA === 1 ? mainAgent : usernavigations}
          items={navigation}
        />
      </StyledScrollBar>

      <SideNavMobile onClick={() => updateSidebarMode({ mode: "close" })} />
    </Fragment>
  );
}
