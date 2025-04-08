import React, { useEffect } from 'react';
import '../../styles/pixelated.css';

interface BaseModalProps {
  showModal: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ showModal, onClose, children }) => {
  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onClose();
      }
    };

    const stopArrowKeys = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    if (showModal) {
      window.addEventListener('keydown', handleEscape);
      window.addEventListener('keydown', stopArrowKeys);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', stopArrowKeys);
    };
  }, [showModal, onClose]);

  if (!showModal) return null;

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content pixel-corners-grey">
        {children}
      </div>
    </div>
  );
};

export default BaseModal;