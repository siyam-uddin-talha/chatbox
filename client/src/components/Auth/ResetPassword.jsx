import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate, useParams } from 'react-router'
import ShowSmallAlert from '../SingleComponent/ShowSmallAlert';
import { Button } from '@mui/material';
import BackDropLoading from '../SingleComponent/BackDropLoading';
import { useMutation } from '@apollo/client';
import RESET_PASSWORD from '../../Graphql/Mutations/ResetPassword';




export default function ResetPassword() {

    const { resetToken } = useParams()

    const [ResetPassword, { error, loading, data }] = useMutation(RESET_PASSWORD)

    const [buttonDisable, setButtonDisable] = React.useState(false)

    const navigate = useNavigate()

    const [message, setMessage] = React.useState({
        open: false,
        message: ''
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const password = data.get('password')
        const ConfirmPassword = data.get('confirmPassword')

        if (ConfirmPassword.length < 8 || password.length < 8) {
            setMessage({
                open: true,
                message: 'Your Password should be more then 8'
            })
            return;
        }
        if (ConfirmPassword !== password) {
            setMessage({
                open: true,
                message: `password don't same`
            })
            return;
        }

        try {
            setButtonDisable(true)
            ResetPassword({
                variables: {
                    resetToken,
                    password
                }
            })
        } catch (error) {
            setButtonDisable(false)
            setMessage({
                open: true,
                message: 'Error try to refresh'
            })
        }

    };


    React.useEffect(() => {
        if (data) {
            if (data.resetPassword.success) {

                navigate("/user/login", {
                    replace: true,
                })
            } else {
                setMessage({
                    open: true,
                    message: data.resetPassword.message
                })
            }
        }
        if (error) {
            setMessage({
                open: true,
                message: "error try to refresh"
            })
        }
    }, [data, error, navigate,])


    return (

        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" className='c-white'>
                    Forget password
                </Typography>
                <form onSubmit={handleSubmit} className='cc_from' sx={{ mt: 1 }}>
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-confirmPassword"
                        variant="standard"
                    />
                    <Button disabled={buttonDisable}
                        type="submit"

                        variant='outlined'
                        fullWidth sx={{ mt: 3, mb: 2 }}>
                        Reset password
                    </Button>


                </form>
            </Box>
            <ShowSmallAlert open={message.open} setClose={setMessage} message={message.message} />
            {loading && <BackDropLoading />}

        </Container>

    )
}