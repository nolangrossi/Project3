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
}

const StatsModal: React.FC<StatsModalProps> = ({
  showModal,
  setShowStatsModal,
  userData,
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

  const userStats = userData.map(user => ({
    Username: user.Username,
    SevenDayAvg: user.Scores_Last_Seven_Days.reduce((a, b) => a + b, 0) / 7,
    ThirtyDayAvg: user.Scores_Last_Thirty_Days.reduce((a, b) => a + b, 0) / 30,
    HighestToday: user.Scores_Last_Seven_Days[user.Scores_Last_Seven_Days.length - 1],
    NoScoresInLastSeven: user.Scores_Last_Seven_Days.every(score => score === 0),
  }));

  // Sorting users by 7-day average for leaderboard
  const sortedUserStats = userStats.sort((a, b) => b.SevenDayAvg - a.SevenDayAvg);

  const currentUserIndex = sortedUserStats.findIndex(user => user.Username === currentUser);
  const currentUserStats = sortedUserStats[currentUserIndex];

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
          <p># {currentUserIndex > 0 ? `${currentUserIndex}: ${sortedUserStats[currentUserIndex - 1]?.Username}` : 'N/A'}</p>
          <p># {currentUserIndex}: {currentUserStats?.Username}</p>
          <p># {currentUserIndex < sortedUserStats.length - 1 ? `${currentUserIndex + 1}: ${sortedUserStats[currentUserIndex + 1]?.Username}` : 'N/A'}</p>
          <h3>30-Day Leaderboard</h3>
          <p>#1: {sortedUserStats[0]?.Username} - {sortedUserStats[0]?.ThirtyDayAvg.toFixed(2)}</p>
          <p>#2: {sortedUserStats[1]?.Username} - {sortedUserStats[1]?.ThirtyDayAvg.toFixed(2)}</p>
          <p>#3: {sortedUserStats[2]?.Username} - {sortedUserStats[2]?.ThirtyDayAvg.toFixed(2)}</p>
          <button className="close-btn" onClick={handleClose}>► Close</button>
          <div className="horizontal-border bottom-border"></div>
          <div className="vertical-border right-border"></div>
        </div>
      </div>
    )
  );
};

export default StatsModal;
