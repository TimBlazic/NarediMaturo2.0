'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import supabase from 'utils/supabaseClient';

const ResultsPage: React.FC<{ params: { quizId: string } }> = ({ params }) => {
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data: fetchedQuestions, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('question_id, order_in_quiz')
          .eq('quiz_id', params.quizId);

        if (questionsError) {
          setError('Error fetching questions');
          setLoading(false);
          return;
        }

        const questionsDetails = await Promise.all(
          fetchedQuestions.map(async (question: any) => {
            const { data: questionData, error: questionError } = await supabase
              .from('questions')
              .select(
                'question_text, subject, points, options, correct_answer, picture'
              )
              .eq('question_id', question.question_id)
              .single();

            if (questionError) {
              throw new Error('Error fetching question details');
            }

            const { data: quizData, error: quizError } = await supabase
              .from('quizzes')
              .select('answer, score, time')
              .eq('quiz_id', params.quizId)
              .single();

            if (quizError) {
              throw new Error('Error fetching quiz data');
            }

            setScore(quizData.score);
            setTimeElapsed(quizData.time);

            return {
              ...questionData,
              order_in_quiz: question.order_in_quiz,
              answer: quizData.answer[question.order_in_quiz - 1]
            };
          })
        );

        setQuestionsData(questionsDetails);
        setLoading(false);

        const totalPoints = questionsDetails.reduce(
          (total, question) => total + question.points,
          0
        );
        setTotalPoints(totalPoints);
      } catch (error) {
        console.error('Error fetching questions:', error.message);
        setError('Error fetching questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [params.quizId]);

  // Funkcija za pretvorbo sekund v format mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="container mx-auto">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Rezultati</h1>
      <div className="inline-flex text-xl font-bold mb-10">
        <div className="bg-white rounded-lg shadow-md p-8 mr-10">
          Točke: {score} / {totalPoints}
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          Čas: {formatTime(timeElapsed)}
        </div>
      </div>

      <ul className="space-y-8">
        {questionsData.map((question, index) => (
          <li key={index} className="bg-white rounded-lg shadow-md p-8">
            <p className="text-xl font-semibold">
              {index + 1}. {question.question_text}
            </p>
            {question.picture && (
              <div className="mt-4">
                <img
                  className="mt-2"
                  src={question.picture}
                  alt={`Question ${index + 1}`}
                />
              </div>
            )}
            <div className="mt-2">
              <ul className="ml-6 list-disc">
                {question.options.map((option: string, optionIndex: number) => {
                  const isCorrectOption = option === question.correct_answer;
                  const isSelectedOptionCorrect = option === question.answer;

                  return (
                    <li
                      key={optionIndex}
                      className={`font-bold text-base ${
                        isSelectedOptionCorrect
                          ? isCorrectOption
                            ? 'text-green-500' // Selected and correct
                            : 'text-red-500' // Selected but incorrect
                          : '' // Not selected
                      }`}
                    >
                      {option}
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="text-lg font-medium mt-2">
              Pravilni odgovor: {question.correct_answer}
            </p>
          </li>
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

export default ResultsPage;
