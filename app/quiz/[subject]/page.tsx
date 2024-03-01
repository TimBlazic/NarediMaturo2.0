'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import supabase from 'utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const SubjectPage: React.FC<{ params: { subject: string } }> = ({ params }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0); // Track time elapsed in seconds

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1); // Increment time elapsed every second
    }, 1000);

    // Clean up timer on component unmount
    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    try {
      const quiz_id = generateUUID(); // Generate a unique quiz ID

      const response = await supabase
        .from('questions')
        .select(
          'question_id, question_text, points, options, correct_answer, picture'
        )
        .eq('subject', params.subject);

      const { data: questionsData, error: questionsError } = response;
      if (questionsError) {
        console.error('Error fetching questions:', questionsError.message);
        return;
      }

      const shuffledQuestions = questionsData
        ? shuffleArray(questionsData).slice(0, 20) // Limit to the first 20 elements
        : [];
      setQuestions(shuffledQuestions);

      setQuizId(quiz_id);
    } catch (error) {
      console.error('Error when fetching questions:', error.message);
    }
  };

  const handleOptionChange = (index: number, option: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = option;
    setSelectedOptions(newSelectedOptions);
  };

  const sendData = async () => {
    try {
      if (!quizId) {
        console.error('No quiz ID found.');
        return;
      }

      const user_id = 'c6df99e6-955d-44a7-a671-b0900d79568d';

      let score = 0;
      const answers: (string | null)[] = [];

      questions.forEach((question, index) => {
        const answer = selectedOptions[index] || null;
        answers.push(answer);

        if (answer === question.correct_answer) {
          score += question.points;
        }
      });

      const { error: quizError } = await supabase.from('quizzes').insert([
        {
          quiz_id: quizId,
          user_id: user_id,
          date_created: new Date(),
          allScore: questions.reduce((total, q) => total + q.points, 0),
          score: score,
          answer: answers,
          time: timeElapsed // Store time elapsed in seconds
        }
      ]);

      if (quizError) {
        console.error('Error inserting quiz:', quizError.message);
        return;
      }

      // Insert entries into the 'quiz_questions' table
      const quizQuestionsInserts = questions.map((question, index) => ({
        quiz_id: quizId,
        question_id: question.question_id,
        order_in_quiz: index + 1
      }));

      const { error: quizQuestionsError } = await supabase
        .from('quiz_questions')
        .insert(quizQuestionsInserts);

      if (quizQuestionsError) {
        console.error(
          'Error inserting quiz questions:',
          quizQuestionsError.message
        );
        return;
      }

      console.log('Quiz data and quiz questions inserted successfully');
    } catch (error) {
      console.error('Error inserting quiz:', error.message);
    }
  };

  const generateUUID = () => {
    return uuidv4();
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
          <li key={index} className="bg-white rounded-lg shadow-md p-8">
            <p className="text-xl font-semibold">
              {index + 1}. {question.question_text}
            </p>
            {question.picture && (
              <div className="mt-4">
                <img
                  className="w-full"
                  src={question.picture}
                  alt={`Question ${index + 1}`}
                />
              </div>
            )}
            <div className="mt-4">
              <ul className="text-lg space-y-4">
                {question.options.map((option, optionIndex) => (
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
        <Button className="shadow-md">
          <Link
            href={`../quiz/results/${quizId}`}
            className="bg-primary font-semibold py-3 px-6 rounded-lg inline-block transition duration-300 hover:bg-primary-dark"
            onClick={sendData}
          >
            Oddaj
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SubjectPage;
