/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Box, ListItemButton, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { UseGlobalContext } from "../Provider/Context";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import WindowSize from "../SingleComponent/WindowSize";
import NavigatorLoading from "../SingleComponent/NavigatorLoading";
import { MobileActiveUser } from "./ActiveUser";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const MessengerNavigator = ({ data, socket, loading }) => {
  const windowWidth = WindowSize();

  return (
    <Box className="messenger_navigator" id="navigator_messenger">
      <Drawer
        variant="permanent"
        className="navigator_drawer __md_screen_navigator height_100"
        open={true}
      >
        <>{windowWidth < 576 && <MobileActiveUser socket={socket} />}</>
        <>{loading ? <NavigatorLoading /> : <NavigatorList data={data} />}</>
      </Drawer>
    </Box>
  );
};

const NavigatorList = ({ data }) => {
  const { id } = useParams();

  const [selectedIndex, setSelectedIndex] = React.useState(null);

  useEffect(() => {
    if (!selectedIndex || id) {
      data.forEach((e, index) => {
        if (e.roomId === id) {
          setSelectedIndex(index);
        }
      });
    }
  }, [id, selectedIndex, data]);

  return (
    <List className="nav_ul">
      {data.map((e, index) => (
        <React.Fragment key={index}>
          <Link
            className="__navigator_link t-d-n LAG_navgiator"
            style={{ position: "relative" }}
            to={`/messages/r/${e.roomId}/?name=${e.friendEmail}`}
          >
            <ListItemButton
              className="__single_user_nav_button"
              selected={selectedIndex === index}
              sx={{ borderRadius: ".77rem" }}
            >
              <ListItemIcon sx={{ color: "#15283c" }}>
                {e.photoUrl ? (
                  <Avatar alt={`${e.friendName}`} src={e.photoUrl} />
                ) : (
                  <Avatar alt={`${e.friendName}`} />
                )}
              </ListItemIcon>

              <ListItemText
                primary={e.friendName}
                sx={{ display: { sm: "none", md: "flex" } }}
              />
            </ListItemButton>
          </Link>

          <Link
            className="_mobile_navigator__ __navigator_link t-d-n"
            style={{ position: "relative" }}
            to={`/m/messages/r/${e.roomId}/?name=${e.friendEmail}`}
          >
            <ListItemButton
              className="__single_user_nav_button"
              selected={selectedIndex === index}
              sx={{ borderRadius: ".77rem" }}
            >
              <ListItemIcon sx={{ color: "#15283c" }}>
                {e.photoUrl ? (
                  <Avatar alt={`${e.friendName}`} src={e.photoUrl} />
                ) : (
                  <Avatar alt={`${e.friendName}`} />
                )}
              </ListItemIcon>

              <ListItemText
                primary={e.friendName}
                sx={{ display: { sm: "none", md: "flex" } }}
              />
            </ListItemButton>
          </Link>
        </React.Fragment>
      ))}
    </List>
  );
};

export default MessengerNavigator;
