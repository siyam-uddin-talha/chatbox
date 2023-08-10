import React from "react";
import MobileConversationPlayground from "./ConversationPlayground";
import MobileCurrentUserNavbar from "../Navbar/MobileCurrentUserNavbar";
import { Box } from "@mui/material";

const MobileMessenger = () => {
  return (
    <Box className="mobile_messenger_root">
      <MobileCurrentUserNavbar />
      <MobileConversationPlayground />
    </Box>
  );
};

export default MobileMessenger;
