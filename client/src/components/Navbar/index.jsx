import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { Avatar, Button, IconButton, TextField } from "@mui/material";
import { UseGlobalContext } from "../Provider/Context";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_CONVERCATION } from "../../Graphql/Mutations/MessengerMutation";
import { LOG_OUT } from "../../Graphql/Mutations/LoginType";

import ShowSmallAlert from "../../components/SingleComponent/ShowSmallAlert";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export default function AppHeader({ socket }) {
  const { user } = UseGlobalContext();

  const [email, setEmail] = useState("");
  const [LogOut, { data }] = useMutation(LOG_OUT);

  const [openToAddNewConvercation, setOpenToAddNewConvercation] =
    React.useState(false);

  const HandleLogOut = () => {
    LogOut();
  };

  React.useEffect(() => {
    if (data) {
      if (data.logout.success) {
        window.location = "/";
      }
    }
  }, [data]);

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
            <Box className="avatar_container">
              <Tooltip title="My prfile" arrow>
                <Link to={`/profile/${user._id}`}>
                  <Avatar
                    alt={`${user.firstName} ${user.lastName}`}
                    src={user.photoUrl}
                    className="user_avater"
                  />
                </Link>
              </Tooltip>
            </Box>
            <Typography
              variant="span"
              noWrap
              component="div"
              sx={{ ml: 3, textTransform: "capitalize" }}
            >
              {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ mr: 2 }}>
              <IconButton
                onClick={() => setOpenToAddNewConvercation(true)}
                className="__BTN_NA"
              >
                <AddOutlinedIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton onClick={HandleLogOut} className="__BTN_NA">
                <LogoutOutlinedIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {
        <NewConvercationDialog
          user={user}
          socket={socket}
          open={openToAddNewConvercation}
          setOpen={setOpenToAddNewConvercation}
          email={email}
          setEmail={setEmail}
        />
      }
    </>
  );
}

function NewConvercationDialog({
  socket,
  open,
  setOpen,
  email,
  setEmail,
  user,
}) {
  const [CreateNewConvercation, { data, error }] = useMutation(
    CREATE_NEW_CONVERCATION
  );

  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });
  const handleClose = () => {
    setOpen(false);
  };

  const HandleCreateNewConversation = async () => {
    setOpen(false);
    await CreateNewConvercation({
      variables: {
        email,
      },
    });
  };

  React.useEffect(() => {
    if (data) {
      if (data.newConversation.success) {
        socket.emit("yourNewConversationCreated", {
          creator: user._id,
          newFriend: data.newConversation.friends,
        });
      } else {
        setMessage({
          open: true,
          message: `${data.newConversation.message}`,
        });
      }
    }
    if (error) {
      setMessage({
        open: true,
        message: error.message,
      });
    }
  }, [data, error, socket, user._id]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new conversation, please input <b>Email </b> to{" "}
            <b>
              <i>Invite</i>
            </b>{" "}
            new person
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={HandleCreateNewConversation}>Add</Button>
        </DialogActions>
      </Dialog>

      <ShowSmallAlert
        open={message.open}
        setClose={setMessage}
        message={message.message}
      />
    </div>
  );
}
