import React, { useCallback, useEffect, useState, useContext, createContext } from 'react';
import { AlignJustify, X } from "lucide-react"
import { Tooltip } from 'react-tooltip'
import apiService from '../services/api.js'
import AddProjectModal from './AddProjectModal';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.js';

const SidebarContext = createContext();

export default function Prueba() {
    const { isLoggedIn } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setModalState] = useState(false);
    const [projects, setProjects] = useState([]);
    const [paramsWindow, setParamsWindow] = useState(window.location.pathname.slice(1));
    const [error, setError] = useState(null);

    const toggleSidebar = () => {
        setSidebarOpen(prevState => !prevState);
    };

    const handleLocation = (e) => {
        setParamsWindow(new URL(e.currentTarget.href).pathname.slice(1));
        setSidebarOpen(false);
    };

    const openModal = useCallback(() => {
        setModalState(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalState(false);
    }, []);

    const projectData = () => {
        apiService.getProjects()
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
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black opacity-50 z-40 "></div>
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-white w-64 overflow-y-auto transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    {/* Contenido del sidebar */}
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <span className='mr-2 text-xl'>Projects</span>
                        <button onClick={openModal} className='bg-indigo-200 rounded-full p-[2px] focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-offset-1' name="my-anchor-element-">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600">
                                <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <Tooltip
                            anchorSelect="[name^='my-anchor-element-']"
                            content="New Project"
                            place='right'
                        />
                        {/* Botón para cerrar el sidebar */}
                        <button onClick={toggleSidebar} className="p-1.5 rounded-lg ms-auto hover:bg-indigo-200">
                            <X />
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ isSidebarOpen }}>
                        <ul className='px-1'>
                            {/* Lista de elementos del sidebar */}
                            <SidebarList projects={projects} handleLocation={handleLocation} paramsWindow={paramsWindow} />
                        </ul>
                        <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} />
                    </SidebarContext.Provider>
                </nav>
            </aside>

            {/* Botón para abrir el sidebar */}
            <button onClick={toggleSidebar} className={` fixed top-2.5 left-4 p-1.5 rounded-lg  hover:bg-indigo-200 ${isSidebarOpen ? 'hidden' : ''} `} name="my-anchor-element-1">
                <AlignJustify />
                <Tooltip
                    anchorSelect="[name^='my-anchor-element-1']"
                    content="Projects"
                />
            </button>
        </>
    );
}

export function SidebarItem({ icon, text, active, alert }) {
    const { isSidebarOpen } = useContext(SidebarContext);
    return (
        <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}>
            {icon}
            <span className={`overflow-auto transition-all ${isSidebarOpen ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${isSidebarOpen ? "" : "top-2"}`}>
                </div>
            )}
            {!isSidebarOpen && (
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
