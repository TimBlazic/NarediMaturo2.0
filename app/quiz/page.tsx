'use client';

import { createClient, PostgrestResponse } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface Question {
  question_text: string;
  answer: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const response = await supabase.from('questions').select();
      console.log('Supabase Response:', response);

      const { data, error } = response;
      if (error) {
        console.error('Error fetching questions:', error.message);
        return;
      }

      setQuestions(data || []);
    } catch (error) {
      console.error('Error when fetching questions:', (error as Error).message);
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
        Vprašanja
      </h1>
      <ul className="sm:text-center">
        {questions.map((question, index) => (
          <li key={index} className="m-10 border-2 border-white">
            <strong>Vprašanje: </strong> {question.question_text}
            <br></br>
            <strong>Odgovor:</strong> {question.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizPage;
