import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import ShowSmallAlert from "../SingleComponent/ShowSmallAlert";
import BackDropLoading from "../SingleComponent/BackDropLoading";
import { useMutation } from "@apollo/client";
import FORGET_PASSWORD from "../../Graphql/Mutations/ForgetPassword";

export default function ForgetPassword() {
  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });

  const [SendResetToken, { error, loading, data }] =
    useMutation(FORGET_PASSWORD);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fromData = new FormData(event.currentTarget);
    const email = fromData.get("email");

    try {
      if (!email) return;
      // setBackDropLoading(true)
      SendResetToken({
        variables: {
          email,
        },
      });
    } catch (error) {
      // setBackDropLoading(false)
      setMessage({
        open: true,
        message: "something error! Refresh the page",
      });
    }
  };

  React.useEffect(() => {
    if (data) {
      if (data.forgetPassword.success) {
        setMessage({
          open: true,
          message: data.forgetPassword.message,
        });
      } else {
        setMessage({
          open: true,
          message: data.forgetPassword.message,
        });
      }
    }
    if (error) {
      setMessage({
        open: true,
        message: error.message,
      });
    }
  }, [data, error]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className="c-white">
          Forget password
        </Typography>
        <Box
          component="form"
          className="cc_from"
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            variant="standard"
          />

          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset password
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/user/login" variant="body2" className="c-white">
                Login
              </Link>
            </Grid>
            <Grid item>
              <Link to="/user/signup" variant="body2" className="c-white">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ShowSmallAlert
        open={message.open}
        setClose={setMessage}
        message={message.message}
      />
      {loading && <BackDropLoading />}
    </Container>
  );
}
