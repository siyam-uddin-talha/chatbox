import { useEffect } from 'react'
import io from "socket.io-client"


const socket = io.connect("/")

const SocketIoProvider = () => {

    useEffect(() => {
        // return () => {
        //     socket.close();
        // }
        return () => {
            socket.disconnect();
        }
    }, [])

    return { socket }
}


export default SocketIoProvider
