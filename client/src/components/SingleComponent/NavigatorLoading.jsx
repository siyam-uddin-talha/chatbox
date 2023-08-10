import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const MobileLoadingNav = () => {
  return (
    <Box className="navigator_loading" sx={{ my: 1 }}>
      {["a", "b", "c", "d"].map((e, i) => {
        return (
          <Box className=" display_flex" sx={{ gap: 1, mt: 1 }} key={i}>
            <Box sx={{ mx: 2 }}>
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ background: "rgb(40 59 78)" }}
              />
            </Box>
            <Box component="div" sx={{ display: { sm: "none", md: "flex" } }}>
              <Skeleton
                variant="text"
                sx={{ background: "rgb(36 55 74)" }}
                height={40}
                width={120}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default MobileLoadingNav;
