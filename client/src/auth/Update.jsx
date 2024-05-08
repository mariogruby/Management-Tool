import React, { useState, useContext } from 'react';
import authService from "../services/auth.js";
import BtnPrimary from '../components/BtnPrimary.jsx';
import toast from 'react-hot-toast'
import { AuthContext } from '../context/auth.js';

const UpdateUser = () => {
    const { isLoading } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = async () => {
        const requestBody = { newPassword }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await authService.updateUser(requestBody)
            toast.success(response.data.message);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    return (
        <>
            <h2>Update Password</h2>
            <div className='mb-3'>
                <label className='block text-gray-600'>New Password:</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400'
                />
            </div>
            <div className='mb-3'>
                <label className='block text-gray-600'>Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400'
                />
            </div>
            {isLoading ? <p>loading...</p> : <BtnPrimary onClick={handleUpdatePassword}>Update</BtnPrimary>}
        </>
    );
};

export default UpdateUser