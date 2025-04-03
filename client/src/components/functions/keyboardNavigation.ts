export const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    cellIndex: number,
    rows: string[][],
    setRows: React.Dispatch<React.SetStateAction<string[][]>>,
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "ArrowRight" && cellIndex < rows[0].length - 1) {
      setActiveIndex(cellIndex + 1);
      setTimeout(() => {
        document.getElementById(`input-${rowIndex}-${cellIndex + 1}`)?.focus();
      }, 50);
    } else if (e.key === "ArrowLeft" && cellIndex > 0) {
      setActiveIndex(cellIndex - 1);
      setTimeout(() => {
        document.getElementById(`input-${rowIndex}-${cellIndex - 1}`)?.focus();
      }, 50);
    } else if (e.key === "Backspace" && !target.value) {
      // Clear current cell and move focus to previous cell
      const newRows = [...rows];
      newRows[rowIndex][cellIndex] = ""; // Clear the current cell
      setRows(newRows);
  
      if (cellIndex > 0) {
        setActiveIndex(cellIndex - 1);
        setTimeout(() => {
          document.getElementById(`input-${rowIndex}-${cellIndex - 1}`)?.focus();
        }, 50);
      }
    } else if (e.key === "Enter") {
      // checkWord();
    }
  };
  