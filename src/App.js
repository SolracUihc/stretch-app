// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ExerciseList from './components/ExerciseList';
import ProgressTracker from './components/ProgressTracker';
import AdminPanel from './components/AdminPanel';
import './App.css';  // Basic styles

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Stretch App</h1>
        </header>
        <Routes>
          <Route path="/" element={<ExerciseList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProgressTracker />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;