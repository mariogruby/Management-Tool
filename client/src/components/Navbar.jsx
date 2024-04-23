import React, { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.js';
import BtnSecondary from './BtnSecondary.jsx';
import BtnPrimary from './BtnPrimary.jsx';

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
      <div className='bg-white shadow h-14 mt-3'>
        <BtnSecondary onClick={logOutHandler}> Logout</BtnSecondary>
        <Link to={'/signup'} className="ml-3">
          <BtnPrimary>Signup</BtnPrimary>
        </Link>
        <Link to={'/login'} className="ml-3">
          <BtnPrimary>Login</BtnPrimary>
        </Link>
      </div>
    </>
  )
}

export default Navbar