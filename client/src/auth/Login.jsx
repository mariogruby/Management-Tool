import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.js';
import BtnPrimary from '../components/buttons/BtnPrimary.jsx'
import authService from '../services/auth.js';
import Loader from '../components/others/Loading.jsx';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);
    const { storeToken, authenticateUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
        if (errorMessage && (errorMessage.includes('found') || errorMessage.includes('Provide'))) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
        if (errorMessage && (errorMessage.includes('Unable') || errorMessage.includes('Provide'))) {
            setErrorMessage(undefined);
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const requestBody = { email, password };
        setIsLoading(true)

        authService.login(requestBody)
            .then((response) => {
                // setIsLoading(true);
                setTimeout(() => {
                    storeToken(response.data.authToken);
                    authenticateUser();
                    navigate("/");
                }, 1500);
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
                setIsLoading(false)
            });
    };

    return (
        <>
            <h2 className='text-4xl flex justify-center text-gray-800 mb-3'>Log in</h2>
            <form onSubmit={handleLoginSubmit} noValidate>
                <div className='mb-3'>
                    <label htmlFor='email' className='block text-gray-600'>Email:</label>
                    <input
                        type="email"
                        placeholder='Enter email'
                        value={email}
                        onChange={handleEmail}
                        className={`border ${errorMessage && (errorMessage.includes('found') || errorMessage.includes('Provide')) ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400`}
                        id="email"
                        name="email"
                    />
                    {errorMessage && errorMessage.includes('found') && <div className="error-message text-red-500">{errorMessage}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='password' className='block text-gray-600'>Password:</label>
                    <input
                        type="password"
                        placeholder='Enter password'
                        value={password}
                        onChange={handlePassword}
                        className={`border ${errorMessage && (errorMessage.includes('Unable') || errorMessage.includes('Provide')) ? 'border-red-500' : 'border-gray-300'} rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400`}
                        id="password"
                        name="password"
                    />
                    {errorMessage && errorMessage.includes('Unable') && <div className="error-message text-red-500">{errorMessage}</div>}
                </div>
                {errorMessage && errorMessage.includes('Provide') && <div className="error-message text-red-500  flex justify-center mb-2">{errorMessage}</div>}
                <div className='flex justify-center'>
                    {isLoading ?
                        <BtnPrimary style={{ width: '188px', opacity: 0.7 }} className='' disabled><Loader /></BtnPrimary >
                        :
                        <BtnPrimary style={{ width: '188px' }} type="submit">Log in</BtnPrimary>}
                </div>
                <div className='flex justify-center mt-3'>
                    <p className=' text-gray-800'>Don´t have an account?  <Link to='/signup' className='text-indigo-600 hover:text-indigo-900'>Sign up</Link></p>
                </div>
            </form>
        </>
    );
};

export default LoginPage;