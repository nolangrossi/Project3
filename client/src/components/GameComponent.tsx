import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GETRANDOMPOKEMON } from "../utils/queries";
import MenuBox from "./MenuBox";
import LoginModal from "./LoginModal";
import "../styles/game.css";
import "../styles/pixelated.css";

const Game: React.FC = () => {
  // Fetch random Pokémon using the GraphQL query
  const { data, loading, error } = useQuery(GETRANDOMPOKEMON);

  // State for the game
  const [rows, setRows] = useState<string[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [colors, setColors] = useState<string[][]>([]);
  const [gameMessage, setGameMessage] = useState<string>("");
  const [incorrectRows, setIncorrectRows] = useState<boolean[]>(Array(6).fill(false));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowLoginModal] = useState(false);

  // Initialize the game when the Pokémon data is loaded
  useEffect(() => {
    if (data && data.getRandomPokemon) {
      const selectedPokemon = data.getRandomPokemon;

      // Initialize rows and colors based on the Pokémon name length
      setRows(Array(6).fill("").map(() => Array(selectedPokemon.name.length).fill("")));
      setColors(Array(6).fill("").map(() => Array(selectedPokemon.name.length).fill("")));
    }
  }, [data]);

  const checkWord = () => {
    if (!data || !data.getRandomPokemon) return;

    const selectedPokemon = data.getRandomPokemon;
    const guess = rows[currentRow].join("").toLowerCase();

    if (guess.length !== selectedPokemon.name.length) {
      setGameMessage("Please fill all boxes.");
      return;
    }

    const newColors = [...colors];
    const wordArr = selectedPokemon.name.toLowerCase().split("");
    const guessArr = guess.split("");
    let isCorrect = true;

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

    setColors(newColors);

    if (isCorrect) {
      setUserScore(6 - currentRow);
      setGameMessage(`🎉 Congratulations! You won with a score of ${6 - currentRow}!`);
    } else {
      const newIncorrectRows = [...incorrectRows];
      newIncorrectRows[currentRow] = true;
      setIncorrectRows(newIncorrectRows);

      if (currentRow < 5) {
        setCurrentRow(currentRow + 1);
        setActiveIndex(0);
        setGameMessage("Incorrect! Try again.");
      } else {
        setGameMessage(`Game over! The word was: ${selectedPokemon.name}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, cellIndex: number) => {
    if (e.key === "ArrowRight" && cellIndex < rows[0].length - 1) {
      setActiveIndex(cellIndex + 1);
    } else if (e.key === "ArrowLeft" && cellIndex > 0) {
      setActiveIndex(cellIndex - 1);
    } else if (e.key === "Enter") {
      checkWord();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading Pokémon data.</div>;

  return (
    <div className="game-container">
      <h1>Pokemon Word Guess Game</h1>

      <div className="grid-container">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="word-card pixel-corners-blue">
            {rowIndex >= 1 && rowIndex <= 3 && incorrectRows[rowIndex - 1] && hints[rowIndex - 1] && (
              <span className="hint-label">Hint: {hints[rowIndex - 1]}</span>
            )}

            <div className="input-row">
              {row.map((cell, cellIndex) => (
                <input
                  key={cellIndex}
                  maxLength={1}
                  value={cell}
                  className={`input-box ${rowIndex === currentRow && cellIndex === activeIndex ? "active-box" : ""}`}
                  style={{
                    backgroundColor: rowIndex < currentRow ? colors[rowIndex][cellIndex] : "white",
                  }}
                  disabled={rowIndex !== currentRow}
                  onChange={(e) => {
                    if (rowIndex === currentRow) {
                      const newRows = rows.map((r, _i) => [...r]);
                      newRows[rowIndex][cellIndex] = e.target.value.toUpperCase();
                      setRows(newRows);
                      if (cellIndex < rows[0].length - 1) {
                        setActiveIndex(cellIndex + 1);
                      }
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, cellIndex)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="footer-container">
        <div className="alert-box pixel-corners-grey">{gameMessage}</div>
        <MenuBox
          checkWord={checkWord}
          setShowLoginModal={setShowLoginModal}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      </div>

      {userScore !== null && <h2>Final Score: {userScore}</h2>}

      {showModal && (
        <LoginModal
          showModal={showModal}
          setShowLoginModal={setShowLoginModal}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </div>
  );
};

export default Game;
