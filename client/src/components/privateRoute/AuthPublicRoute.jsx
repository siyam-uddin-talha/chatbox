import React from 'react'
import { Navigate } from 'react-router-dom';
// use redux here or custom context
import { UseGlobalContext } from '../Provider/Context';

const PublicRoute = ({ children }) => {

    // use redux here or custom context
    const { user } = UseGlobalContext()

    return !user ? children : <Navigate to='/' replace />

}

export default PublicRoute
