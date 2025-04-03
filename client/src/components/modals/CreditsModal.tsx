import React, { useEffect } from 'react';
// import '../styles/creditsModal.css';
import '../../styles/pixelated.css'

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
        <div className="horizontal-border top-border"></div>
        <div className="vertical-border left-border"></div>
          <button className="close-btn" onClick={handleClose}>X</button>
          <h2>Credits</h2>
          <p> &copy; Nintendo, Game Freak, and The Pokémon Company</p>
          <p></p>
          <p>Pokémon and all related trademarks, characters, and elements are 
            copyrights of Nintendo, Game Freak, and The Pokémon Company. This fan project is 
            not affiliated with, endorsed by, or approved by any of these companies. 
            It is created solely for fan enjoyment and educational purposes. No copyright 
            infringement is intended.</p>
          <div className="horizontal-line top-line"></div>
          <div className="horizontal-line bottom-line"></div>
          <div className="horizontal-border bottom-border"></div>
          <div className="vertical-border right-border"></div>
        </div>
      </div>
    )
  );
};

export default CreditsModal;
