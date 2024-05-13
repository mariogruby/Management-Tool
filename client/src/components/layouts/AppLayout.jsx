import React from 'react';
import Offcanvas from '../others/Offcanvas';
import Navbar from '../others/Navbar';

const AppLayout = ({ children }) => {

    return (
        <div className='bg-theme-gray flex'>
            <div className="fixed inset-x-0 z-10">
                <Navbar />
            </div>
            <div className="fixed z-10 h-full ">
                <Offcanvas />
            </div>
            <div className='flex-1'>
                <div className="flex bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AppLayout;