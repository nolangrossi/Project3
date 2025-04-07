import React from 'react';
import BaseModal from './BaseModal';
import "../../styles/creditsModal.css"
interface CreditsModalProps {
  showModal: boolean;
  setShowCreditsModal: React.Dispatch<React.SetStateAction<boolean>>;
  githubUsers: {
    username: string;
    profileUrl: string;
    avatarUrl: string;
  }[];
}

const CreditsModal: React.FC<CreditsModalProps> = ({ showModal, setShowCreditsModal, githubUsers }) => {
  return (
    <BaseModal showModal={showModal} onClose={() => setShowCreditsModal(false)}>
      <h2>Credits</h2>
      <p>&copy; Nintendo, Game Freak, and The Pokémon Company</p>
      <p>
        Pokémon and all related trademarks, characters, and elements are copyrights of Nintendo, Game Freak, and The Pokémon Company.
        This fan project is not affiliated with, endorsed by, or approved by any of these companies. It is created solely for fan enjoyment
        and educational purposes. No copyright infringement is intended.
      </p>

      <h3>Contributors</h3>
      <div className="github-profiles">
        {githubUsers.map((user) => (
          <a key={user.username} href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="github-profile">
            <img src={user.avatarUrl} alt={user.username} className="github-avatar" />
            <p>{user.username}</p>
          </a>
        ))}
      </div>

      <div className="terms-section">
        <p>
          <a href="/terms" className="footer-link">
            Terms & Conditions
          </a>
        </p>
      </div>

      <button className="close-btn" onClick={() => setShowCreditsModal(false)}>► Close</button>
    </BaseModal>
  );
};

export default CreditsModal;
