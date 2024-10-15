import React from "react";

import { Grid, IconButton, Typography, AppBar } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";

export const BackButtonHeader = ({ pushUrl, title }) => {
  const router = useNavigate();

  return (
    <AppBar>
      <Grid container spacing={2} py={1} mx={2}>
        <Grid container sx={{ gap: 1, alignItems: "center" }} item xs={12}>
          <Grid>
            <IconButton
              size="small"
              onClick={() => (pushUrl ? router(pushUrl) : router(-1))}
            >
              <ArrowBackOutlinedIcon />
            </IconButton>
          </Grid>
          <Grid>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              {title}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  );
};
