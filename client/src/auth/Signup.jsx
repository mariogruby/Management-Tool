// Signup.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/auth.js";
import BtnPrimary from '../components/BtnPrimary.jsx'

const SignupPage = ({ handleTabChange }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();

    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const handleSignupSubmit = (e) => {
        e.preventDefault();

        const requestBody = { email, password };
        authService
            .signup(requestBody)
            .then((response) => {
                navigate("/login");
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
            });
    };

    return (
        <>
        <h2>Signup</h2>
            <form onSubmit={handleSignupSubmit}>
                <div className='mb-3'>
                    <label className='block text-gray-600'>Email:</label>
                    <input type="email" value={email} onChange={handleEmail} className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' />
                </div>
                <div className='mb-3'>
                    <label className='block text-gray-600'>Password:</label>
                    <input type="password" value={password} onChange={handlePassword} className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <BtnPrimary type="submit">Signup</BtnPrimary>
                <p>no estas registrado, haz click <Link to='/login'>AQUI</Link> para iniciar sesion</p>
            </form>
        </>
    );

}

export default SignupPage;
