import React, { useState, useEffect } from "react";
import { getRandomWord } from "./functions/wordSelector";
import "../styles/game.css";
import "../styles/pixelated.css";

const Game: React.FC = () => {
  const [selectedWord, _setSelectedWord] = useState(() => getRandomWord());

  const [rows, setRows] = useState<string[][]>(
    Array(6).fill("").map(() => Array(selectedWord.name.length).fill(""))
  );

  const [currentRow, setCurrentRow] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [colors, setColors] = useState<string[][]>(
    Array(6).fill("").map(() => Array(selectedWord.name.length).fill(""))
  );
  const [gameMessage, setGameMessage] = useState<string>("");
  const [incorrectRows, setIncorrectRows] = useState<boolean[]>(Array(6).fill(false));

  useEffect(() => {
    // Display hint only if the previous row was incorrect
    if (currentRow >= 2 && incorrectRows[currentRow - 1]) {
      const hintKey = `hintValue${currentRow - 1}` as keyof typeof selectedWord;
      if (selectedWord[hintKey]) {
        setHints((prev) => [...prev, selectedWord[hintKey] as string]);
      }
    }
  }, [currentRow, selectedWord, incorrectRows]);

  const checkWord = () => {
    const guess = rows[currentRow].join("").toLowerCase();
    if (guess.length !== selectedWord.name.length) {
      setGameMessage("Please fill all boxes.");
      return;
    }

    const newColors = [...colors];
    const wordArr = selectedWord.name.toLowerCase().split("");
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
        setGameMessage(`Game over! The word was: ${selectedWord.name}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, cellIndex: number) => {
    if (e.key === "ArrowRight" && cellIndex < selectedWord.name.length - 1) {
      setActiveIndex(cellIndex + 1);
    } else if (e.key === "ArrowLeft" && cellIndex > 0) {
      setActiveIndex(cellIndex - 1);
    } else if (e.key === "Enter") {
      checkWord();
    }
  };

  return (
    <div className="game-container">
      <h1>Pokemon Word Guess Game</h1>

      {/* Grid Layout for Word Cards */}
      <div className="grid-container">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="word-card pixel-corners-blue">
            {/* Only show hint if the previous row was incorrect */}
            {rowIndex >= 1 && rowIndex <= 3 && incorrectRows[rowIndex - 1] && hints[rowIndex - 1] && (
              <span className="hint-label">Hint: {hints[rowIndex - 1]}</span>
            )}

            {/* Make inputs spread out horizontally */}
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
                      if (cellIndex < selectedWord.name.length - 1) {
                        setActiveIndex(cellIndex + 1);
                      }
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, cellIndex)}
                />
              ))}
            </div>

            {/* Image hints should appear on Card 5 and Card 6 in the top right */}
            {rowIndex === 4 || rowIndex === 5 ? (
              <div className="image-placeholder"></div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Submit and Alerts */}
      <div className="footer-container">
        <div className="alert-box pixel-corners-grey">{gameMessage}</div>
        <div className="menu-box pixel-corners-red">
        <button className="submit-button" onClick={checkWord}>
          Submit
        </button>
        </div>
      </div>

      {userScore !== null && <h2>Final Score: {userScore}</h2>}
    </div>
  );
};

export default Game;
