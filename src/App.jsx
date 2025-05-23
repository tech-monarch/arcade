import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { playRPS } from './api.js'
import handRockNew from './assets/hand-rock-new.svg'
import handPaperNew from './assets/hand-paper-new.svg'
import handScissors from './assets/hand-scissors.svg'
import RockPaperScissors from "./RockPaperScissors";
import MillionaireQuiz from "./MillionaireQuiz";
import SnakeGame from "./SnakeGame";
import TetrisGame from "./TetrisGame";
import PongGame from "./PongGame";
import BreakoutGame from "./BreakoutGame";
import tetrisIcon from "./assets/tetris.svg";
import pongIcon from "./assets/pong.svg";
import breakoutIcon from "./assets/breakout.svg";

function App() {
  const [count, setCount] = useState(0)
  const [userChoice, setUserChoice] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const handImages = {
    rock: handRockNew,
    paper: handPaperNew,
    scissors: handScissors
  }
  const handlePlay = async (choice) => {
    setUserChoice(choice)
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await playRPS(choice)
      setResult(data)
    } catch (err) {
      setError('Failed to fetch result')
    } finally {
      setLoading(false)
    }
  }
  const [game, setGame] = useState(null);
  const games = [
    { key: "rps", name: "Rock Paper Scissors", icon: handRockNew, component: <RockPaperScissors /> },
    { key: "millionaire", name: "Who Wants to Be a Millionaire", icon: handPaperNew, component: <MillionaireQuiz /> },
    { key: "snake", name: "Snake Game", icon: handScissors, component: <SnakeGame /> },
    { key: "tetris", name: "Tetris", icon: tetrisIcon, component: <TetrisGame /> },
    { key: "pong", name: "Pong", icon: pongIcon, component: <PongGame /> },
    { key: "breakout", name: "Breakout", icon: breakoutIcon, component: <BreakoutGame /> }
  ];
  return (
    <>
      <h1 style={{marginBottom: 24}}>Arcade Game Platform</h1>
      {!game && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          {games.map(g => (
            <div key={g.key} className="card" style={{ width: 180, textAlign: "center", cursor: "pointer", boxShadow: "0 2px 8px #0002", transition: "transform 0.2s", padding: 16 }} onClick={() => setGame(g.key)}>
              <img src={g.icon} alt={g.name + " icon"} style={{ width: 80, height: 80, marginBottom: 12 }} />
              <h3 style={{ margin: 0 }}>{g.name}</h3>
            </div>
          ))}
        </div>
      )}
      {game && (
        <>
          <button onClick={() => setGame(null)} style={{marginBottom:'1em'}}>Back to Menu</button>
          {games.find(g => g.key === game)?.component}
        </>
      )}
    </>
  );
}

export default App
