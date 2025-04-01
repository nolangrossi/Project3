import React from "react";
import "../styles/statsModal.css";

interface StatsModalProps {
  closeModal: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content pixel-corners-blue">
        <h2>Game Stats</h2>
        <p>Game stats will be here.</p>
        <button className="close-button" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default StatsModal;
