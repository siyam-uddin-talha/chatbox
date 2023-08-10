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
import { useNavigate } from "react-router";
import ShowSmallAlert from "../SingleComponent/ShowSmallAlert";
import { LOGIN_TYPE } from "../../Graphql/Mutations/LoginType";
import { useMutation } from "@apollo/client";
import BackDropLoading from "../SingleComponent/BackDropLoading";
import { UseGlobalContext } from "../Provider/Context";

export default function SignIn() {
  const navigate = useNavigate();
  const { setUser } = UseGlobalContext();

  const [publishLogin, { data, error, loading }] = useMutation(LOGIN_TYPE);
  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    if (!email || !password) {
      setMessage({
        open: true,
        message: "please fill input",
      });
    }
    try {
      publishLogin({
        variables: {
          email,
          password,
        },
      });
    } catch (error) {
      setMessage({
        open: true,
        message: "Error try to refresh",
      });
    }
  };

  React.useEffect(() => {
    if (data) {
      if (data.login.success) {
        setUser((old) => {
          return {
            ...old,
            user: data.login.user,
          };
        });

        navigate("/", {
          replace: true,
        });
      } else {
        setMessage({
          open: true,
          message: data.login.message,
        });
      }
    }
    if (error) {
      setMessage({
        open: true,
        message: error.message,
      });
    }
  }, [data, error, navigate, setUser]);

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
          Sign in
        </Typography>
        <Box
          component="form"
          className="cc_from"
          onSubmit={handleSubmit}
          noValidate
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            variant="standard"
          />

          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                to="/user/forget-password"
                variant="body2"
                className="c-white"
              >
                Forgot password?
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
