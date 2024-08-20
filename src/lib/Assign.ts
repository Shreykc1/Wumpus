export const Assign = (table: string) => {
    const tableCon = document.getElementById(table) as HTMLDivElement;
  
    if (tableCon) {
      // Get all child div elements within the container
      const childDivs = Array.from(tableCon.getElementsByTagName('div')) as HTMLDivElement[];
  
      // Filter out the child divs that have the ID of 'agent'
      const availableDivs = childDivs.filter(div => div.id !== 'agent');
  
      if (availableDivs.length > 0) {
        // Assign Wumpus
        let randomIndex = Math.floor(Math.random() * availableDivs.length);
        const wumpusDiv = availableDivs[randomIndex];
        wumpusDiv.dataset.type = 'wumpus';
  
        // Update the list of available divs after assigning Wumpus
        const updatedAvailableDivs = availableDivs.filter(div => div.dataset.type !== 'wumpus');
  
        // Function to get adjacent cells
        const getAdjacentCells = (div: HTMLDivElement) => {
          const allCells = Array.from(tableCon.getElementsByTagName('div')) as HTMLDivElement[];
          const cellIndex = allCells.indexOf(div);
          const rows = 6; // Number of rows
          const cols = 9; // Number of columns
          const row = Math.floor(cellIndex / cols);
          const col = cellIndex % cols;
          const adjacentIndexes: number[] = [];
  
          // Up, Down, Left, Right cells
          if (row > 0) adjacentIndexes.push(cellIndex - cols); // Up
          if (row < rows - 1) adjacentIndexes.push(cellIndex + cols); // Down
          if (col > 0) adjacentIndexes.push(cellIndex - 1); // Left
          if (col < cols - 1) adjacentIndexes.push(cellIndex + 1); // Right
  
          return adjacentIndexes.map(index => allCells[index]).filter(cell => cell);
        };
  
        // Add stench to adjacent cells of Wumpus
        getAdjacentCells(wumpusDiv).forEach(cell => {
          if (cell && cell.id !== 'agent' && !cell.dataset.type) {
            cell.dataset.type = (cell.dataset.type || '') + 'stench';
          }
        });
  
        // Assign Pit
        if (updatedAvailableDivs.length > 0) {
          randomIndex = Math.floor(Math.random() * updatedAvailableDivs.length);
          const pitDiv = updatedAvailableDivs[randomIndex];
          pitDiv.dataset.type = 'pit';
  
          // Add breeze to adjacent cells of Pit
          getAdjacentCells(pitDiv).forEach(cell => {
            if (cell && cell.id !== 'agent' && !cell.dataset.type) {
              cell.dataset.type = (cell.dataset.type || '') + 'breeze';
            }
          });
        }
      }
    } else {
      console.error(`Element with ID '${table}' not found.`);
    }
  };
  