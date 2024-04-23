import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.js';
import BtnPrimary from '../components/BtnPrimary.jsx'
import authService from '../services/auth.js';
import Loader from '../components/Loading.jsx'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();


    const { storeToken, authenticateUser, isLoading } = useContext(AuthContext);

    const handleEmail = (e) => setEmail(e.target.value)
    const handlePassword = (e) => setPassword(e.target.value)

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const requestBody = { email, password };

        authService
            .login(requestBody)
            .then((response) => {
                storeToken(response.data.authToken);
                authenticateUser();
                navigate("/")
            })
            .catch((error) => {
                const errroDescription = error.response.data.message;
                setErrorMessage(errroDescription);
            })
    };

    return (
        <>
        <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
                <div className='mb-3'>
                    <label className='block text-gray-600'>Email:</label>
                    <input type="email" value={email} onChange={handleEmail} className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' />
                </div>
                <div className='mb-3'>
                    <label className='block text-gray-600'>Password:</label>
                    <input type="password" value={password} onChange={handlePassword} className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {isLoading ?  <p>loading...</p> : <BtnPrimary type="submit">Login</BtnPrimary>}
                <p>no estas logeado, haz click <Link to='/signup'>AQUI</Link></p>
            </form>
        </>
    );
}

export default LoginPage;