import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import StatsModal from "./StatsModal";
import "../styles/menuBox.css";

interface MenuBoxProps {
  checkWord: () => void;
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

const MenuBox: React.FC<MenuBoxProps> = ({ checkWord, isLoggedIn, toggleLogin }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuOptions = [
    { label: "Submit", action: checkWord },
    { label: isLoggedIn ? "Log Out" : "Log In", action: () => setShowLoginModal(true) },
    { label: "Stats", action: () => setShowStatsModal(true) },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev === 0 ? menuOptions.length - 1 : prev - 1));
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev === menuOptions.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Enter") {
        menuOptions[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, menuOptions]);

  return (
    <div className="menu-box pixel-corners-red">
      {menuOptions.map((option, index) => (
        <button key={index} className="button" onClick={option.action}>
          {selectedIndex === index ? "► " : "  "}
          {option.label}
        </button>
      ))}

      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} toggleLogin={toggleLogin} />
      )}
      {showStatsModal && <StatsModal closeModal={() => setShowStatsModal(false)} />}
    </div>
  );
};

export default MenuBox;
