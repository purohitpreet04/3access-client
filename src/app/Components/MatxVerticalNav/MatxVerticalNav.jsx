import { Fragment, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Box, ButtonBase, Icon, IconButton, styled } from "@mui/material";

import useSettings from "../../hooks/useSettings";
import { Paragraph, Span } from "../Typography";
import MatxVerticalNavExpansionPanel from "./MatxVerticalNavExpansionPanel";
import { useDispatch, useSelector } from "react-redux";
import { mainuser } from "@app/Utils/constant";

// STYLED COMPONENTS
const ListLabel = styled(Paragraph)(({ theme, mode }) => ({
  fontSize: "12px",
  marginTop: "20px",
  marginLeft: "15px",
  marginBottom: "10px",
  textTransform: "uppercase",
  display: mode === "compact" && "none",
  color: theme.palette.text.secondary
}));

const ExtAndIntCommon = {
  display: "flex",
  overflow: "hidden",
  borderRadius: "4px",
  height: 44,
  whiteSpace: "pre",
  marginBottom: "8px",
  textDecoration: "none",
  justifyContent: "space-between",
  transition: "all 150ms ease-in",
  "&:hover": { background: "rgba(255, 255, 255, 0.08)" },
  "&.compactNavItem": {
    overflow: "hidden",
    justifyContent: "center !important"
  },
  "& .icon": {
    fontSize: "18px",
    paddingLeft: "16px",
    paddingRight: "16px",
    verticalAlign: "middle"
  }
};
const ExternalLink = styled("a")(({ theme }) => ({
  ...ExtAndIntCommon,
  color: theme.palette.text.primary
}));

const InternalLink = styled(Box)(({ theme }) => ({
  "& a": {
    ...ExtAndIntCommon,
    color: theme.palette.text.primary
  },
  "& .navItemActive": {
    backgroundColor: "rgba(255, 255, 255, 0.16)"
  }
}));

const StyledText = styled(Span)(({ mode }) => ({
  fontSize: "0.875rem",
  paddingLeft: "0.8rem",
  display: mode === "compact" && "none"
}));

const BulletIcon = styled("div")(({ theme }) => ({
  padding: "2px",
  marginLeft: "24px",
  marginRight: "8px",
  overflow: "hidden",
  borderRadius: "300px",
  background: theme.palette.text.primary
}));

const BadgeValue = styled("div")(() => ({
  padding: "1px 10px",
  overflow: "hidden",
  borderRadius: "300px"
}));

