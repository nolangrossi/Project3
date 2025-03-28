import React, { useState, useEffect } from "react";
import { words } from "../assets/tempWords/words";
import "../styles/game.css";

const Game: React.FC = () => {
  const [selectedWord, _setSelectedWord] = useState(() => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  });

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

  useEffect(() => {
    if (currentRow >= 2 && currentRow - 2 < 3) {
      const hintKey = `hintValue${currentRow - 1}` as keyof typeof selectedWord;
      if (selectedWord[hintKey]) {
        setHints((prev) => [...prev, selectedWord[hintKey] as string]);
      }
    }
  }, [currentRow, selectedWord]);

  const checkWord = () => {
    const guess = rows[currentRow].join("").toLowerCase();
    if (guess.length !== selectedWord.name.length) {
      setGameMessage("Please fill all boxes.");
      return;
    }

    const newColors = [...colors];
    const wordArr = selectedWord.name.toLowerCase().split("");
    const guessArr = guess.split("");

    guessArr.forEach((letter, i) => {
      if (letter === wordArr[i]) {
        newColors[currentRow][i] = "green";
      } else if (wordArr.includes(letter)) {
        newColors[currentRow][i] = "yellow";
      } else {
        newColors[currentRow][i] = "red";
      }
    });

    setColors(newColors);

    if (guess === selectedWord.name.toLowerCase()) {
      setUserScore(6 - currentRow);
      setGameMessage(`🎉 Congratulations! You won with a score of ${6 - currentRow}!`);
    } else if (currentRow < 5) {
      setCurrentRow(currentRow + 1);
      setActiveIndex(0);
      setGameMessage("Incorrect! Try again.");
    } else {
      setGameMessage(`Game over! The word was: ${selectedWord.name}`);
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
      <h1>Wordle Game</h1>
      
      <div className="card">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="word-row">
            {rowIndex === currentRow && <span className="arrow">►</span>}
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
        ))}

        <button className="submit-button" onClick={checkWord}>
          Submit
        </button>
        
        <div className="message-box">{gameMessage}</div>
        
        {hints.length > 0 && <h2>Hints:</h2>}
        {hints.map((hint, index) => (
          <p key={index}>{hint}</p>
        ))}
        
        {currentRow === 5 && <img src={selectedWord.image} alt="Final Hint" />}
        {userScore !== null && <h2>Final Score: {userScore}</h2>}

        <div className="card-footer"></div>
      </div>
    </div>
  );
};

export default Game;
