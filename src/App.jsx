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
      <h1 style={{marginBottom: 24, fontFamily: 'Montserrat, Avenir, Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '2.8em', letterSpacing: '-1px', color: '#222', textShadow: '0 2px 12px #0001'}}>Arcade Game Platform</h1>
      {!game && (
        <div className="game-grid">
          {games.map(g => (
            <div key={g.key} className="game-card" onClick={() => setGame(g.key)}>
              <div className="game-card-img-wrap">
                <img src={g.icon} alt={g.name + ' icon'} className="game-card-img" />
              </div>
              <div className="game-card-content">
                <h3 className="game-card-title">{g.name}</h3>
                <p className="game-card-desc">{g.key === 'rps' ? 'Classic hand game, test your luck!' : g.key === 'millionaire' ? 'Quiz your way to a million!' : g.key === 'snake' ? 'Retro snake fun.' : g.key === 'tetris' ? 'Timeless block puzzle.' : g.key === 'pong' ? 'Arcade paddle challenge.' : g.key === 'breakout' ? 'Break the bricks!' : ''}</p>
              </div>
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
