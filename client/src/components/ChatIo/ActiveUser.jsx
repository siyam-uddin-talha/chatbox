import React, { useState, useEffect } from "react";
import { Box, Avatar, ListItemButton, ListItemIcon } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { UseGlobalContext } from "../Provider/Context";
import { Link } from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      // animation: 'ripple 1.2s infinite ease-in-out',
      // border: '1px solid currentColor',
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const drawerWidth = 200;

const openedMixin = (theme) => ({
  // width: "100%",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  flexBasis: "33.3%",
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

const Activeuser = () => {
  const { user, socket } = UseGlobalContext();

  const [ActiveUser, setActiveUser] = useState([]);

  useEffect(() => {
    socket.emit("giveMeMyFriends", user._id);
  }, [socket, user._id]);

  useEffect(() => {
    let unsubscribe = true;

    socket.on("activeUser", (data) => {
      if (unsubscribe) {
        setActiveUser(data);
      }
    });
    socket.on("activeUserOver", (data) => {
      if (unsubscribe) {
        setActiveUser((prev) => {
          return prev.filter((e) => e.friendEmail !== data);
        });
      }
    });
    return () => {
      unsubscribe = false;
    };
  }, [socket]);

  return (
    <Box className="messenger_active_user min_h_inhrit SBG">
      <Drawer
        variant="permanent"
        className="navigator_active_user navigator_drawer height_100"
        open={true}
      >
        <List className="nav_ul">
          {ActiveUser.map((e, index) => (
            <Link
              className="__navigator_link t-d-n LAG_navgiator"
              style={{ position: "relative" }}
              to={`/messages/r/${e.roomId}/?name=${e.friendEmail}`}
              key={index}
            >
              <ListItemButton className="active_user">
                <ListItemIcon className="a-i-c j-c-c">
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar alt="Remy Sharp" src={e.photoUrl} />
                  </StyledBadge>
                </ListItemIcon>
                <ListItemText
                  primary={e.friendName}
                  sx={{ display: { sm: "none", md: "flex" } }}
                />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export const MobileActiveUser = () => {
  const { user, socket } = UseGlobalContext();

  const [ActiveUser, setActiveUser] = useState([]);

  useEffect(() => {
    socket.emit("giveMeMyFriends", user._id);
  }, [socket, user._id]);

  useEffect(() => {
    let unsubscribe = true;

    socket.on("activeUser", (data) => {
      if (unsubscribe) {
        setActiveUser(data);
      }
    });
    socket.on("activeUserOver", (data) => {
      if (unsubscribe) {
        setActiveUser((prev) => {
          return prev.filter((e) => e.friendEmail !== data);
        });
      }
    });
    return () => {
      unsubscribe = false;
    };
  }, [socket]);

  return (
    <Box
      className="mobile_active_user_container "
      style={{ display: ActiveUser.length !== 0 && "flex" }}
    >
      <List className="display_flex ofxs mobile_active_user_list ">
        {ActiveUser.map((e, index) => (
          <Link
            className="_mobile_navigator__ __navigator_link t-d-n"
            style={{ position: "relative" }}
            to={`/m/messages/r/${e.roomId}/?name=${e.friendEmail}`}
            key={e._id}
          >
            <ListItemButton
              className="__single_user_nav_button"
              sx={{ borderRadius: ".77rem" }}
            >
              <ListItemIcon sx={{ color: "#15283c", minWidth: "initial" }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar alt="Remy Sharp" src={e.photoUrl} />
                </StyledBadge>
              </ListItemIcon>
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default Activeuser;
