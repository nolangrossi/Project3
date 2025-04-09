import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_LEADERBOARD } from '../../utils/queries';
import '../../styles/pixelated.css';

interface StatsModalProps {
  showModal: boolean;
  setShowStatsModal: React.Dispatch<React.SetStateAction<boolean>>;
  userData?: {
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
  userData = [],
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

  // Apollo query
  const {
    data: leaderboard7Data,
    loading: loading7,
    error: error7,
  } = useQuery(GET_LEADERBOARD, {
    variables: { period: '7d' },
  });
  
  const {
    data: leaderboard30Data,
    loading: loading30,
    error: error30,
  } = useQuery(GET_LEADERBOARD, {
    variables: { period: '30d' },
  });

  const leaderboard7 = leaderboard7Data?.getLeaderboard || [];
const leaderboard30 = leaderboard30Data?.getLeaderboard || [];


  // Process current user stats
  const userStats = userData.map(user => ({
    Username: user.Username,
    SevenDayAvg: user.Scores_Last_Seven_Days.length
      ? user.Scores_Last_Seven_Days.reduce((a, b) => a + b, 0) / user.Scores_Last_Seven_Days.length
      : 0,
    ThirtyDayAvg: user.Scores_Last_Thirty_Days.length
      ? user.Scores_Last_Thirty_Days.reduce((a, b) => a + b, 0) / user.Scores_Last_Thirty_Days.length
      : 0,
    HighestToday: user.Scores_Last_Seven_Days.length
      ? user.Scores_Last_Seven_Days.slice(-1)[0] ?? 0
      : 0,
    NoScoresInLastSeven: user.Scores_Last_Seven_Days.every(score => score === 0),
  }));

  const currentUserStats = userStats.find(user => user.Username === currentUser) || null;

  if (!currentUserStats || currentUserStats.NoScoresInLastSeven) {
    return (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content pixel-corners-grey">
        <div className="horizontal-border top-border"></div>
        <div className="vertical-border left-border"></div>
          <h2>Player Stats</h2>
          <p>No scores recorded in the last seven days. Play a game to start tracking stats!</p>
          <button className="close-btn" onClick={handleClose}>► Close</button>
          <div className="horizontal-line top-line"></div>
          <div className="horizontal-line bottom-line"></div>
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
          <p>7-Day Average: {currentUserStats.SevenDayAvg.toFixed(2)}</p>
          <p>30-Day Average: {currentUserStats.ThirtyDayAvg.toFixed(2)}</p>
          <p>Highest Score Today: {currentUserStats.HighestToday}</p>

          <h3>7-Day Leaderboard</h3>
          {loading7 ? (
            <p>Loading leaderboard...</p>
          ) : error7 ? (
            <p>Error loading leaderboard.</p>
          ) : leaderboard7.length > 0 ? (
            leaderboard7.map((entry: any, index: number) => (
              <p key={index}>
                #{index + 1}: {entry.user.username} - {entry.averageScore.toFixed(2)}
              </p>
            ))
          ) : (
            <p>No scores in the last 7 days.</p>
          )}

          <h3>30-Day Leaderboard</h3>
          {leaderboard30.length > 0 ? (
            leaderboard30.map((entry: any, index: number) => (
              <p key={index}>
                #{index + 1}: {entry.user.username} - {entry.averageScore.toFixed(2)}
              </p>
            ))
          ) : (
            <p>No scores in the last 30 days.</p>
          )}

          <button className="close-btn" onClick={handleClose}>► Close</button>
          <div className="horizontal-line top-line"></div>
          <div className="horizontal-line bottom-line"></div>
          <div className="horizontal-border bottom-border"></div>
          <div className="vertical-border right-border"></div>
        </div>
      </div>
    )
  );
};

export default StatsModal;
