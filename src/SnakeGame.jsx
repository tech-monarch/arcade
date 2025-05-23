import React, { useEffect, useRef, useState } from "react";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 }
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const SPEED = 120;

function getRandomFood(snake) {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
    if (!snake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) break;
  }
  return newFood;
}

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(direction);
  const runningRef = useRef(true);

  useEffect(() => {
    moveRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    const handleKey = e => {
      if (e.key === "ArrowUp" && moveRef.current.y !== 1) setDirection({ x: 0, y: -1 });
      else if (e.key === "ArrowDown" && moveRef.current.y !== -1) setDirection({ x: 0, y: 1 });
      else if (e.key === "ArrowLeft" && moveRef.current.x !== 1) setDirection({ x: -1, y: 0 });
      else if (e.key === "ArrowRight" && moveRef.current.x !== -1) setDirection({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + moveRef.current.x,
          y: prevSnake[0].y + moveRef.current.y
        };
        // Check collision
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE ||
          prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          runningRef.current = false;
          return prevSnake;
        }
        let newSnake;
        if (newHead.x === food.x && newHead.y === food.y) {
          newSnake = [newHead, ...prevSnake];
          setFood(getRandomFood(newSnake));
          setScore(s => s + 1);
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, -1)];
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [food, gameOver]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    runningRef.current = true;
  };

  return (
    <div className="card" style={{ display: "inline-block", padding: 20 }}>
      <h2>Snake Game</h2>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${BOARD_SIZE}, 18px)`,
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 18px)`,
          border: "2px solid #333",
          background: "#222",
          margin: "0 auto"
        }}
      >
        {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, idx) => {
          const x = idx % BOARD_SIZE;
          const y = Math.floor(idx / BOARD_SIZE);
          const isSnake = snake.some(seg => seg.x === x && seg.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={idx}
              style={{
                width: 16,
                height: 16,
                background: isHead
                  ? "#4caf50"
                  : isSnake
                  ? "#8bc34a"
                  : isFood
                  ? "#f44336"
                  : "#222",
                border: isSnake || isFood ? "1px solid #111" : "1px solid #222",
                boxSizing: "border-box"
              }}
            />
          );
        })}
      </div>
      <div style={{ marginTop: 12 }}>
        <p>Score: {score}</p>
        {gameOver && (
          <>
            <p style={{ color: "red" }}>Game Over!</p>
            <button onClick={handleRestart}>Restart</button>
          </>
        )}
        {!gameOver && <p>Use arrow keys to move.</p>}
      </div>
    </div>
  );
}

export default SnakeGame;