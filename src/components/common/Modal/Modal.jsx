import React, { useEffect } from 'react';
import Button from '../Button/Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  hideCloseButton = false,
  footer,
  closeOnOverlayClick = true,
  showFooterCloseButton = false
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
    '2xl': 'sm:max-w-6xl',
    full: 'sm:max-w-full sm:m-4'
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
        onClick={handleOverlayClick}
      >
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      
      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div 
          className={`fixed inset-0 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
        
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        {/* Modal panel */}
        <div 
          className={`inline-block w-full transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all duration-300 sm:my-8 sm:align-middle ${
            sizeClasses[size]
          } ${
            isOpen 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-4 opacity-0 scale-95'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {title && (
            <div className="border-b border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 
                  className="text-xl font-semibold text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg 
                      className="h-5 w-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className={`${title ? 'px-6 py-5' : 'p-6'}`}>
            {children}
          </div>
          
          {/* Footer */}
          {(footer || showFooterCloseButton) && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                {footer ? (
                  footer
                ) : showFooterCloseButton ? (
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
          
          {/* Close button for modals without header */}
          {!title && !hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-400 shadow-lg hover:bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span className="sr-only">Close</span>
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;