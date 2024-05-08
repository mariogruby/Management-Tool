import React, { useContext }  from 'react'
import { AuthContext } from '../context/auth'

const Greeting = () => {
    const { user } = useContext(AuthContext)
    return (
        <h1>hello, {user.email}</h1>
    )
}

export default Greeting