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
import OneTapJoin from "./OneTapJoin";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";

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

    if (!firstName || !lastName || !email || !password) {
      setMessage({
        open: true,
        message: "Please fill the input",
      });
      return;
    }
    if (!validator.isEmail(email) || email.split("@")[0].length < 4) {
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
        message: error.message,
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
    <Container component="main" maxWidth="sm">
      <Box
        component="form"
        className="cc_from"
        onSubmit={handleSubmit}
        noValidate
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" className="c-white">
                Sign up
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              required
              fullWidth
              id="firstName"
              label="First name"
              name="firstName"
              autoComplete="firstName"
              autoFocus
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last name"
              name="lastName"
              autoComplete="lastName"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email address"
              name="email"
              autoComplete="email"
              variant="outlined"
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
              variant="outlined"
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
                startIcon={<PermMediaOutlinedIcon />}
              >
                Upload
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Grid>

          <OneTapJoin />

          <Grid item>
            <Link to="/user/login" variant="body2" className="c-white">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
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
