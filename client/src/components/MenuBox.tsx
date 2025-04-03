import React, { useState, useEffect } from "react";
import "../styles/menuBox.css";

interface MenuBoxProps {
  checkWord: () => void;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStatsModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuBox: React.FC<MenuBoxProps> = ({ checkWord, setShowLoginModal, setShowStatsModal, isLoggedIn, setIsLoggedIn }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuOptions = [
    { label: "Submit", action: checkWord },
    {
      label: isLoggedIn ? "Log Out" : "Login", // Toggle button text based on login status
      action: isLoggedIn
        ? () => {
            setIsLoggedIn(false);
            // Optionally handle logout actions like clearing session data
          }
        : () => setShowLoginModal(true), // Open LoginModal when not logged in
    },
    { label: "Player Stats", action: () => setShowStatsModal(true)},
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
    </div>
  );
};

export default MenuBox;
