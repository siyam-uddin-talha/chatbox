
import React, { useLayoutEffect, useRef, useEffect, useState } from 'react'
import { Box, Grid } from '@mui/material';
import { useParams, Outlet } from "react-router-dom";
import MessengerNavigator from './MessengerNavigator';
import DisplayConversation from './DisplayConversation';
import NavBar from '../Navbar';
import ActiveUser from './ActiveUser';
import { UseGlobalContext } from '../Provider/Context';
import WindowSize from '../SingleComponent/WindowSize';

const Index = () => {
    const { id } = useParams()

    const windowWidth = WindowSize()

    const navref = useRef()
    const { user, socket } = UseGlobalContext()

    const [state, setstate] = useState()
    const [UserFriend, setUserFriend] = useState([])
    const [navigatorLoading, setNavigatorLoading] = useState(true)



    useLayoutEffect(() => {
        const navHi = navref.current?.getBoundingClientRect().height;
        setstate(navHi)
    }, [])


    useEffect(() => {
        let subscribe = true
        socket.on("userFriends", (data) => {
            if (subscribe) {
                if (data.success) {
                    setNavigatorLoading(false)
                    setUserFriend(data.friends)

                }

            }
        })
        return () => {
            subscribe = false
        }
    }, [socket])

    useEffect(() => {
        socket.emit("userFriends", user._id)

        socket.on("newConversation", (data) => {
            setUserFriend(prev => [...prev, data])
            socket.emit("giveMeMyFriends", user._id)
        })
        socket.on("newRoomToactiveUser", (data) => {
            setUserFriend(prev => [...prev, data])
            socket.emit("giveMeMyFriends", user._id)

        })

    }, [socket, user._id])



    return (
        <>
            <div ref={navref} >
                <NavBar socket={socket} id={id} />
            </div>
            <Grid sx={{ color: 'white' }} className='min_h_inhrit' id='messenger' style={{ minHeight: `calc(100vh - ${state}px)` }}  >
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }} className='f_shink_0 min_h_inhrit '  >
                    <MessengerNavigator data={UserFriend} socket={socket} loading={navigatorLoading} />
                    {windowWidth > 576 && (
                        <React.Fragment>
                            {id ? <Outlet /> : <DisplayConversation />}
                            <ActiveUser socket={socket} />
                        </React.Fragment>
                    )}


                </Box>
            </Grid>
        </>
    )
}

export default Index
