import { useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  limit 
} from 'firebase/firestore';
import { db } from './firebase';

export function useWorkshopResponses(questionId) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError('Firebase not initialized');
      return;
    }

    const responsesRef = collection(db, 'workshop-responses');
    const q = query(
      responsesRef,
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter by questionId client-side (or create composite index in Firebase)
        const filtered = questionId 
          ? docs.filter(d => d.questionId === questionId)
          : docs;
        
        setResponses(filtered);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching responses:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [questionId]);

  const addResponse = async (questionId, question, name, answer) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const responsesRef = collection(db, 'workshop-responses');
      await addDoc(responsesRef, {
        questionId,
        question,
        name: name.trim(),
        answer: answer.trim(),
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding response:', err);
      throw err;
    }
  };

  return { responses, loading, error, addResponse };
}

// Hook for all responses (for export/admin view)
export function useAllResponses() {
  const [allResponses, setAllResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const responsesRef = collection(db, 'workshop-responses');
    const q = query(responsesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to ISO string for easier handling
        timestampISO: doc.data().timestamp?.toDate().toISOString()
      }));
      setAllResponses(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { allResponses, loading };
}
