import React, { useState, useRef, useEffect } from 'react'
import { Box, IconButton, } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useLocation } from 'react-router-dom'
import { useParams } from "react-router-dom";
import ShowSmallAlert from '../SingleComponent/ShowSmallAlert';
import { UseGlobalContext, } from '../Provider/Context';


const ConversationPlayground = () => {

    const { id } = useParams()
    const { search } = useLocation()

    if (!id) {
        return <UseNotSelected />
    }
    return (
        <Box className="conversation_playground display_flex f_shink_1 ofxh f_basis_0 flex_grow_1 ofyh" sx={{ color: "white" }} >
            <Box className='playground_from_wrapper display_flex flex_grow_1 flex_column' >
                <ReadConversation />
                <WriteMessage id={id} friendEmail={search ? search.split("=")[1] : ""} />
            </Box>
        </Box>
    )
}

const ReadConversation = () => {

    const { id } = useParams()

    const { user, socket } = UseGlobalContext()

    const singleRef = useRef()
    const [RoomConversation, setRoomConversation] = useState([])

    const [error, setError] = useState(null)
    const [message, setMessage] = React.useState({
        open: false,
        message: ''
    })

    useEffect(() => {
        socket.emit("roomConversation", { roomId: id, userId: user._id, })
    }, [socket, user._id, id])


    useEffect(() => {
        let unsubscribe = true

        socket.on("getRoomConversation", (data) => {
            if (unsubscribe) {
                if (data.roomId === id) {
                    setError(false)
                    setRoomConversation(data.messages)
                } else if (!data.success && data.error) {
                    setError(true)
                }
            }
        })

        return () => {
            unsubscribe = false
        }
    }, [socket, id,])


    useEffect(() => {
        let unsubscribe = true
        socket.on("getMessage", (data) => {

            if (unsubscribe) {
                if (data.roomId === id) {
                    setRoomConversation(prev => [...prev, data.messages])
                } else if (!data.success) {
                    setMessage({
                        open: true,
                        message: `${data.message}`
                    })
                }
            }
        })
        return () => {
            unsubscribe = false
        }
    }, [socket, id])



    const scrollToBottom = () => {
        singleRef.current?.scrollIntoView({ block: 'end', behavior: "smooth" })
        // const messengerHei = messengerRef.current?.getBoundingClientRect().height;
    }

    React.useEffect(scrollToBottom, [])
    React.useEffect(scrollToBottom, [RoomConversation])

    if (error) {
        return <NotFounError />
    }

    return (
        <Box className="display__messages__all ofys ofxh f_basis_0 flex_grow_1 display_flex flex_column"  >
            <Box className='flex_grow_1 f_basis_0' sx={{ pt: 5, px: 3 }} >
                <Box className='messeging_container_wrapper' >
                    <Box className='messeging_container display_flex flex_column' sx={{ gap: 1 }} >

                        {RoomConversation.map(e => (
                            <div key={e._id} className='message__' style={{ justifyContent: user._id === e.sender ? "flex-end" : "flex-start" }} ref={singleRef} >
                                <span className='_SP__Mes_ awaf' >
                                    {e.text}
                                </span>
                            </div>
                        ))
                        }

                    </Box>
                </Box>
            </Box>
            <ShowSmallAlert open={message.open} setClose={setMessage} message={message.message} />
        </Box>
    )
}



const WriteMessage = ({ id, friendEmail }) => {

    const { user, socket } = UseGlobalContext()

    const [text, setText] = useState("")



    const handleSubmit = (e) => {
        e.preventDefault()

        socket.emit("sendMessage", {
            roomId: id,
            sender: user._id,
            text,
            friendEmail
        })

        setTimeout(() => {
            setText("")
        }, 20)

    }



    return (
        <Box className="write__messages__ f_basis_50 display_flex" sx={{ p: '.77rem 1.5rem' }} >
            <form onSubmit={handleSubmit} className='__klsa_form ofyh' >
                <Box className='input_fild_box flex_grow_1 ofxh' >
                    <input type="text" placeholder='Aa' value={text} onChange={(e) => setText(e.target.value)} className='write_message_input' />
                </Box>
                <Box>
                    <IconButton type='submit' color="primary" >
                        <ArrowForwardIosOutlinedIcon />
                    </IconButton>
                </Box>
            </form>

        </Box>
    )
}



const UseNotSelected = () => {
    return (
        <Box className="conversation_playground display_flex f_shink_1 ofxh f_basis_0 flex_grow_1 ofyh j-c-c a-i-c" >
            <Box className='LKJl_' >
                <h1>
                    Please select user Inbox
                </h1>
            </Box>
        </Box>
    )
}

const NotFounError = () => {
    return (
        <Box className="display_flex f_shink_1 ofxh f_basis_0 flex_grow_1 ofyh j-c-c a-i-c" >
            <Box className='LKJl_' >
                <h1>
                    Please select user Inbox
                </h1>
            </Box>
        </Box>
    )
}


export default ConversationPlayground
