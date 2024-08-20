import React, { useEffect, useState } from 'react';
import '../App.css';
import { Assign } from '../lib/Assign';

interface AgentPosition {
  x: number;
  y: number;
}

const WumpusGame: React.FC = () => {
  const [agentPosition, setAgentPosition] = useState<AgentPosition>({ x: 1, y: 1 });
  const [cellContent, setCellContent] = useState<{ [key: string]: string }>({});
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());

  const changeAgentImg = (direction: string) => {
    const agentImg = document.getElementById('agentImg') as HTMLImageElement;
    switch (direction) {
      case 'up':
        agentImg.src = "/assets/agent-up.png";
        break;
      case 'down':
        agentImg.src = "/assets/agent-down.png";
        break;
      case 'left':
        agentImg.src = "/assets/agent-left.png";
        break;
      case 'right':
        agentImg.src = "/assets/agent-right.png";
        break;
      default:
        return;
    }
  };

  const moveAgent = (direction: string) => {
    let newX = agentPosition.x;
    let newY = agentPosition.y;

    switch (direction) {
      case 'up':
        if (newY < 6) newY++;
        break;
      case 'down':
        if (newY > 1) newY--;
        break;
      case 'left':
        if (newX > 1) newX--;
        break;
      case 'right':
        if (newX < 9) newX++;
        break;
      default:
        return; // Invalid direction
    }

    setAgentPosition({ x: newX, y: newY });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    switch (event.key) {
      case 'ArrowUp':
        moveAgent('up');
        changeAgentImg('up');
        break;
      case 'ArrowDown':
        moveAgent('down');
        changeAgentImg('down');
        break;
      case 'ArrowLeft':
        moveAgent('left');
        changeAgentImg('left');
        break;
      case 'ArrowRight':
        moveAgent('right');
        changeAgentImg('right');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [agentPosition]);

  useEffect(() => {
    // Generate the grid and assign Wumpus/Pits
    Assign('table');
    updateCellContent();
  }, []);

  const updateCellContent = () => {
    const table = document.getElementById('table') as HTMLDivElement;
    if (table) {
      const cells = Array.from(table.getElementsByTagName('div')) as HTMLDivElement[];
      const newCellContent: { [key: string]: string } = {};

      cells.forEach(cell => {
        const id = cell.id;
        if (id) {
          newCellContent[id] = cell.dataset.type || ''; // Store cell content for logic
        }
      });

      setCellContent(newCellContent);
    }
  };

  useEffect(() => {
    const currentCellId = `${agentPosition.x}-${agentPosition.y}`;
    const currentCellContent = cellContent[currentCellId];
    if (currentCellContent) {
      // Add the current cell to visited cells if it's not already there
      setVisitedCells(prevVisited => new Set(prevVisited.add(currentCellId)));

      if (currentCellContent.includes('wumpus')) {
        alert('You encountered the Wumpus!');
        // Add logic for encountering the Wumpus
      } else if (currentCellContent.includes('pit')) {
        alert('You fell into a pit!');
        // Add logic for encountering the Pit
      }
    }
  }, [agentPosition, cellContent]);

  const renderGrid = () => {
    const rows = 6;
    const cols = 9;
    let cells = [];

    for (let y = rows; y >= 1; y--) {
      for (let x = 1; x <= cols; x++) {
        const isAgent = x === agentPosition.x && y === agentPosition.y;
        const id = `${x}-${y}`;
        const content = cellContent[id] || '';
        const isVisited = visitedCells.has(id);
        const bgColor = isVisited ? 'bg-white-200' : 'bg-slate-300';

        cells.push(
          <div
            key={id}
            className={`border font-bold border-black ${bgColor}`}
            id={id}
          >
            {isAgent ? (
              <div className="w-full flex justify-center items-center" id="agent">
                <img src="/assets/agent-right.png" className="w-14" id="agentImg" alt="Agent" />
              </div>
            ) : (
              `${x},${y}`
            )}
            {isVisited && (
              <div>
                {content.includes('stench') && <div className="text-red-500 ml-[50%]">Stench</div>}
                {content.includes('breeze') && <div className="text-blue-500 ml-[50%]">Breeze</div>}
              </div>
            )}
          </div>
        );
      }
    }

    return cells;
  };

  return (
    <div className="flex flex-col w-full h-[100vh] justify-center items-center bg-slate-200">
      <div className="w-full border-black border-2 h-[75%] grid grid-cols-9" id="table">
        {renderGrid()}
      </div>
    </div>
  );
};

export default WumpusGame;
