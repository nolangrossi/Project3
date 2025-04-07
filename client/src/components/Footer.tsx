import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/footer.css";
import CreditsModal from "./modals/CreditsModal";

const githubUsers = [
  {
    username: "NolanGrossi",
    profileUrl: "https://github.com/nolangrossi",
    avatarUrl: "https://avatars.githubusercontent.com/nolangrossi",
  },
  {
    username: "CerfSoleil",
    profileUrl: "https://github.com/cerfsoleil",
    avatarUrl: "https://avatars.githubusercontent.com/cerfsoleil",
  },
  {
    username: "AndrewPelfrey",
    profileUrl: "https://github.com/andrewPelfrey",
    avatarUrl: "https://avatars.githubusercontent.com/andrewpelfrey",
  },
];

const Footer: React.FC = () => {
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  return (
    <>
      <footer className="footer">
        {/* Left Side: Trademark & Terms */}
        <div className="footer-left">
          <p>© {new Date().getFullYear()} by Company Name</p>
          <NavLink to="/terms" className="footer-link">
            Terms & Conditions
          </NavLink>
        </div>

        {/* Center: GitHub Profiles */}
        <div className="footer-center">
          {githubUsers.map((user) => (
            <a key={user.username} href={user.profileUrl} target="_blank" rel="noopener noreferrer"> 
                <img src={user.avatarUrl} alt={user.username} className="github-avatar" />
                <p>{user.username}</p>
            </a>
          ))}
        </div>

        {/* Right Side: Credits & Employee Login */}
        <div className="footer-right">
          <button onClick={() => setShowCreditsModal(true)} className="footer-button">
            Credits
          </button>
        </div>
      </footer>
      {/* Credits Modal */}
      <CreditsModal showModal={showCreditsModal} setShowCreditsModal={setShowCreditsModal} />
    </>
  );
};

export default Footer;
