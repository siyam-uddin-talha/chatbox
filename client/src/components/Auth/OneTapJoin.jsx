import { Grid, Button, Box } from "@mui/material";
import React from "react";
import ShowSmallAlert from "../SingleComponent/ShowSmallAlert";
import { useMutation } from "@apollo/client";
import { ONE_TAP_JOIN } from "../../Graphql/Mutations/LoginType";
import { Divider } from "@mui/material";
import { UseGlobalContext } from "../Provider/Context";
import { useNavigate } from "react-router-dom";

const OneTapJoin = () => {
  const [oneTapMutate, { loading }] = useMutation(ONE_TAP_JOIN);

  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });
  const { setUser } = UseGlobalContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const { data } = await oneTapMutate();

      //   const { data } = await UseGetData(`/api/auth/ontap`);
      if (data?.oneTap?.success) {
        setMessage({
          open: true,
          message: data?.oneTap.message,
        });

        setUser((old) => {
          return {
            ...old,
            user: data?.oneTap.user,
          };
        });

        navigate("/", {
          replace: true,
        });

        return;
      }
      setMessage({
        open: true,
        message: data?.oneTap.message,
      });
    } catch (error) {
      setMessage({
        open: true,
        message: error.message,
      });
    }
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

          <Button
            variant="outlined"
            sx={{
              cursor: "unset",
              m: 2,
              py: 0.5,
              px: 7,
              borderColor: (t) => `${t.palette.divider} !important`,
              fontWeight: 500,
              borderRadius: 2,
              color: "#fff",
            }}
            disableRipple
            disabled
            size="small"
          >
            OR
          </Button>

          <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Button
          size="small"
          variant="contained"
          color="warning"
          onClick={handleClick}
          fullWidth
          disabled={loading}
        >
          One tap join
        </Button>
      </Grid>
      <ShowSmallAlert
        open={message.open}
        setClose={setMessage}
        message={message.message}
      />
    </React.Fragment>
  );
};

export default OneTapJoin;
