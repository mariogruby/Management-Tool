import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Login from "./Login";
import Signup from "./Signup";
import Loader from "../components/Loading"

const AuthLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
    <Dialog as='div' open={isModalOpen} onClose={closeModal} className="relative z-50 ">
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
            <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen ">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300 "
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900 text-center"
                        >
                        </Dialog.Title>
                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </div>
    </Dialog>
</Transition>
  );
};

export default AuthLayout;
