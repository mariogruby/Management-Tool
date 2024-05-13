import React, { useContext }  from 'react'
import { AuthContext } from '../../context/auth'

//! this component it's not in used, it will be for future versions.

const Greeting = () => {
    const { user } = useContext(AuthContext)
    return (
        <h1>hello, {user.email}</h1>
    );
};

export default Greeting;