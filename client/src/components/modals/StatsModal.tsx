import React from 'react';
import BaseModal from './BaseModal';

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
  const userStats = userData.map(user => ({
    Username: user.Username,
    SevenDayAvg: user.Scores_Last_Seven_Days.reduce((a, b) => a + b, 0) / 7,
    ThirtyDayAvg: user.Scores_Last_Thirty_Days.reduce((a, b) => a + b, 0) / 30,
    HighestToday: user.Scores_Last_Seven_Days[user.Scores_Last_Seven_Days.length - 1],
    NoScoresInLastSeven: user.Scores_Last_Seven_Days.every(score => score === 0),
  })).sort((a, b) => b.SevenDayAvg - a.SevenDayAvg);

  const currentUserIndex = userStats.findIndex(user => user.Username === currentUser);
  const currentUserStats = userStats[currentUserIndex];

  return (
    <BaseModal showModal={showModal} onClose={() => setShowStatsModal(false)}>
      <h2>Player Stats</h2>
      {currentUserStats?.NoScoresInLastSeven ? (
        <p>No word guessed correctly in the last seven days. Please complete a game to start your stats.</p>
      ) : (
        <>
          <p>7-Day Average: {currentUserStats?.SevenDayAvg.toFixed(2)}</p>
          <p>30-Day Average: {currentUserStats?.ThirtyDayAvg.toFixed(2)}</p>
          <p>Highest Score Today: {currentUserStats?.HighestToday}</p>
          <h3>7-Week Rankings</h3>
          <p># {currentUserIndex > 0 ? `${currentUserIndex}: ${userStats[currentUserIndex - 1]?.Username}` : 'N/A'}</p>
          <p># {currentUserIndex}: {currentUserStats?.Username}</p>
          <p># {currentUserIndex < userStats.length - 1 ? `${currentUserIndex + 1}: ${userStats[currentUserIndex + 1]?.Username}` : 'N/A'}</p>
        </>
      )}
      <button className="close-btn" onClick={() => setShowStatsModal(false)}>► Close</button>
    </BaseModal>
  );
};

export default StatsModal;
