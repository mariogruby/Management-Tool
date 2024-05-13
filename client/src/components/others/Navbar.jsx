import React, { useContext } from 'react';
import { Tooltip } from 'react-tooltip';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.js';
import { LogOut, UserCog } from 'lucide-react';

const Navbar = () => {
  const { logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  function logOutHandler() {
    logOutUser();
    navigate("/login");
  };

  return (
    <>
      <div className=' bg-white shadow-md h-14 flex justify-between items-center'>
        <div></div>
        <div className='flex items-center'>
          <div className='mr-6 p-1.5 rounded-lg  hover:bg-indigo-200' name="my-anchor-element-5">
            <Link to='/update'>
                <UserCog size="1.5em" />
            </Link>
            <Tooltip
              anchorSelect="[name^='my-anchor-element-5']"
              content="User Edit"
            />
          </div>
          <div name="my-anchor-element-6" className='mr-3 p-1.5 rounded-lg  hover:bg-indigo-200'>
            <Link>
            <LogOut size="1.5em" onClick={logOutHandler} />
            </Link>
            <Tooltip
              anchorSelect="[name^='my-anchor-element-6']"
              content="Logout"
              place='top-start'
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;