// src/components/ProgressTracker.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';

function ProgressTracker() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'progress'), where('userId', '==', auth.currentUser.uid));
      getDocs(q).then(snap => setProgress(snap.docs.map(doc => doc.data())));
    }
  }, []);

  return (
    <div>
      <h2>Your Progress</h2>
      <ul>
        {progress.map((log, i) => (
          <li key={i}>Completed {log.exerciseId} on {log.date.toDate().toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProgressTracker;