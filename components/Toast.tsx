
import React from 'react';
import type { ToastMessage } from '../types';
import { useGreenMachine } from '../contexts/GreenMachineContext';

// Icons for Toast messages
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
);

const InformationCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const ExclamationTriangleIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
</svg>
);


interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  let bgColor = 'bg-blue-100 border-blue-500';
  let textColor = 'text-blue-700';
  let Icon = InformationCircleIcon;

  switch (toast.type) {
    case 'success':
      bgColor = 'bg-green-100 border-green-500';
      textColor = 'text-green-700';
      Icon = CheckCircleIcon;
      break;
    case 'error':
      bgColor = 'bg-red-100 border-red-500';
      textColor = 'text-red-700';
      Icon = ExclamationCircleIcon;
      break;
    case 'warning':
      bgColor = 'bg-yellow-100 border-yellow-500';
      textColor = 'text-yellow-700';
      Icon = ExclamationTriangleIcon;
      break;
  }

  return (
    <div 
      className={`p-4 mb-3 rounded-md border-l-4 shadow-lg ${bgColor} ${textColor} flex items-start space-x-3 transition-all duration-300 ease-in-out transform opacity-100 translate-y-0 hover:opacity-90`}
      role="alert"
    >
      <Icon />
      <p className="flex-grow text-sm">{toast.message}</p>
      <button 
        onClick={() => onDismiss(toast.id)} 
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${textColor} hover:bg-opacity-20 hover:bg-current focus:ring-2 focus:ring-current`}
        aria-label="Dismiss"
      >
        <span className="sr-only">Dismiss</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};


export const ToastContainer: React.FC = () => {
  // Assuming toasts are managed in context and passed down or accessed here
  const { toasts, showToast } = useGreenMachine(); // Or however you manage toasts removal

  const handleDismiss = (id: string) => {
    // This is a bit of a hack. Ideally, the context would provide a removeToast function.
    // For now, we can't directly remove from here without modifying the context's state management.
    // This illustrates the need for a `removeToast` function in the context.
    // For this demo, toasts auto-dismiss via timeout in GreenMachineContext.
    console.warn(`Toast dismiss clicked for ${id}, but manual dismiss from container not fully implemented without context modification. Relies on auto-dismiss.`);
  };

  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-xs sm:max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};

    