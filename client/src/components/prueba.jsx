import React, { useCallback, useEffect, useState, useContext, createContext } from 'react';
import { PanelLeftOpen, AlignJustify, PanelLeftClose, X  } from "lucide-react"
import { Navigate } from 'react-router-dom'
import AddProjectModal from './AddProjectModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.js';

const SidebarContext = createContext();

export default function Prueba({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn } = useContext(AuthContext);
    const [isModalOpen, setModalState] = useState(false);
    const [projects, setProjects] = useState([]);
    const [paramsWindow, setParamsWindow] = useState(window.location.pathname.slice(1));
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(true);

    const toggleSidebar = () => {
        setExpanded((curr) => !curr);
    };

    const handleLocation = (e) => {
        setParamsWindow(new URL(e.currentTarget.href).pathname.slice(1));
    };

    const openModal = useCallback(() => {
        setModalState(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalState(false);
    }, []);

    const projectData = () => {
        const token = localStorage.getItem('authToken');
        axios.get('http://localhost:5005/projects/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setProjects(res.data);
            })
            .catch((error) => {
                setError(error);
            });
    };

    useEffect(() => {
        if (isLoggedIn) {
            projectData();
            document.addEventListener('projectUpdate', ({ detail }) => {
                projectData();
            });
            return () => {
                document.removeEventListener('projectUpdate', {}, false);
            };
        }
    }, [isLoggedIn]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-white border-r shadow-sm ">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <span className={`overflow-hidden transition-all text-xl items-center justify-between ${expanded ? "w-32" : "w-0"}`}>Projects
                            <button onClick={openModal} className='m-3 bg-indigo-200 rounded-full p-[2px] focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-offset-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600">
                                    <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </span>
                        <button onClick={toggleSidebar} className="p-1.5 rounded-lg bg-gray-50 hover:bg-indigo-200">
                            {expanded ? <X /> : <AlignJustify />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className={`flex-1 px-1 ${expanded ? '' : 'hidden'}`}>
                            <SidebarList projects={projects} handleLocation={handleLocation} paramsWindow={paramsWindow} />
                        </ul>
                        <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} />
                    </SidebarContext.Provider>

                    {/* <div className="border-t flex p-3">
                        <img src='' className={`w-10 h-10 rounded-md ${expanded ? '' : 'hidden'}`} />
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"} `}>
                            <div className="leading-4">
                                <h4 className="font-semibold">constGenius</h4>
                                <span className="text-xs text-gray-600">constgenius@gmail.com</span>
                            </div>
                            <MoreVertical size={20} />
                        </div>
                    </div> */}
                </nav>
            </aside>
        </>
    );
}

export function SidebarItem({ icon, text, active, alert }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}>
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}>

                </div>
            )}

            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {text}
                </div>
            )}
        </li>
    );
}

function SidebarList({ projects, handleLocation, paramsWindow }) {
    return (
        <>
            {projects.map((project, index) => (
                <Link key={index} to={project._id} onClick={(e) => handleLocation(e)}>
                    <li className={`px-5 py-1.5 mb-1 text-gray-600 font text-sm capitalize select-none hover:text-indigo-600 rounded transition-colors hover:bg-indigo-200/80 ${paramsWindow === project._id && 'text-indigo-600 bg-indigo-200/80'}`}>
                        {project.title}
                    </li>
                </Link>
            ))}
        </>
    );
}
