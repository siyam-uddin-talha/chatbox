import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router";
import ShowSmallAlert from "../SingleComponent/ShowSmallAlert";
import validator from "validator";
import { Link } from "react-router-dom";
import REGISTER from "../../Graphql/Mutations/Register";
import { useMutation } from "@apollo/client";
import { UseGlobalContext } from "../Provider/Context";
import { styled } from "@mui/material/styles";
import BackDropLoading from "../SingleComponent/BackDropLoading";

const Input = styled("input")({
  display: "none",
});

export default function SignUp() {
  const navigate = useNavigate();

  const [SendRegister, { error, loading, data }] = useMutation(REGISTER);

  const { setUser } = UseGlobalContext();

  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [photoUrlLoading, setPhotoUrlLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");

    if (!firstName || !lastName || !email || !password || !photoUrl) {
      setMessage({
        open: true,
        message: "Please fill the input",
      });
      return;
    }
    if (!validator.isEmail(email) || email.split("@")[0].length < 5) {
      setMessage({
        open: true,
        message: "Please enter a valid email",
      });
      return;
    }
    if (password.length < 8) {
      setMessage({
        open: true,
        message: "Your Password should be more then 8",
      });
      return;
    }
    try {
      await SendRegister({
        variables: {
          input: {
            firstName,
            lastName,
            email,
            password,
            photoUrl,
          },
        },
      });
    } catch (error) {
      setMessage({
        open: true,
        message: "Error try to refresh",
      });
    }
  };

  const HandleUploadFile = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    setPhotoUrlLoading(true);
    fileReader.onloadend = (e) => {
      setPhotoUrl(fileReader.result);
      setPhotoUrlLoading(false);
    };
    fileReader.readAsDataURL(file);
  };

  React.useEffect(() => {
    if (data) {
      if (data.signUp.success) {
        setUser((old) => {
          return {
            ...old,
            user: data.signUp.user,
          };
        });
        navigate("/", {
          replace: true,
        });
      } else {
        setMessage({
          open: true,
          message: data.signUp.message,
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
          Sign up
        </Typography>
        <Box
          component="form"
          className="cc_from"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  name="photoUrl"
                  onChange={HandleUploadFile}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  component="span"
                  style={{
                    border: "1px solid dashed",
                  }}
                >
                  Upload
                </Button>
              </label>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/user/login" className="c-white">
                Already have an account? Sign in
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
      {photoUrlLoading && <BackDropLoading />}
      {loading && <BackDropLoading />}
    </Container>
  );
}
