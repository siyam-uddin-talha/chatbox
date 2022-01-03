import React from 'react'
import { Backdrop, CircularProgress, } from '@mui/material';

const BackDropLoading = () => {
    return (
        <div className="backropWrapper" style={{ zIndex: '10000' }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default BackDropLoading