export default function MatxVerticalNav({ items }) {
  const { settings } = useSettings();
  const { mode } = settings.layout1Settings.leftSidebar;
  const { agentCount } = useSelector(state => state.sideselect)
  const { user } = useSelector(state => state?.auth)



  const renderLevels = (data) => {
    return data.map((item, index) => {
      if (item.type === "label")
        return (
          <ListLabel key={index} mode={mode} className="sidenavHoverShow">
            {item.label}
          </ListLabel>
        );

      if (item.children) {
        let filteredChildren = [];
        if (mainuser.includes(user?.role)) {
          filteredChildren = [...item.children];
        } else {
          if (user?.permmission.includes(3)) {
            filteredChildren = [
              ...filteredChildren,
              ...item.children.filter((child) => child.nav === 0),
            ];
          }
          if (user?.permmission.includes(5)) {
            filteredChildren = [
              ...filteredChildren,
              ...item.children.filter((child) => child.nav === 1),
            ];
          }
        }
        
        filteredChildren = filteredChildren.filter(
          (child, index, self) =>
            index === self.findIndex((c) => c.path === child.path)
        );

        if (filteredChildren.length > 0) {
          return (
            <MatxVerticalNavExpansionPanel mode={mode} item={item} key={index}>
              {renderLevels(filteredChildren)}
            </MatxVerticalNavExpansionPanel>
          );
        }

      } else if (item.type === "extLink") {
        return (
          <ExternalLink
            key={index}
            href={item.path}
            className={`${mode === "compact" && "compactNavItem"}`}
            rel="noopener noreferrer"
            target="_blank">
            <ButtonBase key={item.name} name="child" sx={{ width: "100%" }}>
              {(() => {
                if (item.icon) {
                  return <Icon className="icon">{item.icon}</Icon>;
                } else {
                  return <span className="item-icon icon-text">{item.iconText}</span>;
                }
              })()}
              <StyledText mode={mode} className="sidenavHoverShow">
                {item.name}
              </StyledText>
              <Box mx="auto"></Box>
              {item.badge && <BadgeValue>{item.badge.value}</BadgeValue>}
            </ButtonBase>
          </ExternalLink>
        );
      } else {
        if (mainuser.includes(user?.role) && !['newstaff'].includes(item?.nav)) {
          return (
            <InternalLink key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? `navItemActive ${mode === "compact" && "compactNavItem"}`
                    : `${mode === "compact" && "compactNavItem"}`
                }>
                <ButtonBase key={item.name} name="child" sx={{ width: "100%" }}>
                  {item?.icon ? (
                    <Icon className="icon" sx={{ width: 36 }}>
                      {item.icon}
                    </Icon>
                  ) : (
                    <Fragment>
                      <BulletIcon
                        className={`nav-bullet`}
                        sx={{ display: mode === "compact" && "none" }}
                      />
                      <IconButton
                        className="nav-bullet-text"
                        sx={{
                          ml: "20px",
                          fontSize: "11px",
                          display: mode !== "compact" && "none"
                        }}>
                        {/* {item.iconText} */}
                        <Icon className="icon">{item.iconText}</Icon>
                      </IconButton>
                    </Fragment>
                  )}
                  <StyledText mode={mode} display='flex' className="sidenavHoverShow">
                    {item.name}

                  </StyledText>
                  <Box mx="auto" />
                  {item.name === "Agents" && (
                    <Box display="flex" alignItems="center" m={2}>
                      <BadgeValue className="sidenavHoverShow" sx={{ backgroundColor: "green", marginRight: "6px" }}>
                        {agentCount?.active}
                      </BadgeValue>
                      <BadgeValue className="sidenavHoverShow" sx={{ backgroundColor: "red" }}>
                        {agentCount.inactive}
                      </BadgeValue>
                    </Box>
                  )}
                  {item.badge && (
                    <BadgeValue className="sidenavHoverShow">{item.badge.value}</BadgeValue>
                  )}
                </ButtonBase>
              </NavLink>
            </InternalLink>
          );
        } else if (!['newstaff'].includes(item?.nav) && ['staff'].includes(user?.role)) {
          return (
            <InternalLink key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? `navItemActive ${mode === "compact" && "compactNavItem"}`
                    : `${mode === "compact" && "compactNavItem"}`
                }>
                <ButtonBase key={item.name} name="child" sx={{ width: "100%" }}>
                  {item?.icon ? (
                    <Icon className="icon" sx={{ width: 36 }}>
                      {item.icon}
                    </Icon>
                  ) : (
                    <Fragment>
                      <BulletIcon
                        className={`nav-bullet`}
                        sx={{ display: mode === "compact" && "none" }}
                      />
                      <IconButton
                        className="nav-bullet-text"
                        sx={{
                          ml: "20px",
                          fontSize: "11px",
                          display: mode !== "compact" && "none"
                        }}>
                        {/* {item.iconText} */}
                        <Icon className="icon">{item.iconText}</Icon>
                      </IconButton>
                    </Fragment>
                  )}
                  <StyledText mode={mode} display='flex' className="sidenavHoverShow">
                    {item.name}

                  </StyledText>
                  <Box mx="auto" />
                  {item.name === "Agents" && (
                    <Box display="flex" alignItems="center" m={2}>
                      <BadgeValue className="sidenavHoverShow" sx={{ backgroundColor: "green", marginRight: "6px" }}>
                        {agentCount?.active}
                      </BadgeValue>
                      <BadgeValue className="sidenavHoverShow" sx={{ backgroundColor: "red" }}>
                        {agentCount.inactive}
                      </BadgeValue>
                    </Box>
                  )}
                  {item.badge && (
                    <BadgeValue className="sidenavHoverShow">{item.badge.value}</BadgeValue>
                  )}
                </ButtonBase>
              </NavLink>
            </InternalLink>
          );
        } else if (['newstaff'].includes(item?.nav) && ['staff'].includes(user?.role) && user?.permmission.includes(8)) {
          return (
            <InternalLink key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? `navItemActive ${mode === "compact" && "compactNavItem"}`
                    : `${mode === "compact" && "compactNavItem"}`
                }>
                <ButtonBase key={item.name} name="child" sx={{ width: "100%" }}>
                  {item?.icon ? (
                    <Icon className="icon" sx={{ width: 36 }}>
                      {item.icon}
                    </Icon>
                  ) : (
                    <Fragment>
                      <BulletIcon
                        className={`nav-bullet`}
                        sx={{ display: mode === "compact" && "none" }}
                      />
                      <IconButton
                        className="nav-bullet-text"
                        sx={{
                          ml: "20px",
                          fontSize: "11px",
                          display: mode !== "compact" && "none"
                        }}>
                        {/* {item.iconText} */}
                        <Icon className="icon">{item.iconText}</Icon>
                      </IconButton>
                    </Fragment>
                  )}
                  <StyledText mode={mode} display='flex' className="sidenavHoverShow">
                    {item.name}

                  </StyledText>
                  <Box mx="auto" />
                  {item.name === "Agents" && (
                    <Box display="flex" alignItems="center" m={2}>
                      <BadgeValue className="sidenavHoverShow" sx={{ backgroundColor: "green", marginRight: "6px" }}>
                        {agentCount?.active}
                      </BadgeValue>
                      <BadgeValue className="sidenavHoverShow" sx={{ backgroundColor: "red" }}>
                        {agentCount.inactive}
                      </BadgeValue>
                    </Box>
                  )}
                  {item.badge && (
                    <BadgeValue className="sidenavHoverShow">{item.badge.value}</BadgeValue>
                  )}
                </ButtonBase>
              </NavLink>
            </InternalLink>
          );
        }
      }
    });
  };

  return <div className="navigation">{renderLevels(items)}</div>;
}
