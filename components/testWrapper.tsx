'use client';

import supabase from '@/utils/supabaseClient';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

const Wrapper = (props: any) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [testId, setTestId] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  const originalString = props.subject;
  const subject = decodeURIComponent(originalString);

  const generateUUID = () => {
    return uuidv4();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await supabase
        .from('questions')
        .select(
          'question_id, question_text, points, options, correct_answer, picture'
        )
        .eq('subject', subject);

      const { data: questionsData, error: questionsError } = response;
      if (questionsError) {
        console.error('Error fetching questions:', questionsError.message);
        return;
      }

      const shuffledQuestions = questionsData
        ? shuffleArray(questionsData).slice(0, 20) // Limit to the first 20 elements
        : [];
      setQuestions(shuffledQuestions);

      const test_id = generateUUID();
      console.log('Generated UUID for this test', test_id);
      setTestId(test_id);
    } catch (error) {
      console.error('Error when fetching questions:', error);
    }
  };

  const handleOptionChange = (index: number, option: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = option;
    setSelectedOptions(newSelectedOptions);
  };

  const sendData = async () => {
    try {
      if (!testId) {
        console.error('No test ID found.');
        return;
      }

      let score = 0;
      const answers: (string | null)[] = [];

      questions.forEach((question, index) => {
        const answer = selectedOptions[index] || null;
        answers.push(answer);

        if (answer === question.correct_answer) {
          score += question.points;
        }
      });
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      // Insert entries into the 'tests' table
      const { error: testError } = await supabase.from('tests').insert([
        {
          test_id: testId,
          user_id: props.user,
          all_score: questions.reduce((total, q) => total + q.points, 0),
          score: score,
          time: timeElapsed,
          answer: answers,
          subject: subject,
          date_created: new Date(),
          date: startOfToday
        }
      ]);

      if (testError) {
        console.error('Error inserting test:', testError.message);
        return;
      }

      // Insert entries into the 'quiz_questions' table
      const quizQuestionsInserts = questions.map((question, index) => ({
        test_id: testId,
        question_id: question.question_id,
        order_in_test: index + 1
      }));

      const { error: quizQuestionsError } = await supabase
        .from('test_questions')
        .insert(quizQuestionsInserts);

      if (quizQuestionsError) {
        console.error(
          'Error inserting quiz questions:',
          quizQuestionsError.message
        );
        return;
      }

      console.log('Test data and test questions inserted successfully');
    } catch (error) {
      console.error('Error inserting test:', error);
    }
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="container mx-auto">
      <div className="text-2xl text-center my-4">
        {Math.floor(timeElapsed / 60)}:
        {(timeElapsed % 60).toString().padStart(2, '0')}
      </div>

      <ul className="space-y-8">
        {questions.map((question, index) => (
          <li
            key={index}
            className="bg-white rounded-lg shadow-md p-8 border border-gray-300"
          >
            <p className="text-xl font-semibold">
              {index + 1}. {question.question_text}
            </p>
            {question.picture && (
              <div className="mt-4">
                <Image src={question.picture} alt={`Question ${index + 1}`} />
              </div>
            )}
            <div className="mt-4">
              <ul className="text-lg space-y-4">
                {question.options.map((option: string, optionIndex: number) => (
                  <li key={optionIndex}>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question_${index}`}
                        value={option}
                        checked={selectedOptions[index] === option}
                        onChange={() => handleOptionChange(index, option)}
                        className="form-radio h-5 w-5 text-primary"
                      />
                      <span>{option}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      <div className="relative top-4 bottom-0 mb-16">
        <Link
          href={testId ? `../test/results/${testId}` : '#'}
          className={`bg-black text-white hover:bg-white hover:text-black duration-300 font-semibold py-3 px-6 rounded-lg border border-gray-300 inline-block transition duration-300 ${
            testId ? 'hover:bg-primary-dark' : 'cursor-not-allowed'
          }`}
          onClick={sendData}
        >
          Oddaj
        </Link>
      </div>
    </div>
  );
};

export default Wrapper;
