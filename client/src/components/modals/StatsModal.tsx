import React, { useEffect } from 'react';
import '../../styles/pixelated.css';

interface StatsModalProps {
  showModal: boolean;
  setShowStatsModal: React.Dispatch<React.SetStateAction<boolean>>;
  userData?: {
    UserID: string;
    Username: string;
    Scores_Last_Seven_Days: number[];
    Scores_Last_Thirty_Days: number[];
  } [];
  currentUser: string;
}

const StatsModal: React.FC<StatsModalProps> = ({
  showModal,
  setShowStatsModal,
  userData = [], // Default empty array to prevent errors
  currentUser,
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

  // Ensure userData is available
  if (!userData || userData.length === 0) {
    return (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
          <h2>Player Stats</h2>
          <p>Stats are currently unavailable. Try again later.</p>
          <button className="close-btn" onClick={handleClose}>► Close</button>
        </div>
      </div>
    );
  }

  const userStats = userData.map(user => ({
    Username: user.Username,
    SevenDayAvg: user.Scores_Last_Seven_Days.length
      ? user.Scores_Last_Seven_Days.reduce((a, b) => a + b, 0) / user.Scores_Last_Seven_Days.length
      : 0,
    ThirtyDayAvg: user.Scores_Last_Thirty_Days.length
      ? user.Scores_Last_Thirty_Days.reduce((a, b) => a + b, 0) / user.Scores_Last_Thirty_Days.length
      : 0,
    HighestToday: user.Scores_Last_Seven_Days.length
      ? Math.max(...user.Scores_Last_Seven_Days.slice(-1)) // assuming last score is "today"
      : 0,
    NoScoresInLastSeven: user.Scores_Last_Seven_Days.every(score => score === 0),
  }));
  
  // Sorting users by 7-day average for leaderboard
  const sortedUserStats = [...userStats].sort((a, b) => b.SevenDayAvg - a.SevenDayAvg);

  // Find the current user in the sorted stats
  const currentUserIndex = sortedUserStats.findIndex(user => user.Username === currentUser);
  const currentUserStats = sortedUserStats[currentUserIndex] || null; // Prevent undefined errors

  if (!currentUserStats || currentUserStats.NoScoresInLastSeven) {
    return (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
          <h2>Player Stats</h2>
          <p>No scores recorded in the last seven days. Play a game to start tracking stats!</p>
          <button className="close-btn" onClick={handleClose}>► Close</button>
        </div>
      </div>
    );
  }

  return (
    showModal && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
          <h2>Player Stats</h2>
          <p>7-Day Average: {currentUserStats.SevenDayAvg.toFixed(2)}</p>
          <p>30-Day Average: {currentUserStats.ThirtyDayAvg.toFixed(2)}</p>
          <p>Highest Score Today: {currentUserStats.HighestToday}</p>

          <h3>7-Day Rankings</h3>
          {currentUserIndex > 0 && (
            <p># {currentUserIndex}: {sortedUserStats[currentUserIndex - 1]?.Username}</p>
          )}
          <p># {currentUserIndex + 1}: {currentUserStats.Username}</p>
          {currentUserIndex < sortedUserStats.length - 1 && (
            <p># {currentUserIndex + 2}: {sortedUserStats[currentUserIndex + 1]?.Username}</p>
          )}

          <h3>30-Day Leaderboard</h3>
          {sortedUserStats.slice(0, 3).map((user, index) => (
            <p key={index}>#{index + 1}: {user.Username} - {user.ThirtyDayAvg.toFixed(2)}</p>
          ))}

          <button className="close-btn" onClick={handleClose}>► Close</button>
        </div>
      </div>
    )
  );
};

export default StatsModal;
