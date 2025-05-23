import React, { useState } from "react";

const API_URL = "https://who-wants-to-be-a-millionaire-ai-quiz-game-trivia-api.p.rapidapi.com/generate?noqueue=1";
const API_KEY = "efb02353e8msh12998c371346153p13d193jsnf3c188326c80";
const API_HOST = "who-wants-to-be-a-millionaire-ai-quiz-game-trivia-api.p.rapidapi.com";

function MillionaireQuiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    setShowResult(false);
    setQuestions([]);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    try {
      // Add cache-busting parameter
      const url = API_URL + "&cb=" + Date.now();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": API_HOST,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          questionCount: 15,
          language: "en",
          category: "history",
          difficulty: "progressive"
        })
      });
      const data = await response.json();
      if (data && data.questions) {
        setQuestions(data.questions);
      } else {
        setError("API error: " + (data && data.message ? data.message : JSON.stringify(data)));
      }
    } catch (err) {
      setError("Failed to fetch questions. " + (err && err.message ? err.message : ""));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setSelected(answer);
    if (questions[current].correctAnswer === answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  return (
    <div className="card">
      <h2>Who Wants to Be a Millionaire</h2>
      {questions.length === 0 && !loading && (
        <button onClick={fetchQuestions}>Start Quiz</button>
      )}
      {loading && <p>Loading questions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && questions.length > 0 && !showResult && (
        <div>
          <p>
            <strong>Question {current + 1} of {questions.length}</strong>
          </p>
          <p>{questions[current].question}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
            {questions[current].answers.map((ans, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(ans)}
                disabled={selected !== null}
                style={{
                  background: selected === ans ? (ans === questions[current].correctAnswer ? "#4caf50" : "#f44336") : undefined,
                  color: selected === ans ? "#fff" : undefined
                }}
              >
                {ans}
              </button>
            ))}
          </div>
        </div>
      )}
      {showResult && (
        <div>
          <h3>Quiz Complete!</h3>
          <p>Your score: {score} / {questions.length}</p>
          <button onClick={fetchQuestions}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default MillionaireQuiz;