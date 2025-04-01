import React, { useEffect } from 'react';
// import '../styles/creditsModal.css';

interface CreditsModalProps {
  showModal: boolean;
  setShowCreditsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ showModal, setShowCreditsModal }) => {
  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowCreditsModal(false);
    }
  };

  const handleClose = () => {
    setShowCreditsModal(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCreditsModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [setShowCreditsModal]);

  return (
    showModal && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
          <button className="close-btn" onClick={handleClose}>X</button>
          <h2>Credits</h2>
          <p>&copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.</p>
          <p>Developed by Your Name / Team.</p>
          <p>Icons by XYZ, Images by ABC, Fonts by DEF.</p>
        </div>
      </div>
    )
  );
};

export default CreditsModal;
