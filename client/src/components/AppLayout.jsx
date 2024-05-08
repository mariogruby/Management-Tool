import React from 'react'
import Sidebar from './prueba'
import Navbar from './Navbar'

const AppLayout = ({ children }) => {

    return (
        <div className='bg-white flex'>
            <div className="fixed inset-x-0 z-10">
                <Navbar />
            </div>
            <div className="fixed z-10 h-full ">
                <Sidebar />
            </div>
            <div className='flex-1 pt-20'>
                <div className="flex">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AppLayout
