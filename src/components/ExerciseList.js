// src/components/ExerciseList.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Timer from './Timer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { addDoc } from 'firebase/firestore';

const stripePromise = loadStripe('pk_test_51S3A3vPlPXim9QAmTepfS3DnnFotElig3efMNwrrOy4HOIZN2hMkCIbqOTMOCZdV86pa5HJFAeoH555qCwFGnL2x00f3fZwoEe');  // From Stripe dashboard

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check premium status from user doc (add 'premium: true' to user doc in Firestore after payment)
        getDocs(collection(db, 'users')).then(snap => {
          const userDoc = snap.docs.find(doc => doc.id === currentUser.uid);
          setIsPremium(userDoc?.data()?.premium || false);
        });
      }
    });

    const fetchExercises = async () => {
      const snap = await getDocs(collection(db, 'exercises'));
      setExercises(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchExercises();
  }, []);

  if (!user) return <p>Please <a href="/login">login</a> to view exercises.</p>;

  return (
    <Elements stripe={stripePromise}>
      <div>
        <h2>Exercises</h2>
        {exercises.filter(ex => !ex.premium || isPremium).map(ex => (
          <div key={ex.id}>
            <h3>{ex.name} ({ex.routine})</h3>
            <img src={ex.photoUrl} alt={ex.name} />
            <Timer duration={ex.duration} />
            <button onClick={() => logProgress(ex.id)}>Complete</button>  // Calls progress function
          </div>
        ))}
        {!isPremium && <CheckoutForm setIsPremium={setIsPremium} />}
      </div>
    </Elements>
  );
}

// Simple Stripe checkout form
function CheckoutForm({ setIsPremium }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubscribe = async () => {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (error) return alert(error.message);

    // In real app, send paymentMethod.id to your backend (e.g., Firebase function) to create subscription.
    // For MVP, simulate: Update user doc to premium=true
    // Add doc(db, 'users', auth.currentUser.uid).set({premium: true}, {merge: true});
    setIsPremium(true);
    alert('Subscribed! Refresh to access premium.');
  };

  return (
    <div>
      <h3>Subscribe to Premium ($9.99/month)</h3>
      <CardElement />
      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  );
}

export default ExerciseList;

// Helper for progress (add to ProgressTracker.js later)
async function logProgress(exerciseId) {
  // Add to 'progress' collection: {userId, exerciseId, date}
  // Use addDoc(collection(db, 'progress'), {userId: auth.currentUser.uid, exerciseId, date: new Date()});
  // Inside logProgress:
  await addDoc(collection(db, 'progress'), {
  userId: auth.currentUser.uid,
  exerciseId,
  date: new Date()
  });
  alert('Progress logged!');
}