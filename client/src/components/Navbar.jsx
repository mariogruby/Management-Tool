import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.js';
import BtnSecondary from './BtnSecondary.jsx';

const Navbar = () => {
  const { logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  function logOutHandler() {
    logOutUser()
    console.log(logOutUser, "user logged out")
    navigate("/login");
  }
  return (
    <>
      <div className='bg-white shadow h-14'>
        <BtnSecondary onClick={logOutHandler}> Logout</BtnSecondary>
      </div>
    </>
  )
}

export default Navbar