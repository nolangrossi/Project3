import React, { useState, useEffect } from "react";
import "../styles/menuBox.css";

interface MenuBoxProps {
  checkWord: () => void;
  resetGame: () => void;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStatsModal: React.Dispatch<React.SetStateAction<boolean>>;

  setShowCreditsModal: React.Dispatch<React.SetStateAction<boolean>>; // Add setShowCreditsModal prop

  setShowInstructionsModal: React.Dispatch<React.SetStateAction<boolean>>;

  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userScore: number | null;
}

const MenuBox: React.FC<MenuBoxProps> = ({
  checkWord,
  resetGame,
  setShowLoginModal,
  setShowStatsModal,
  setShowCreditsModal, // Add setShowCreditsModal
  setShowInstructionsModal, 
  isLoggedIn,
  setIsLoggedIn,
  userScore,

}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Define menu options
  const menuOptions = [
    { label: "Submit", action: checkWord },
    {
      label: isLoggedIn ? "Log Out" : "Login",
      action: isLoggedIn
        ? () => {
            setIsLoggedIn(false);
            // Optionally handle logout actions like clearing session data
          }
        : () => setShowLoginModal(true),
    },

    { label: "Player Stats", action: () => setShowStatsModal(true) },
    ...(userScore !== null
      ? [{ label: "Play Again", action: resetGame }]
      : []),
    { label: "Credits", action: () => setShowCreditsModal(true) }, // Add Credits option

    { label: "Instructions", action: () => setShowInstructionsModal(true)},

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

      {/* Add controls hint */}
      <div className="menu-controls-hint">
        <p>Use Arrow Keys to Navigate, Enter to Select</p>
      </div>
    </div>
  );
};

export default MenuBox;
