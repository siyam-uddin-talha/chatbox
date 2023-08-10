import React from "react";
import { Box } from "@mui/material";
import ConversationPlayground from "./ConversationPlayground";

const DisplayConversation = () => {
  return (
    <Box className="display_spacific_conversation display_flex f_shink_1 f_basis_0 flex_grow_1 ">
      <ConversationPlayground />
    </Box>
  );
};

export default DisplayConversation;
