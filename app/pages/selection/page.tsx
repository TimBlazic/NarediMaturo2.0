'use client';

import Button from '@/components/ui/Button';
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

const QuizPage: React.FC = () => {
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
      <h1 className="text-4xl mt-10 font-extrabold text-white sm:text-center sm:text-4xl">
        Izberi predmet:
      </h1>
      <div className="flex flex-wrap justify-center mt-4">
        {distinctSubjects.map((subject, index) => (
          <Button className="mr-5 mt-5 border rounded-xl">
            <Link key={index} href={`quiz/${subject}`} className=" m-0">
              {subject}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
