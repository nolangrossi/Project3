// Dependencies
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

// Functions
import { GETRANDOMPOKEMON, GET_USER_STATS } from "../utils/queries";
import { TRACK_USER_STATS } from "../utils/mutations";
import { handleInputChange } from "./functions/inputNavigation";
import { handleKeyDown } from "./functions/keyboardNavigation";

// Components
import MenuBox from "./MenuBox";
import LoginModal from "./modals/LoginModal";
import StatsModal from "./modals/StatsModal";
import InstructionsModal from "./modals/InstructionsModal";

// Styles
import "../styles/game.css";
import "../styles/pixelated.css";

const Game: React.FC = () => {
  // Fetch Pokémon and User Stats
  const { data, loading, error } = useQuery(GETRANDOMPOKEMON);
  const { data: userStatsData } = useQuery(GET_USER_STATS);

  // Mutation to track stats
  const [trackUserStats] = useMutation(TRACK_USER_STATS);

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Initialize the game when Pokémon data loads
  useEffect(() => {
    if (data?.getRandomPokemon) {
      const selectedPokemon = data.getRandomPokemon;
      setRows(Array(6).fill("").map(() => Array(selectedPokemon.name.length).fill("")));
      setColors(Array(6).fill("").map(() => Array(selectedPokemon.name.length).fill("")));
    }
  }, [data]);

  // Check word and update score
  const checkWord = async () => {
    if (!data?.getRandomPokemon) return;

    const selectedPokemon = data.getRandomPokemon;
    const guess = rows[currentRow].join("").toLowerCase();

    if (guess.length !== selectedPokemon.name.length) {
      setGameMessage("Please fill all boxes.");
      return;
    }

    const wordArr = selectedPokemon.name.toLowerCase().split("");
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

    setColors(newColors);

    if (isCorrect) {
      const finalScore = 6 - currentRow;
      setUserScore(finalScore);
      setGameMessage(`🎉 Congratulations! You won with a score of ${finalScore}!`);

      // Send score to backend
      try {
        await trackUserStats({
          variables: { score: finalScore },
        });
        console.log("Score successfully tracked!");
      } catch (err) {
        console.error("Error tracking score:", err);
      }
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

  console.log("userStatsData", JSON.stringify(userStatsData, null, 2));

  if (loading)
    return (
      <div className="game-container">
        <h1>Loading...</h1>
      </div>
    );
  if (error)
    return (
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
            {rowIndex >= 1 && rowIndex <= 3 && incorrectRows[rowIndex - 1] && hints[rowIndex - 1] && (
              <span className="hint-label">Hint: {hints[rowIndex - 1]}</span>
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
          setShowLoginModal={setShowLoginModal}
          setShowStatsModal={setShowStatsModal}
          setShowInstructionsModal={setShowInstructionsModal}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      </div>

      {userScore !== null && <h2>Final Score: {userScore}</h2>}

      {showLoginModal && (
        <LoginModal
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
{showStatsModal && (
  <StatsModal
    showModal={true}
    setShowStatsModal={setShowStatsModal}
    userData={
      userStatsData?.getUserStats
        ? [
            {
              UserID: userStatsData.getUserStats.user._id,
              Username: userStatsData.getUserStats.user.username,
              Scores_Last_Seven_Days: userStatsData.getUserStats.scores_last_7_days,
              Scores_Last_Thirty_Days: userStatsData.getUserStats.scores_last_30_days,
            },
          ]
        : []
    }
    currentUser={userStatsData?.getUserStats?.user?.username || 'Guest'}
  />
)}


      {showInstructionsModal && (
        <InstructionsModal
          showInstructionsModal={showInstructionsModal}
          setShowInstructionsModal={setShowInstructionsModal}
        />
      )}
    </div>
  );
};

export default Game;
