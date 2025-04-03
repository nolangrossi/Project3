export const mockUserData = [
    {
      UserID: "1",
      Username: "Player1",
      Scores_Last_Seven_Days: [3, 4, 2, 6, 5, 3, 4],
      Scores_Last_Thirty_Days: Array.from({ length: 30 }, () => Math.floor(Math.random() * 7)),
    },
    {
      UserID: "2",
      Username: "Player2",
      Scores_Last_Seven_Days: [5, 6, 6, 3, 2, 4, 5],
      Scores_Last_Thirty_Days: Array.from({ length: 30 }, () => Math.floor(Math.random() * 7)),
    },
    {
      UserID: "3",
      Username: "Player3",
      Scores_Last_Seven_Days: [2, 3, 4, 5, 6, 2, 1],
      Scores_Last_Thirty_Days: Array.from({ length: 30 }, () => Math.floor(Math.random() * 7)),
    },
    {
      UserID: "4",
      Username: "Player4",
      Scores_Last_Seven_Days: [6, 6, 6, 5, 4, 3, 2],
      Scores_Last_Thirty_Days: Array.from({ length: 30 }, () => Math.floor(Math.random() * 7)),
    },
  ];
  