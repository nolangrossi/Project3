// Bug 1: Currently facing an issue where all methods of closing the window do not work.
// Not sure why this is the case. handleClose and/or the useEffect should handle this
// Think about moving these functions into a seperate file to be invoked on all the modals. Same code.

// While I've tested this with MockData, and the username can be set (in the GameComponent Dom)
// This needs to be tested with real logged in data to get the log in status
// (Currently no login data it seems) This should be retrieving that + the Username
// Currently all the LoggedIn properties are bypassed in the commented code (Here and GameComponent.tsx)

//Bug 2: Array for 7-Week rankings seems to be calculating incorrectly...

// 
// Please look at mockStats.ts for what this document is looking for.
//
import React, { useEffect } from 'react';
import '../../styles/pixelated.css';

interface StatsModalProps {
  showModal: boolean;
  setShowStatsModal: React.Dispatch<React.SetStateAction<boolean>>;
  userData: {
    UserID: string;
    Username: string;
    Scores_Last_Seven_Days: number[];
    Scores_Last_Thirty_Days: number[];
  }[];
  currentUser: string;
  // isLoggedIn: boolean;
}

const StatsModal: React.FC<StatsModalProps> = ({
  showModal,
  setShowStatsModal,
  userData,
  currentUser,
  // isLoggedIn,
}) => {
  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowStatsModal(false);
    }
  };

  const handleClose = () => {
    setShowStatsModal(false);
  };

  useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowStatsModal(false);
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
      };
    }, [setShowStatsModal]);

  const userStats = userData.map(user => ({
    Username: user.Username,
    SevenDayAvg: user.Scores_Last_Seven_Days.reduce((a, b) => a + b, 0) / 7,
    ThirtyDayAvg: user.Scores_Last_Thirty_Days.reduce((a, b) => a + b, 0) / 30,
    HighestToday: user.Scores_Last_Seven_Days[user.Scores_Last_Seven_Days.length - 1],
    // Checks to see if scores in last seven days is equal to 0, signifying the player hasn't played.
    NoScoresInLastSeven: user.Scores_Last_Seven_Days.every(score => score === 0),
  })).sort((a, b) => b.SevenDayAvg - a.SevenDayAvg);

  const currentUserIndex = userStats.findIndex(user => user.Username === currentUser);
  const currentUserStats = userStats[currentUserIndex];

  // if (!isLoggedIn) {
  //   return (
  //     <div className="modal" onClick={closeModal}>
  //       <div className="modal-content pixel-corners-grey">
  //         <div className="horizontal-border top-border"></div>
  //         <div className="vertical-border left-border"></div>
  //         <h2>Player Stats</h2>
  //         <p>Please Log In or Sign Up to see your stats</p>
  //         <button className="close-btn" onClick={handleClose}>► Close</button>
  //         <div className="horizontal-border bottom-border"></div>
  //         <div className="vertical-border right-border"></div>
  //       </div>
  //     </div>
  //   );
  // }

  if (currentUserStats?.NoScoresInLastSeven) {
    return (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
          <div className="horizontal-border top-border"></div>
          <div className="vertical-border left-border"></div>
          <h2>Player Stats</h2>
          <p>No word guessed correctly in the last seven days. Please complete a game to start your stats.</p>
          <button className="close-btn" onClick={handleClose}>► Close</button>
          <div className="horizontal-border bottom-border"></div>
          <div className="vertical-border right-border"></div>
        </div>
      </div>
    );
  }

  return (
    showModal && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
          <div className="horizontal-border top-border"></div>
          <div className="vertical-border left-border"></div>
          <h2>Player Stats</h2>
          <p>7-Day Average: {currentUserStats?.SevenDayAvg.toFixed(2)}</p>
          <p>30-Day Average: {currentUserStats?.ThirtyDayAvg.toFixed(2)}</p>
          <p>Highest Score Today: {currentUserStats?.HighestToday}</p>
          <h3>7-Week Rankings</h3>
          <p># {currentUserIndex > 0 ? `${currentUserIndex}: ${userStats[currentUserIndex - 1]?.Username}` : 'N/A'}</p>
          <p># {currentUserIndex}: {currentUserStats?.Username}</p>
          <p># {currentUserIndex < userStats.length - 1 ? `${currentUserIndex + 1}: ${userStats[currentUserIndex + 1]?.Username}` : 'N/A'}</p>
          <button className="close-btn" onClick={handleClose}>► Close</button>
          <div className="horizontal-border bottom-border"></div>
          <div className="vertical-border right-border"></div>
        </div>
      </div>
    )
  );
};

export default StatsModal;
