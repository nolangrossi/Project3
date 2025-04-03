// Currently not imported. Could not work out how to separate all the necessary variables.
export const checkWord = (
    data: any,
    rows: string[][],
    currentRow: number,
    colors: string[][],
    setColors: React.Dispatch<React.SetStateAction<string[][]>>,
    setGameMessage: React.Dispatch<React.SetStateAction<string>>,
    setUserScore: React.Dispatch<React.SetStateAction<number | null>>,
    setCurrentRow: React.Dispatch<React.SetStateAction<number>>,
    setIncorrectRows: React.Dispatch<React.SetStateAction<boolean[]>>,
    incorrectRows: boolean[]
  ) => {
    if (!data || !data.getRandomPokemon) return;
  
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
      setUserScore(6 - currentRow);
      setGameMessage(`🎉 Congratulations! You won with a score of ${6 - currentRow}!`);
    } else {
      const newIncorrectRows = [...incorrectRows];
      newIncorrectRows[currentRow] = true;
      setIncorrectRows(newIncorrectRows);
  
      if (currentRow < 5) {
        setCurrentRow(currentRow + 1);
        setGameMessage("Incorrect! Try again.");
      } else {
        setGameMessage(`Game over! The word was: ${selectedPokemon.name}`);
      }
    }
  };
  