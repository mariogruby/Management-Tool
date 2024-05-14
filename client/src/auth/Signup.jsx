import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/auth.js";
import BtnPrimary from '../components/buttons/BtnPrimary.jsx';
import Loader from '../components/others/Loading.jsx';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
        if (errorMessage && errorMessage.includes('address')) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
        if (errorMessage && errorMessage.includes('Password')) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)

        const requestBody = { email, password };
        authService.signup(requestBody)
            .then((response) => {
                // setIsLoading(true);
                setTimeout(() => {
                    toast.success('Account created');
                    navigate("/login");
                }, 1500);
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
                setIsLoading(false);
            });
    };

    return (
        <>
            <h2 className='text-4xl flex justify-center text-gray-800 mb-3'>Create account</h2>
            <form onSubmit={handleSignupSubmit} noValidate>
                <div className='mb-3'>
                    <label htmlFor="email" className='block text-gray-600'>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmail}
                        className={`border ${errorMessage && (errorMessage.includes('address') || errorMessage.includes('.')) ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400`}
                        id="email"
                        name="email"
                    />
                    {errorMessage && errorMessage.includes('address') && <div className="error-message text-red-500">{errorMessage}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="password" className='block text-gray-600'>Password:</label>
                    <input
                        type="password"
                        placeholder="Create password (at least 6 characters)"
                        value={password}
                        onChange={handlePassword}
                        className={`border ${errorMessage && (errorMessage.includes('Password') || errorMessage.includes('.')) ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400`}
                        id="password"
                        name="password"
                    />
                    {errorMessage && errorMessage.includes('Password') && <div className="error-message text-red-500">{errorMessage}</div>}
                </div>
                {errorMessage && errorMessage.includes('Account') && <div className="error-message text-red-500  flex justify-center mb-2">{errorMessage}</div>}
                {errorMessage && errorMessage.includes('.') && <div className="error-message text-red-500  flex justify-center mb-2">{errorMessage}</div>}
                <div className='flex justify-center'>
                    {isLoading ?
                        <BtnPrimary style={{ width: '188px', opacity: 0.7 }} className='' disabled><Loader /></BtnPrimary>
                        :
                        <BtnPrimary style={{ width: '188px' }} type="submit">Sign up</BtnPrimary>}
                </div>
                <div className='flex justify-center mt-3'>
                    <p className=' text-gray-800'>Already have an account? <Link to='/login' className='text-indigo-600 hover:text-indigo-900'>Log in</Link></p>
                </div>
            </form>
        </>
    );
};

export default SignupPage;