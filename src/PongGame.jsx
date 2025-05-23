import React, { useEffect, useRef, useState } from "react";

const BOARD_WIDTH = 300;
const BOARD_HEIGHT = 180;
const PADDLE_WIDTH = 8;
const PADDLE_HEIGHT = 48;
const BALL_SIZE = 8;
const PADDLE_SPEED = 5;
const BALL_SPEED = 3;

function PongGame() {
  const [playerY, setPlayerY] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [aiY, setAiY] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ball, setBall] = useState({ x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2, dx: BALL_SPEED, dy: BALL_SPEED });
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef();

  useEffect(() => {
    const handleKey = e => {
      if (e.key === "ArrowUp") setPlayerY(y => Math.max(0, y - PADDLE_SPEED));
      else if (e.key === "ArrowDown") setPlayerY(y => Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, y + PADDLE_SPEED));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const animate = () => {
      setBall(prev => {
        let { x, y, dx, dy } = prev;
        x += dx;
        y += dy;
        // Wall collision
        if (y <= 0 || y + BALL_SIZE >= BOARD_HEIGHT) dy = -dy;
        // Player paddle collision
        if (
          x <= PADDLE_WIDTH &&
          y + BALL_SIZE >= playerY &&
          y <= playerY + PADDLE_HEIGHT
        ) {
          dx = Math.abs(dx);
        }
        // AI paddle collision
        if (
          x + BALL_SIZE >= BOARD_WIDTH - PADDLE_WIDTH &&
          y + BALL_SIZE >= aiY &&
          y <= aiY + PADDLE_HEIGHT
        ) {
          dx = -Math.abs(dx);
        }
        // Score
        if (x < 0) {
          setScore(s => ({ ...s, ai: s.ai + 1 }));
          if (score.ai + 1 >= 5) setGameOver(true);
          return { x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2, dx: BALL_SPEED, dy: BALL_SPEED };
        }
        if (x + BALL_SIZE > BOARD_WIDTH) {
          setScore(s => ({ ...s, player: s.player + 1 }));
          if (score.player + 1 >= 5) setGameOver(true);
          return { x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2, dx: -BALL_SPEED, dy: BALL_SPEED };
        }
        return { x, y, dx, dy };
      });
      // AI movement
      setAiY(aiY => {
        const center = aiY + PADDLE_HEIGHT / 2;
        if (center < ball.y) return Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, aiY + PADDLE_SPEED * 0.7);
        if (center > ball.y + BALL_SIZE) return Math.max(0, aiY - PADDLE_SPEED * 0.7);
        return aiY;
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line
  }, [gameOver, ball.x, ball.y]);

  const handleRestart = () => {
    setPlayerY(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setAiY(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setBall({ x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2, dx: BALL_SPEED, dy: BALL_SPEED });
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
  };

  return (
    <div className="card" style={{ display: "inline-block", padding: 20 }}>
      <h2>Pong</h2>
      <svg width={BOARD_WIDTH} height={BOARD_HEIGHT} style={{ background: "#222", border: "2px solid #333" }}>
        {/* Player Paddle */}
        <rect x={0} y={playerY} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} fill="#4FC3F7" />
        {/* AI Paddle */}
        <rect x={BOARD_WIDTH - PADDLE_WIDTH} y={aiY} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} fill="#FFD54F" />
        {/* Ball */}
        <rect x={ball.x} y={ball.y} width={BALL_SIZE} height={BALL_SIZE} fill="#E57373" />
      </svg>
      <div style={{ marginTop: 12 }}>
        <strong>Score:</strong> You {score.player} - {score.ai} AI
        {gameOver && <div style={{ color: "red", marginTop: 12 }}>Game Over!<br /><button onClick={handleRestart}>Restart</button></div>}
        {!gameOver && <div style={{ marginTop: 12 }}>Use Up/Down arrows or touch controls to move.</div>}
      </div>
      <div className="game-controls">
        <div className="control-pad">
          <button className="control-button control-up" onClick={() => setPlayerY(y => Math.max(0, y - PADDLE_SPEED))}>↑</button>
          <button className="control-button control-down" onClick={() => setPlayerY(y => Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, y + PADDLE_SPEED))}>↓</button>
        </div>
      </div>
    </div>
  );
}

export default PongGame;