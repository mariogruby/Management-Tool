import React, { useContext } from 'react'
import { Tooltip } from 'react-tooltip'
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.js';
// import Greeting from '../components/Greeting.jsx'
import BtnSecondary from './BtnSecondary.jsx';
import { LogOut, UserCog } from 'lucide-react'

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
        <div className='flex items-center'>
          <div className='mr-4' name="my-anchor-element-5">
            <Link to='/update'>
              <BtnSecondary>
                <UserCog size="1.5em" />
              </BtnSecondary>
            </Link>
            <Tooltip
              anchorSelect="[name^='my-anchor-element-5']"
              content="User Edit"
            />
          </div>
          <div name="my-anchor-element-6" className='mr-2'>
            <BtnSecondary onClick={logOutHandler}><LogOut size="1.5em" /></BtnSecondary>
            <Tooltip
              anchorSelect="[name^='my-anchor-element-6']"
              content="Logout"
              place='top-start'
            />
          </div>
        </div>
      </div>
    </>

  )
}

export default Navbar