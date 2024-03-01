'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import supabase from 'utils/supabaseClient';

const HistoryPage: React.FC = () => {
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user_id = 'c6df99e6-955d-44a7-a671-b0900d79568d';

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        // Pridobimo zgodovino rešenih kvizov za trenutnega uporabnika
        const { data: quizHistoryData, error: quizHistoryError } =
          await supabase
            .from('quizzes')
            .select('*')
            .eq('user_id', user_id)
            .order('date_created', { ascending: false });

        if (quizHistoryError) {
          setError('Error fetching quiz history');
          setLoading(false);
          return;
        }

        setQuizHistory(quizHistoryData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz history:', error.message);
        setError('Error fetching quiz history');
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, []);

  if (loading) {
    return <div className="container mx-auto">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto">Error: {error}</div>;
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Ostali deli kode ...

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Zgodovina</h1>
      <ul className="space-y-8">
        {quizHistory.map((quiz, index) => (
          <Link href={`/quiz/results/${quiz.quiz_id}`} key={index}>
            <li className="bg-white rounded-lg shadow-md p-8 cursor-pointer mt-5">
              <p className="text-xl font-semibold">
                Datum: {new Date(quiz.date_created).toLocaleString()}
              </p>
              <p className="text-lg font-medium">Točke: {quiz.score}</p>
              <p className="text-lg font-medium">
                Čas: {formatTime(quiz.time)}
              </p>
            </li>
          </Link>
        ))}
      </ul>
      <div className="flex justify-center mt-8">
        <Button>
          <Link
            href={`/`}
            className="bg-primary font-semibold py-3 px-6 rounded-lg inline-block transition duration-300 hover:bg-primary-dark"
          >
            Domov
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HistoryPage;
