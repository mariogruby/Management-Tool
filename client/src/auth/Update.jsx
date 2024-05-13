import React, { useState } from 'react';
import authService from "../services/auth.js";
import { useNavigate, Link } from 'react-router-dom';
import BtnPrimary from '../components/buttons/BtnPrimary.jsx';
import BtnSecondary from '../components/buttons/BtnSecondary.jsx';
import toast from 'react-hot-toast';
import Loader from '../components/others/Loading.jsx';

const UpdateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };


    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const requestBody = { newPassword };
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        };

        try {
            const response = await authService.updateUser(requestBody);
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
            toast.error(error.response.data.message);
        };
    };

    return (
        <>
            <h2 className='text-2xl flex justify-center text-gray-800 mb-3'>Update Password</h2>
            <form onSubmit={handleUpdatePassword}>
                <div className='mb-3'>
                    <label htmlFor="new-password" className='block text-gray-600'>New Password:</label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={handleNewPassword}
                        className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400'
                        id="new-password"
                        name="new-password"
                    />

                </div>
                <div className='mb-3'>
                    <label htmlFor="confirm-password" className='block text-gray-600'>Confirm Password:</label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                        className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400'
                        id="confirm-password"
                        name="confirm-password"
                    />

                </div>
                <div className='flex justify-between'>
                    <Link to='/'>
                        <BtnSecondary aria-label="Go back">Back</BtnSecondary>
                    </Link>
                    {isLoading ?
                        <BtnPrimary style={{ width: '78px', opacity: 0.7 }} className='' disabled><Loader /></BtnPrimary>
                        :
                        <BtnPrimary onClick={handleUpdatePassword} aria-label="Update password">Update</BtnPrimary>}
                </div>
            </form>
        </>
    );
};

export default UpdateUser;