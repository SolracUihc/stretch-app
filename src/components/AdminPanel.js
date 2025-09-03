// src/components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

function AdminPanel() {
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(30);
  const [photoUrl, setPhotoUrl] = useState('');  // Hardcode or paste URL
  const [premium, setPremium] = useState(false);
  const [routine, setRoutine] = useState('Beginner');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (auth.currentUser?.email !== 'your@admin.email') return alert('Admin only!');  // Change to your email
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'exercises'));
      setExercises(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, []);

  const handleSubmit = async () => {
    const data = { 
      name, 
      duration: Number(duration), 
      photoUrl,  // Paste GitHub raw URL here
      premium, 
      routine,
      updatedAt: serverTimestamp()  // Optional: track changes
    };

    if (editId) {
      await updateDoc(doc(db, 'exercises', editId), data);
    } else {
      await addDoc(collection(db, 'exercises'), data);
    }
    alert('Saved! (Upload photo to GitHub separately and update URL)');
    // Refresh list
    const snap = await getDocs(collection(db, 'exercises'));
    setExercises(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleEdit = (ex) => {
    setName(ex.name);
    setDuration(ex.duration);
    setPhotoUrl(ex.photoUrl);
    setPremium(ex.premium);
    setRoutine(ex.routine);
    setEditId(ex.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'exercises', id));
    // Refresh
    const snap = await getDocs(collection(db, 'exercises'));
    setExercises(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  return (
    <div>
      <h2>Admin: Edit Poses/Routines (Photos via GitHub)</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (s)" />
      <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="GitHub Raw Photo URL (e.g., https://raw...)" />
      <label>Premium: <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.checked)} /></label>
      <input value={routine} onChange={(e) => setRoutine(e.target.value)} placeholder="Routine Name" />
      <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'}</button>
      <ul>
        {exercises.map(ex => (
          <li key={ex.id}>
            {ex.name} - {ex.photoUrl} <button onClick={() => handleEdit(ex)}>Edit</button> <button onClick={() => handleDelete(ex.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>Tip: Upload new photos to public/images/ in GitHub, commit, then paste raw URL here.</p>
    </div>
  );
}

export default AdminPanel;