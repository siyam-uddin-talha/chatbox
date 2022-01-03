import * as React from 'react';
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

export default function SmallAlart({ open, setClose, message }) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setClose({
            open: false,
            message: ''
        });
    };



    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                message={message}
                action={action}
                TransitionComponent={Slide}
            />
        </div>
    );
}
