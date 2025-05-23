import React, { useEffect, useRef, useState } from "react";

const BOARD_WIDTH = 300;
const BOARD_HEIGHT = 180;
const PADDLE_WIDTH = 42;
const PADDLE_HEIGHT = 8;
const BALL_SIZE = 8;
const BRICK_ROWS = 3;
const BRICK_COLS = 7;
const BRICK_WIDTH = 38;
const BRICK_HEIGHT = 12;
const BRICK_PADDING = 4;
const BALL_SPEED = 2.5;

function createBricks() {
  let bricks = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: c * (BRICK_WIDTH + BRICK_PADDING) + 10,
        y: r * (BRICK_HEIGHT + BRICK_PADDING) + 10,
        status: true,
        color: ["#FFD54F", "#4FC3F7", "#81C784"][r % 3]
      });
    }
  }
  return bricks;
}

function BreakoutGame() {
  const [paddleX, setPaddleX] = useState(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ball, setBall] = useState({ x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT - 30, dx: BALL_SPEED, dy: -BALL_SPEED });
  const [bricks, setBricks] = useState(createBricks());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const requestRef = useRef();

  useEffect(() => {
    const handleKey = e => {
      if (e.key === "ArrowLeft") setPaddleX(x => Math.max(0, x - 24));
      else if (e.key === "ArrowRight") setPaddleX(x => Math.min(BOARD_WIDTH - PADDLE_WIDTH, x + 24));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (gameOver || win) return;
    const animate = () => {
      setBall(prev => {
        let { x, y, dx, dy } = prev;
        x += dx;
        y += dy;
        // Wall collision
        if (x <= 0 || x + BALL_SIZE >= BOARD_WIDTH) dx = -dx;
        if (y <= 0) dy = -dy;
        // Paddle collision
        if (
          y + BALL_SIZE >= BOARD_HEIGHT - PADDLE_HEIGHT &&
          x + BALL_SIZE >= paddleX &&
          x <= paddleX + PADDLE_WIDTH
        ) {
          dy = -Math.abs(dy);
        }
        // Brick collision
        setBricks(bricks => {
          let hit = false;
          const newBricks = bricks.map(brick => {
            if (
              brick.status &&
              x + BALL_SIZE > brick.x &&
              x < brick.x + BRICK_WIDTH &&
              y + BALL_SIZE > brick.y &&
              y < brick.y + BRICK_HEIGHT
            ) {
              hit = true;
              setScore(s => s + 10);
              return { ...brick, status: false };
            }
            return brick;
          });
          if (hit) dy = -dy;
          if (newBricks.every(b => !b.status)) setWin(true);
          return newBricks;
        });
        // Lose
        if (y > BOARD_HEIGHT) setGameOver(true);
        return { x, y, dx, dy };
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line
  }, [gameOver, win, paddleX]);

  const handleRestart = () => {
    setPaddleX(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2);
    setBall({ x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT - 30, dx: BALL_SPEED, dy: -BALL_SPEED });
    setBricks(createBricks());
    setScore(0);
    setGameOver(false);
    setWin(false);
  };

  return (
    <div className="card" style={{ display: "inline-block", padding: 20 }}>
      <h2>Breakout</h2>
      <svg width={BOARD_WIDTH} height={BOARD_HEIGHT} style={{ background: "#222", border: "2px solid #333" }}>
        {/* Bricks */}
        {bricks.map((brick, i) =>
          brick.status ? (
            <rect key={i} x={brick.x} y={brick.y} width={BRICK_WIDTH} height={BRICK_HEIGHT} fill={brick.color} stroke="#222" />
          ) : null
        )}
        {/* Paddle */}
        <rect x={paddleX} y={BOARD_HEIGHT - PADDLE_HEIGHT} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} fill="#4FC3F7" />
        {/* Ball */}
        <rect x={ball.x} y={ball.y} width={BALL_SIZE} height={BALL_SIZE} fill="#E57373" />
      </svg>
      <div style={{ marginTop: 12 }}>
        <strong>Score:</strong> {score}
        {gameOver && <div style={{ color: "red", marginTop: 12 }}>Game Over!<br /><button onClick={handleRestart}>Restart</button></div>}
        {win && <div style={{ color: "green", marginTop: 12 }}>You Win!<br /><button onClick={handleRestart}>Restart</button></div>}
        {!gameOver && !win && <div style={{ marginTop: 12 }}>Use Left/Right arrows or touch controls to move.</div>}
      </div>
      <div className="game-controls">
        <div className="control-pad">
          <button className="control-button control-left" onClick={(e) => { e.preventDefault(); setPaddleX(x => Math.max(0, x - 24)); }}>←</button>
          <button className="control-button control-right" onClick={(e) => { e.preventDefault(); setPaddleX(x => Math.min(BOARD_WIDTH - PADDLE_WIDTH, x + 24)); }}>→</button>
        </div>
      </div>
    </div>
  );
}

export default BreakoutGame;