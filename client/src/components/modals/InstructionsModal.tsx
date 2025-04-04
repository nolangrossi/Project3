import React, { useEffect } from 'react';
// import '../styles/creditsModal.css';
import '../../styles/pixelated.css'

interface InstructionsModalProps {
  showInstructionsModal: boolean;
  setShowInstructionsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ showInstructionsModal, setShowInstructionsModal }) => {
  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowInstructionsModal(false);
    }
  };

  const handleClose = () => {
    setShowInstructionsModal(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowInstructionsModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [setShowInstructionsModal]);

  return (
    showInstructionsModal && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
        <div className="horizontal-border top-border"></div>
        <div className="vertical-border left-border"></div>
          <h2>Instructions</h2>
          <h3>The Word Game</h3>
          <p>•The point of this game is to correctly guess the presented pokemon through trial and error.</p>
          <p>•After filling in all the boxes in each attempt, you can hit submit to check your answer</p>
          <p>•Green means you've gotten the correct letter in the right position</p>
          <p>•Yellow means that the letter is present in the word, but you have it in the wrong place.</p>
          <h3>Miscellaneous</h3>
          <p>•You can navigate the menus and the page with your arrows, enter, and escape keys</p>
          <p>•If you are logged in, your scores will be saved and you'll be able to compare them with other players!</p>
          <button className="close-btn" onClick={handleClose}>► Close</button>
          <div className="horizontal-line top-line"></div>
          <div className="horizontal-line bottom-line"></div>
          <div className="horizontal-border bottom-border"></div>
          <div className="vertical-border right-border"></div>
        </div>
      </div>
    )
  );
};

export default InstructionsModal;
