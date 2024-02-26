'use client';

import { useEffect, useState } from 'react';
import supabase from 'utils/supabaseClient';

const ResultsPage: React.FC<{ params: { quizId: string } }> = ({ params }) => {
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch questions from the 'quiz_questions' table based on the quizId
        const { data: fetchedQuestions, error } = await supabase
          .from('quiz_questions')
          .select('question_id, order_in_quiz')
          .eq('quiz_id', params.quizId);

        if (error) {
          setError('Error fetching questions');
          setLoading(false);
          return;
        }

        setQuestionsData(fetchedQuestions || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error.message);
        setError('Error fetching questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [params.quizId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Rezultati</h1>
      <p>Quiz ID: {params.quizId}</p>
      <h2>Questions:</h2>
      <ul>
        {questionsData.map((question, index) => (
          <li key={index}>
            Question ID: {question.question_id}, Order in Quiz:{' '}
            {question.order_in_quiz}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;
