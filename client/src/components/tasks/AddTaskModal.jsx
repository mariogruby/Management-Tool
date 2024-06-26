import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import BtnPrimary from '../buttons/BtnPrimary';
import apiService from '../../services/api';
import BtnSecondary from '../buttons/BtnSecondary';
import Loader from '../others/Loading';
import toast from 'react-hot-toast';

const AddTaskModal = ({ isAddTaskModalOpen, setAddTaskModal, projectId = null, taskId = null, edit = false, refreshData }) => {

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (edit && isAddTaskModalOpen) {
            apiService.getTask(projectId, taskId)
                .then((res) => {
                    setTitle(res.data[0].task[0].title);
                    setDesc(res.data[0].task[0].description);
                })
                .catch((error) => {
                    toast.error('Something went wrong');
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAddTaskModalOpen]);

    const handleSubmit = (e) => {
        const requestBody = { title, description: desc };
        e.preventDefault();
        setIsLoading(true);

        if (!edit) {
            apiService.addTask(projectId, requestBody)
                .then((res) => {
                    setAddTaskModal(false);
                    toast.success('Task created successfully');
                    setIsLoading(false);
                    setTitle('');
                    setDesc('');
                })
                .catch((error) => {
                    if (error.response.status === 422) {
                        toast.error(error.response.data.details[0].message);
                        setIsLoading(false);
                    } else {
                        toast.error('Something went wrong');
                        setIsLoading(false);
                    };
                });
        } else {
            apiService.editTask(projectId, taskId, requestBody)
                .then((res) => {
                    setAddTaskModal(false);
                    toast.success('Task is updated');
                    setIsLoading(false);
                    refreshData(true);
                    setTitle('');
                    setDesc('');
                })
                .catch((error) => {
                    if (error.response.status === 422) {
                        toast.error(error.response.data.details[0].message);
                        setIsLoading(false);
                    } else {
                        toast.error('Something went wrong');
                        setIsLoading(false);
                    };
                });
        };
    };

    return (
        <Transition appear show={isAddTaskModalOpen} as={Fragment}>
            <Dialog as='div' open={isAddTaskModalOpen} onClose={() => setAddTaskModal(false)} className="relative z-50">
                <div className="fixed inset-0 overflow-y-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center  w-screen h-screen">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as='div' className={'bg-white shadow px-6 py-4 rounded-t-md sticky top-0'}>
                                    {!edit ? (<h1>Add Task</h1>) : (<h1>Edit Task</h1>)}
                                    <button onClick={() => setAddTaskModal(false)} className='absolute right-6 top-4 text-gray-500 hover:bg-gray-100 rounded focus:outline-none focus:ring focus:ring-offset-1 focus:ring-indigo-200 '>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className='gap-4 px-6 py-4'>
                                    <div className='mb-3'>
                                        <label htmlFor="title" className='block text-gray-600'>Title</label>
                                        <input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' placeholder='Task title' />
                                    </div>
                                    <div className='mb-2'>
                                        <label htmlFor="description" className='block text-gray-600'>Description</label>
                                        <textarea id="description" name="description" value={desc} onChange={(e) => setDesc(e.target.value)} className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' rows="6" placeholder='Task description'></textarea>
                                    </div>
                                    <div className='flex justify-end items-center space-x-4'>
                                        <BtnSecondary onClick={() => setAddTaskModal(false)}>Cancel</BtnSecondary>
                                        {isLoading ?
                                            <BtnPrimary style={{ opacity: 0.7 }} className='' disabled><Loader /></BtnPrimary >
                                            :
                                            <BtnPrimary>Save</BtnPrimary>
                                        }
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddTaskModal;