import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

// Queries & Mutations
import { GETRANDOMPOKEMON, GET_USER_STATS } from "../utils/queries";
import { TRACK_USER_STATS } from "../utils/mutations";

// Handlers
import { handleInputChange } from "./functions/inputNavigation";
import { handleKeyDown } from "./functions/keyboardNavigation";

// Components
import MenuBox from "./MenuBox";
import InstructionsModal from "./modals/InstructionsModal";
import LoginModal from "./modals/LoginModal";
import StatsModal from "./modals/StatsModal";
import CreditsModal from "./modals/CreditsModal";

// Styles
import "../styles/game.css";
import "../styles/pixelated.css";

const Game: React.FC = () => {
  const { data: userStatsData } = useQuery(GET_USER_STATS);
  const { data, loading, error, refetch } = useQuery(GETRANDOMPOKEMON);
  const [trackUserStats] = useMutation(TRACK_USER_STATS);

  const [rows, setRows] = useState<string[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [colors, setColors] = useState<string[][]>([]);
  const [gameMessage, setGameMessage] = useState<string>("");
  const [incorrectRows, setIncorrectRows] = useState<boolean[]>(Array(6).fill(false));
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [activeModal, setActiveModal] = useState<"login" | "stats" | "credits" | "instruct" | null>(null);


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

  useEffect(() => {
    if (data && data.getRandomPokemon) {
      const selectedPokemon = data.getRandomPokemon;

      const sanitizedPokemonName = selectedPokemon.name.replace(/[^a-zA-Z]/g, "");

      setRows(Array(6).fill("").map(() => Array(sanitizedPokemonName.length).fill("")));
      setColors(Array(6).fill("").map(() => Array(sanitizedPokemonName.length).fill("")));

      setHints(selectedPokemon.typing);
      setGameMessage(`Guess the Pokémon!`);
    }
  }, [data]);


  const resetGame = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (data?.getRandomPokemon) {
      const selected = data.getRandomPokemon;
      const sanitized = selected.name.replace(/[^a-zA-Z]/g, "");

      setRows(Array(6).fill("").map(() => Array(sanitized.length).fill("")));
      setColors(Array(6).fill("").map(() => Array(sanitized.length).fill("")));
      setHints(selected.typing);
      setGameMessage("Guess the Pokémon!");
    }
  }, [data]);

  const checkWord = async () => {
    if (!data?.getRandomPokemon) return;

    const selected = data.getRandomPokemon;
    const answer = selected.name.replace(/[^a-zA-Z]/g, "").toLowerCase();
    const guess = rows[currentRow].join("").toLowerCase();

    if (guess.length !== answer.length) {
      setGameMessage("Please fill all boxes.");
      return;
    }

    const newColors = [...colors];
    let isCorrect = true;

    guess.split("").forEach((letter, i) => {
      if (letter === answer[i]) {
        newColors[currentRow][i] = "green";
      } else if (answer.includes(letter)) {
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
      try {
        await trackUserStats({ variables: { score: finalScore } });
      } catch (err) {
        console.error("Error tracking score:", err);
      }
      setUserScore(finalScore);
      setGameMessage(`🎉 Congratulations! You won with a score of ${finalScore}!`);
    } else {
      const updatedIncorrect = [...incorrectRows];
      updatedIncorrect[currentRow] = true;
      setIncorrectRows(updatedIncorrect);

      if (currentRow < 5) {
        setCurrentRow(currentRow + 1);
        setActiveIndex(0);
        setGameMessage("Incorrect! Try again.");
      } else {
        setGameMessage(`Game over! The Pokémon was: ${answer}`);
      }
    }
  };

  if (loading) return <div className="game-container"><h1>Loading...</h1></div>;
  if (error) return <div className="game-container"><h1>Error loading Pokémon data.</h1></div>;

  return (
    <div className="game-container">

      <h1>Wordémon</h1>


      <div className="grid-container">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`word-card ${rowIndex === currentRow ? "pixel-corners-red" : "pixel-corners-blue"}`}
          >
            <div className="horizontal-border top-border"></div>
            <div className="vertical-border left-border"></div>
{/* Display type hints for rows 1-3 */}
            {rowIndex >= 1 && rowIndex <= 3 && incorrectRows[rowIndex - 1] && hints[rowIndex - 1] && (
              <div className="types-container">
                <img
                  src={`/assets/types/${hints[rowIndex - 1].toLowerCase()}.svg`}
                  alt={hints[rowIndex - 1]}
                  className="type-icon"
                />
              </div>
            )}

            {/* Display generation hint for the 4th guess */}
            {rowIndex === 3 && incorrectRows[2] && data?.getRandomPokemon?.generation && (
              <div className="generation-hint">
                <p>Generation: {data.getRandomPokemon.generation}</p>
              </div>
            )}

            {/* Display Pokémon image as the final hint */}
            {rowIndex === 5 && incorrectRows[4] && data?.getRandomPokemon?.id && (
              <div className="pokemon-image-container">
                <img
                  src={`/assets/pokedex/${data.getRandomPokemon.id}.png`}
                  alt={data.getRandomPokemon.name}
                  className="pokemon-image"
                />
              </div>
            )}

            {/* Input fields */}
            <div className="input-row">
              {row.map((cell, cellIndex) => (
                <input
                  key={cellIndex}
                  id={`input-${rowIndex}-${cellIndex}`}
                  maxLength={1}
                  value={cell}
                  className={`input-box ${rowIndex === currentRow && cellIndex === activeIndex ? "active-box" : ""}`}
                  style={{
                    backgroundColor: colors[rowIndex]?.[cellIndex] || "white",
                  }}
                  disabled={rowIndex !== currentRow}
                  onChange={(e) =>
                    handleInputChange(e, rowIndex, cellIndex, rows, setRows, setActiveIndex)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, rowIndex, cellIndex, rows, setRows, setActiveIndex)
                  }
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
          setShowInstructionsModal={() => setActiveModal('instruct')}
          setShowLoginModal={() => setActiveModal("login")}
          setShowStatsModal={() => setActiveModal("stats")}
          setShowCreditsModal={() => setActiveModal("credits")}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userScore={userScore}
        />
      </div>


      {activeModal === "login" && (
        <LoginModal
        showLoginModal={true}
        setShowLoginModal={() => setActiveModal(null)}
        setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {activeModal === "instruct" && (
        <InstructionsModal
          showInstructionsModal={true}
          setShowInstructionsModal={() => setActiveModal(null)} // Properly close the modal
        />
      )}

      {activeModal === "stats" && (
        <StatsModal
          showModal={true}
          setShowStatsModal={() => setActiveModal(null)}
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
          currentUser={userStatsData?.getUserStats?.user?.username || "Guest"}
        />
      )}

      {activeModal === "instruct" && (
        <InstructionsModal
          showInstructionsModal={true}
          setShowInstructionsModal={() => setActiveModal(null)}
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
