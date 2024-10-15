import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ShowSmallAlert from "../SingleComponent/ShowSmallAlert";
import UPDATE_USER_PROFILE from "../../Graphql/Mutations/UserProfile";
import { useMutation } from "@apollo/client";
import BackDropLoading from "../SingleComponent/BackDropLoading";
import { UseGlobalContext } from "../Provider/Context";
import { styled } from "@mui/material/styles";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import { BackButtonHeader } from "../../shared/BackButtonHeader";

const Input = styled("input")({
  display: "none",
});

export default function UserProfile() {
  const { setUser, user } = UseGlobalContext();

  const [updateProfile, { data, error, loading }] =
    useMutation(UPDATE_USER_PROFILE);

  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });

  const [value, setValue] = React.useState({
    firstName: "",
    lastName: "",
    password: "",
    photoUrl: "",
    email: "",
  });

  React.useEffect(() => {
    if (user) {
      setValue({
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (data) {
      if (data.updateProfile.success) {
        setUser({
          user: data.updateProfile.user,
        });
        setMessage({
          open: true,
          message: "updated success",
        });
      } else {
        setMessage({
          open: true,
          message: data.updateProfile.message,
        });
      }
    }
    if (error) {
      setMessage({
        open: true,
        message: error.message,
      });
    }
  }, [data, error, setUser]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const { password, firstName, lastName, photoUrl } = value;
      if (!firstName || !lastName || !photoUrl) {
        setMessage({
          open: true,
          message: "please fill input",
        });
        return;
      }
      if (password && password.length < 8) {
        setMessage({
          open: true,
          message: "Your Password should be more then 8",
        });
        return;
      }
      if (password) {
        await updateProfile({
          variables: {
            input: {
              password,
              firstName,
              lastName,
              photoUrl,
            },
          },
        });
        return;
      }

      await updateProfile({
        variables: {
          input: {
            firstName,
            lastName,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const HandleUploadFile = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = (e) => {
      setValue((prev) => {
        return {
          ...prev,
          photoUrl: fileReader.result,
        };
      });
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <>
      <BackButtonHeader title={"Profile"} />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box sx={{ m: 2, width: "6rem", height: "6rem" }}>
            <img src={value.photoUrl} alt="user" className="img_profile" />
          </Box>

          <Box
            component="form"
            className="update_profile_form cc_from"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First name"
                  autoFocus
                  variant="outlined"
                  value={value.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last name"
                  name="lastName"
                  variant="outlined"
                  value={value.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email address"
                  name="email"
                  variant="outlined"
                  value={value.email}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  value={value.password}
                  onChange={handleChange}
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
            </Grid>
            <Box sx={{ textAlign: "end" }}>
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Update
              </Button>
            </Box>
          </Box>
        </Box>
        <ShowSmallAlert
          open={message.open}
          setClose={setMessage}
          message={message.message}
        />
        {loading && <BackDropLoading />}
      </Container>
    </>
  );
}
