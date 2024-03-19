'use client';

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Question {
  question_text: string;
  answer: string;
  subject: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TestPage: React.FC = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [distinctSubjects, setDistinctSubjects] = useState<string[]>([]);

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
      const uniqueSubjects = Array.from(
        new Set(data?.map((q: Question) => q.subject) || [])
      );
      setDistinctSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error when fetching questions:', (error as Error).message);
    }
  }

  return (
    <div>
      <h1 className="text-4xl mt-10 font-extrabold text-center sm:text-4xl">
        Izberi{' '}
        <span className="text-blue-500 dark:text-blue-500">predmet:</span>
      </h1>
      <div className="flex flex-wrap justify-center mt-4 max-w-6xl text-center m-auto">
        {distinctSubjects.map((subject, index) => (
          <Link
            key={index}
            href={`test/${subject}`}
            className="mr-5 bg-white text-xl border border-gray-300 py-2 px-5 mt-5 rounded-xl shadow-md hover:bg-black hover:text-white duration-300"
          >
            {subject}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
