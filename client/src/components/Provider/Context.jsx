import React, { createContext, useState, useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../../Graphql/Query/GetUser';
import io from "socket.io-client"
const Context = createContext()


const socket = io.connect("https://mr-messenger.herokuapp.com/")

const AppContext = ({ children }) => {

    const { data, loading: queryLoad } = useQuery(GET_USER)

    const [user, setUser] = useState({
        user: null,
    })
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        return () => {
            socket.disconnect();
        }
    }, [])
    useEffect(() => {
        if (data) {
            if (data.user) {
                setUser({
                    user: data.user.user
                })
            }
        }
    }, [data])

    useEffect(() => {
        if (!queryLoad) {
            setTimeout(() => {
                setLoading(false)
            }, 1500);
        }
    }, [queryLoad])

    return (
        <Context.Provider value={{ ...user, setUser, loading, socket }} >
            {children}
        </Context.Provider>
    )
}

export const UseGlobalContext = () => {
    return useContext(Context)
}

export default AppContext
