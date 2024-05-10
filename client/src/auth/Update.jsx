import React, { useState } from 'react';
import authService from "../services/auth.js";
import { useNavigate, Link } from 'react-router-dom';
import BtnPrimary from '../components/BtnPrimary.jsx';
import BtnSecondary from '../components/BtnSecondary.jsx';
import toast from 'react-hot-toast';
import Loader from '../components/Loading.jsx';
// import { AuthContext } from '../context/auth.js';

const UpdateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleUpdatePassword = async () => {
        const requestBody = { newPassword }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await authService.updateUser(requestBody)
            setIsLoading(true);
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                toast.success(response.data.message);
            }, 1000)
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    return (
        <>
            <h2 className='text-2xl flex justify-center text-gray-800 mb-3'>Update Password</h2>
            <div className='mb-3'>
                <label className='block text-gray-600'>New Password:</label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400'
                />
            </div>
            <div className='mb-3'>
                <label className='block text-gray-600'>Confirm Password:</label>
                <input
                    type="password"
                    placeholder="Repeat the new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400'
                />
            </div>
            <div className='flex justify-between'>
                <Link to='/'>
                    <BtnSecondary>Back</BtnSecondary>
                </Link>
                {isLoading ?
                    <BtnPrimary style={{ width: '78px', opacity: 0.7 }} className='' disabled><Loader /></BtnPrimary>
                    :
                    <BtnPrimary onClick={handleUpdatePassword}>Update</BtnPrimary>}
            </div>
        </>
    );
};

export default UpdateUser