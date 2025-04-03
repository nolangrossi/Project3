export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  rowIndex: number,
  cellIndex: number,
  rows: string[][],
  setRows: React.Dispatch<React.SetStateAction<string[][]>>,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  if (rowIndex === undefined) return;

  const newRows = rows.map((r) => [...r]);
  newRows[rowIndex][cellIndex] = e.target.value.toUpperCase();
  setRows(newRows);

  // Move focus to the next input box if available
  if (e.target.value && cellIndex < rows[rowIndex].length - 1) {
    setActiveIndex(cellIndex + 1);

    setTimeout(() => {
      const nextInput = document.getElementById(`input-${rowIndex}-${cellIndex + 1}`);
      if (nextInput) nextInput.focus();
    }, 50); // Small delay to ensure state updates before focusing
  }
};
