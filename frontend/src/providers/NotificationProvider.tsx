'use client';

import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default NotificationProvider;
