import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Avatar, IconButton } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_USER_ROOM_FRIEND } from "../../Graphql/Query/MessengerQuery";
import Skeleton from "@mui/material/Skeleton";

export default function MobileHeader() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const { data, loading } = useQuery(GET_USER_ROOM_FRIEND, {
    variables: {
      email: search ? search.split("=")[1] : "",
    },
  });

  if (loading) {
    return <MobileLoadingNav />;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          className="APP_BAR"
          style={{
            background: "#15202c",
            color: "white",
            borderBottom: "1px solid rgb(54 56 58)",
          }}
        >
          <Toolbar>
            <Box className="mobile_navigate_to_messenger">
              <IconButton
                className="__BTN_NA"
                onClick={() => navigate("/messages/r")}
                size="small"
              >
                <ArrowBackOutlinedIcon />
              </IconButton>
            </Box>
            <Box className="mobile_navigate_friends_avater" sx={{ ml: 2 }}>
              <Avatar
                alt={`${data.conversationFriend.firstName} ${data.conversationFriend.lastName}`}
                src={data.conversationFriend.photoUrl}
                className="friend_avater"
              />
            </Box>

            <Typography
              variant="span"
              noWrap
              component="div"
              sx={{ ml: 3, textTransform: "capitalize" }}
            >
              {`${data.conversationFriend.firstName} ${data.conversationFriend.lastName}`}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

const MobileLoadingNav = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        className="APP_BAR"
        style={{
          background: "#15202c",
          color: "white",
          borderBottom: "1px solid rgb(54 56 58)",
        }}
      >
        <Toolbar>
          <Box className="mobile_navigate_to_messenger">
            <IconButton className="__BTN_NA" size="small">
              <ArrowBackOutlinedIcon />
            </IconButton>
          </Box>
          <Box className="mobile_navigate_friends_avater" sx={{ mx: 2 }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ background: "rgb(40 59 78)" }}
            />
          </Box>

          <Typography noWrap component="div">
            <Skeleton
              variant="text"
              width={100}
              height={40}
              sx={{ background: "rgb(36 55 74)" }}
            />
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
