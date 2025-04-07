// Dependencies
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

// Functions
import { GETRANDOMPOKEMON } from "../utils/queries";
import { handleInputChange } from "./functions/inputNavigation";
import { handleKeyDown } from "./functions/keyboardNavigation";

// Components
import MenuBox from "./MenuBox";
import LoginModal from "./modals/LoginModal";
import StatsModal from "./modals/StatsModal";
import CreditsModal from "./modals/CreditsModal";

// Styles
import "../styles/game.css";
import "../styles/pixelated.css";

// Temporary Import For Mock Data
import { mockUserData } from './modals/mockStats'

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

const Game: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GETRANDOMPOKEMON);

  const [rows, setRows] = useState<string[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [colors, setColors] = useState<string[][]>([]);
  const [gameMessage, setGameMessage] = useState<string>("");
  const [incorrectRows, setIncorrectRows] = useState<boolean[]>(Array(6).fill(false));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Single state to track the active modal
  const [activeModal, setActiveModal] = useState<"login" | "stats" | "credits" | null>(null);


  // Initialize the game when the Pokémon data is loaded
  useEffect(() => {
    if (data && data.getRandomPokemon) {
      const selectedPokemon = data.getRandomPokemon;

      // Remove all special characters from the Pokémon's name
      const sanitizedPokemonName = selectedPokemon.name.replace(/[^a-zA-Z]/g, "");

      // Initialize rows and colors based on the sanitized Pokémon name length
      setRows(Array(6).fill("").map(() => Array(sanitizedPokemonName.length).fill("")));
      setColors(Array(6).fill("").map(() => Array(sanitizedPokemonName.length).fill("")));

      // Set hints for the Pokémon's type(s)
      setHints(selectedPokemon.typing);

      setGameMessage(`Guess the Pokémon!`);
    }
  }, [data]);

  // Reset the game state for replay
  const resetGame = () => {
    setRows([]);
    setCurrentRow(0);
    setActiveIndex(0);
    setUserScore(null);
    setHints([]);
    setColors([]);
    setGameMessage("");
    setIncorrectRows(Array(6).fill(false));
    refetch(); // Refetch a new Pokémon
  };

  const checkWord = () => {
    if (!data || !data.getRandomPokemon) return;

    const selectedPokemon = data.getRandomPokemon;
    const sanitizedPokemonName = selectedPokemon.name.replace(/[^a-zA-Z]/g, "");
    const guess = rows[currentRow].join("").toLowerCase();

    if (guess.length !== sanitizedPokemonName.length) {
      setGameMessage("Please fill all boxes.");
      return;
    }

    const wordArr = sanitizedPokemonName.toLowerCase().split("");
    const guessArr = guess.split("");
    let isCorrect = true;
    const newColors = [...colors];

    guessArr.forEach((letter, i) => {
      if (letter === wordArr[i]) {
        newColors[currentRow][i] = "green";
      } else if (wordArr.includes(letter)) {
        newColors[currentRow][i] = "yellow";
        isCorrect = false;
      } else {
        newColors[currentRow][i] = "red";
        isCorrect = false;
      }
    });

    console.log("isCorrect:", isCorrect); // Debugging

    // If the guess is correct, set all boxes in the current row to green
    if (isCorrect) {
      newColors[currentRow] = newColors[currentRow].map(() => "green");
      setUserScore(6 - currentRow);
      setGameMessage(`🎉 Congratulations! You won with a score of ${6 - currentRow}!`);
      console.log("Game won!"); // Debugging
    } else {
      const newIncorrectRows = [...incorrectRows];
      newIncorrectRows[currentRow] = true;
      setIncorrectRows(newIncorrectRows);

      if (currentRow < 5) {
        setCurrentRow(currentRow + 1);
        setActiveIndex(0);
        setGameMessage("Incorrect! Try again.");
      } else {
        setGameMessage(`Game over! The word was: ${sanitizedPokemonName}`);
      }
    }

    setColors(newColors);
    console.log("newColors:", newColors); // Debugging
    console.log("gameMessage:", gameMessage); // Debugging
  };

  if (loading) return (
    <div className="game-container">
      <h1>Loading...</h1>
    </div>
  );
  if (error) return (
    <div className="game-container">
      <h1>Error loading Pokémon data.</h1>
    </div>
  );

  return (
    <div className="game-container">
      <h1>Pokemon Word Guess Game</h1>

      <div className="grid-container">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`word-card ${rowIndex === currentRow ? "pixel-corners-red" : "pixel-corners-blue"}`}
          >
            <div className="horizontal-border top-border"></div>
            <div className="vertical-border left-border"></div>

            {/* Display a single type image as a hint */}
            {rowIndex >= 1 && rowIndex <= 3 && incorrectRows[rowIndex - 1] && hints[rowIndex - 1] && (
              <div className="types-container">
                <img
                  src={`/assets/types/${hints[rowIndex - 1].toLowerCase()}.svg`} // Show one type based on the row index
                  alt={hints[rowIndex - 1]}
                  className="type-icon"
                />
              </div>
            )}

            <div className="input-row">
              {row.map((cell, cellIndex) => (
                <input
                  id={`input-${rowIndex}-${cellIndex}`}
                  key={cellIndex}
                  maxLength={1}
                  value={cell}
                  className={`input-box ${rowIndex === currentRow && cellIndex === activeIndex ? "active-box" : ""}`}
                  style={{
                    backgroundColor: rowIndex < currentRow ? colors[rowIndex][cellIndex] : "white",
                  }}
                  disabled={rowIndex !== currentRow}
                  onChange={(e) =>
                    handleInputChange(e, rowIndex, cellIndex, rows, setRows, setActiveIndex)
                  }
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, cellIndex, rows, setRows, setActiveIndex)}
                />
              ))}
              
            </div>
            <div className="horizontal-line top-line"></div>
            <div className="horizontal-line bottom-line"></div>
            <div className="horizontal-border bottom-border"></div>
            <div className="vertical-border right-border"></div>
          </div>
        ))}
      </div>

      <div className="footer-container">
        <div className="alert-box pixel-corners-grey">{gameMessage}</div>
        <MenuBox
          checkWord={checkWord}
          resetGame={resetGame}
          setShowLoginModal={() => setActiveModal("login")}
          setShowStatsModal={() => setActiveModal("stats")}
          setShowCreditsModal={() => setActiveModal('credits')}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userScore={userScore}
        />
      </div>

      {/* Render modals conditionally based on activeModal */}
      {activeModal === "login" && (
        <LoginModal
          showLoginModal={true}
          setShowLoginModal={() => setActiveModal(null)}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {activeModal === "stats" && (
        <StatsModal
          showModal={true}
          setShowStatsModal={() => setActiveModal(null)}
          userData={mockUserData}
          currentUser="Player4"
        />
      )}
      {activeModal === "credits" && (
      <CreditsModal
        showModal={true}
        setShowCreditsModal={() => setActiveModal(null)}
        githubUsers={githubUsers}
      />
      )}
    </div>
  );
};

export default Game;
