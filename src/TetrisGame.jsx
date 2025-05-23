import React, { useEffect, useRef, useState } from "react";

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 24;
const COLORS = ["#222", "#4FC3F7", "#FFD54F", "#81C784", "#E57373", "#BA68C8", "#FF8A65", "#90CAF9"];
const SHAPES = [
  [],
  [[1, 1, 1, 1]], // I
  [[2, 2], [2, 2]], // O
  [[0, 3, 0], [3, 3, 3]], // T
  [[4, 4, 0], [0, 4, 4]], // S
  [[0, 5, 5], [5, 5, 0]], // Z
  [[6, 0, 0], [6, 6, 6]], // J
  [[0, 0, 7], [7, 7, 7]] // L
];

function randomPiece() {
  const type = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
  return { type, shape: SHAPES[type], row: 0, col: 3 };
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i])).reverse();
}

function isValid(board, piece) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const nr = piece.row + r;
        const nc = piece.col + c;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc]) return false;
      }
    }
  }
  return true;
}

function place(board, piece) {
  const newBoard = board.map(row => row.slice());
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        newBoard[piece.row + r][piece.col + c] = piece.type;
      }
    }
  }
  return newBoard;
}

function clearLines(board) {
  let cleared = 0;
  const newBoard = board.filter(row => {
    if (row.every(cell => cell)) {
      cleared++;
      return false;
    }
    return true;
  });
  while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(0));
  return { board: newBoard, cleared };
}

function TetrisGame() {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState(randomPiece());
  const [next, setNext] = useState(randomPiece());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (gameOver) return;
    const handleKey = e => {
      if (gameOver) return;
      let np = { ...piece, shape: piece.shape, row: piece.row, col: piece.col };
      if (e.key === "ArrowLeft") np.col--;
      else if (e.key === "ArrowRight") np.col++;
      else if (e.key === "ArrowDown") np.row++;
      else if (e.key === "ArrowUp") np.shape = rotate(piece.shape);
      if (isValid(board, np)) setPiece(np);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [piece, board, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    intervalRef.current = setInterval(() => {
      let np = { ...piece, row: piece.row + 1 };
      if (isValid(board, np)) {
        setPiece(np);
      } else {
        const placed = place(board, piece);
        const { board: clearedBoard, cleared } = clearLines(placed);
        setScore(s => s + cleared * 100);
        const newPiece = { ...next, row: 0, col: 3 };
        if (!isValid(clearedBoard, newPiece)) {
          setGameOver(true);
          clearInterval(intervalRef.current);
        } else {
          setBoard(clearedBoard);
          setPiece(newPiece);
          setNext(randomPiece());
        }
      }
    }, 400);
    return () => clearInterval(intervalRef.current);
  }, [piece, board, next, gameOver]);

  const handleRestart = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setPiece(randomPiece());
    setNext(randomPiece());
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="card" style={{ display: "inline-block", padding: 20 }}>
      <h2>Tetris</h2>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ background: "#222", border: "2px solid #333", width: COLS * BLOCK_SIZE, height: ROWS * BLOCK_SIZE, display: "grid", gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)`, gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)` }}>
          {board.map((row, r) =>
            row.map((cell, c) => {
              let color = COLORS[cell];
              // Draw current piece
              for (let pr = 0; pr < piece.shape.length; pr++) {
                for (let pc = 0; pc < piece.shape[pr].length; pc++) {
                  if (
                    piece.shape[pr][pc] &&
                    piece.row + pr === r &&
                    piece.col + pc === c
                  ) {
                    color = COLORS[piece.type];
                  }
                }
              }
              return <div key={r + "," + c} style={{ width: BLOCK_SIZE - 2, height: BLOCK_SIZE - 2, background: color, border: "1px solid #111" }} />;
            })
          )}
        </div>
        <div>
          <div style={{ marginBottom: 12 }}>
            <strong>Next:</strong>
            <div style={{ display: "grid", gridTemplateRows: `repeat(4, ${BLOCK_SIZE}px)`, gridTemplateColumns: `repeat(4, ${BLOCK_SIZE}px)`, background: "#222", border: "1px solid #333", width: BLOCK_SIZE * 4, height: BLOCK_SIZE * 4 }}>
              {[...Array(4)].map((_, r) =>
                [...Array(4)].map((_, c) => {
                  let color = "#222";
                  if (next.shape[r] && next.shape[r][c]) color = COLORS[next.type];
                  return <div key={r + "," + c} style={{ width: BLOCK_SIZE - 2, height: BLOCK_SIZE - 2, background: color, border: "1px solid #111" }} />;
                })
              )}
            </div>
          </div>
          <div><strong>Score:</strong> {score}</div>
          {gameOver && <div style={{ color: "red", marginTop: 12 }}>Game Over!<br /><button onClick={handleRestart}>Restart</button></div>}
          {!gameOver && <div style={{ marginTop: 12 }}>Use arrow keys to move/rotate.</div>}
        </div>
      </div>
    </div>
  );
}

export default TetrisGame;