import React, { useState } from "react";
import handRockNew from "./assets/hand-rock-new.svg";
import handPaperNew from "./assets/hand-paper-new.svg";
import handScissors from "./assets/hand-scissors.svg";

async function playRPS(choice) {
  // Simulate computer choice and result
  const choices = ["rock", "paper", "scissors"];
  const computer = choices[Math.floor(Math.random() * 3)];
  let result = "draw";
  if (
    (choice === "rock" && computer === "scissors") ||
    (choice === "paper" && computer === "rock") ||
    (choice === "scissors" && computer === "paper")
  ) {
    result = "win";
  } else if (choice !== computer) {
    result = "lose";
  }
  return new Promise((resolve) =>
    setTimeout(() => resolve({ computer, result }), 600)
  );
}

function RockPaperScissors() {
  const [count, setCount] = useState(0);
  const [userChoice, setUserChoice] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handImages = {
    rock: handRockNew,
    paper: handPaperNew,
    scissors: handScissors
  };
  const handlePlay = async (choice) => {
    setUserChoice(choice);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await playRPS(choice);
      setResult(data);
    } catch (err) {
      setError("Failed to fetch result");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="card">
      <h2>Rock Paper Scissors</h2>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <div style={{ margin: "1em 0" }}>
        <button onClick={() => handlePlay("rock")}>Rock</button>
        <button onClick={() => handlePlay("paper")}>Paper</button>
        <button onClick={() => handlePlay("scissors")}>Scissors</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2em", minHeight: "120px", margin: "1em 0" }}>
        <div style={{ transition: "transform 0.3s", transform: userChoice ? "scale(1.1)" : "scale(1)" }}>
          {userChoice && <img src={handImages[userChoice]} alt={userChoice + " hand"} width={100} height={100} style={{ filter: "drop-shadow(0 0 1em #888)" }} />}
          <div style={{ marginTop: "0.5em" }}>You</div>
        </div>
        <div style={{ fontSize: "2em" }}>vs</div>
        <div style={{ transition: "transform 0.3s", transform: result ? "scale(1.1)" : "scale(1)" }}>
          {result && <img src={handImages[result.computer]} alt={result.computer + " hand"} width={100} height={100} style={{ filter: "drop-shadow(0 0 1em #888)" }} />}
          <div style={{ marginTop: "0.5em" }}>Computer</div>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: "1em" }}>
          <p><strong>Your choice:</strong> {userChoice}</p>
          <p><strong>Computer:</strong> {result.computer}</p>
          <p><strong>Result:</strong> {result.result}</p>
        </div>
      )}
    </div>
  );
}

export default RockPaperScissors;