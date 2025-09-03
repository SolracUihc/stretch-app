// src/components/Timer.js
import React, { useState, useEffect } from 'react';

function Timer({ duration }) {  // duration in seconds, e.g., 30
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      alert('Time up!');
      setIsRunning(false);
    }
  }, [isRunning, timeLeft]);

  return (
    <div>
      <p>Time: {timeLeft}s</p>
      <button onClick={() => { setIsRunning(true); setTimeLeft(duration); }}>Start Timer</button>
      <button onClick={() => setIsRunning(false)}>Pause</button>
    </div>
  );
}

export default Timer;