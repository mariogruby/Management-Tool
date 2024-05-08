import React, { useContext } from 'react'
import { Tooltip } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.js';
import BtnSecondary from './BtnSecondary.jsx';
import { LogOut } from 'lucide-react'

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
    <div className='bg-white shadow h-14 flex justify-between items-center'>
      <div></div>
      <Tooltip content="Logout" className=' z-20'>
      <div className='mr-5'>
      <BtnSecondary onClick={logOutHandler}> <LogOut size="1em" /></BtnSecondary>
      </div>
      </Tooltip>
    </div>
    </>
  )
}

export default Navbar