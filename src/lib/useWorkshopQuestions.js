import { useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export function useWorkshopQuestions() {
  const [customQuestions, setCustomQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError('Firebase not initialized');
      return;
    }

    const questionsRef = collection(db, 'workshop-questions');
    const q = query(questionsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCustomQuestions(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching questions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addQuestion = async (questionText, author) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const questionsRef = collection(db, 'workshop-questions');
      const now = Timestamp.now();
      
      const docRef = await addDoc(questionsRef, {
        question: questionText.trim(),
        author: author.trim(),
        createdAt: now,
        timestamp: serverTimestamp() // For server-side tracking
      });
      
      // Return the generated ID to use it immediately
      return docRef.id;
    } catch (err) {
      console.error('Error adding question:', err);
      throw err;
    }
  };

  return { customQuestions, loading, error, addQuestion };
}
