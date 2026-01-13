import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Allow the modal to render first, then trigger the animation
      const timer = setTimeout(() => setShowModal(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  if (!isOpen && !showModal) return null; // Only unmount when both isOpen and showModal are false

  const backdropClasses = `fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
    showModal ? "opacity-100" : "opacity-0"
  }`;
  const modalContentClasses = `bg-zinc-900 rounded-2xl border border-zinc-800 p-6 w-full max-w-lg mx-4 transition-all duration-300 ease-out ${
    showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"
  }`;

  return (
    <div className={backdropClasses} onClick={onClose}>
      <div
        className={modalContentClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
