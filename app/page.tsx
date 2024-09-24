"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";

export default function Connect4Game() {
  const [board, setBoard] = useState<(null | "red" | "yellow")[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<"red" | "yellow">("red");
  const [winner, setWinner] = useState<"red" | "yellow" | "draw" | null>(null);

  const checkWinner = useCallback(
    (row: number, col: number, player: "red" | "yellow") => {
      const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
      ];

      for (const [dx, dy] of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
          const newRow = row + i * dx;
          const newCol = col + i * dy;
          if (
            newRow < 0 ||
            newRow >= 6 ||
            newCol < 0 ||
            newCol >= 7 ||
            board[newRow][newCol] !== player
          )
            break;
          count++;
        }
        for (let i = 1; i < 4; i++) {
          const newRow = row - i * dx;
          const newCol = col - i * dy;
          if (
            newRow < 0 ||
            newRow >= 6 ||
            newCol < 0 ||
            newCol >= 7 ||
            board[newRow][newCol] !== player
          )
            break;
          count++;
        }
        if (count >= 4) return true;
      }
      return false;
    },
    [board]
  );

  const handleClick = (col: number) => {
    if (winner) return;

    let row = -1;
    for (let i = 5; i >= 0; i--) {
      if (board[i][col] === null) {
        row = i;
        break;
      }
    }

    if (row === -1) return; // Column is full

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(row, col, currentPlayer)) {
      setWinner(currentPlayer);
    } else if (newBoard.every((row) => row.every((cell) => cell !== null))) {
      setWinner("draw");
    } else {
      setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");
    }
  };

  const resetGame = () => {
    setBoard(
      Array(6)
        .fill(null)
        .map(() => Array(7).fill(null))
    );
    setCurrentPlayer("red");
    setWinner(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#2C2C2C] text-[#FFD700] font-mono">
      <nav className="flex justify-between items-center p-4 bg-[#1C1C1C]">
        <h1 className="text-2xl font-bold tracking-wide">CONNECT 4</h1>
        <button
          onClick={resetGame}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center text-sm sm:text-base"
        >
          ABORT GAME <X className="ml-2" size={20} />
        </button>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-[80vh] aspect-square bg-[#FFD700] p-2 sm:p-4 rounded-lg shadow-lg">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex h-1/6">
              {row.map((cell, colIndex) => (
                <button
                  key={colIndex}
                  className="lg:mt-5 lg:ml-5 w-16 h-10 mt-3 lg:w-16 lg:h-16 bg-[#2C2C2C] rounded-full m-[2%] focus:outline-none"
                  onClick={() => handleClick(colIndex)}
                  disabled={!!winner}
                >
                  {cell && (
                    <div
                      className={`w-[80%] h-[80%] rounded-full m-auto ${
                        cell === "red" ? "bg-red-500" : "bg-blue-800"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 flex justify-between items-center bg-[#1C1C1C]">
        <div className="text-xl">
          {winner
            ? winner === "draw"
              ? "IT'S A DRAW!"
              : `PLAYER ${winner.toUpperCase()} WINS!`
            : "YOUR TURN"}
        </div>
        {!winner && (
          <div
            className={`w-4 h-4 rounded-full ${
              currentPlayer === "red" ? "bg-red-500" : "bg-blue-800"
            }`}
          />
        )}
      </footer>
    </div>
  );
}
