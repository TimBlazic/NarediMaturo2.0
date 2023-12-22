'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import supabase from 'utils/supabaseClient';

interface Question {
  question_text: string;
  answer: string;
  subject: string;
  points: number;
}

const SubjectPage: React.FC<{ params: { subject: string } }> = ({ params }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const response = await supabase
        .from('questions')
        .select()
        .eq('subject', params.subject);

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
    <div className="w-3/4 items-center justify-center mx-auto">
      <h1 className="text-5xl text-red-500 mt-10 ml-10 font-bold">{`Kviz: ${
        questions.length > 0 ? questions[0].subject : params.subject
      }`}</h1>
      <ul className="">
        {questions.map((question, index) => (
          <li
            key={index}
            className="m-10 border-2 border-neutral-500 rounded-lg p-10 border-neutral-500"
          >
            <strong>Vprašanje: </strong> {question.question_text}
            <div className="text-right">
              <strong>Točke:</strong> {question.points}
            </div>
          </li>
        ))}
      </ul>
      <Link href="results/">
        <Button>Končaj</Button>
      </Link>
    </div>
  );
};

export default SubjectPage;
