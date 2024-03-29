'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import supabase from 'utils/supabaseClient';

const ResultsPage: React.FC<{ params: { testId: string } }> = ({ params }) => {
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  useEffect(() => {
    console.log(params.testId);
    const fetchQuestions = async () => {
      try {
        const { data: fetchedQuestions, error: questionsError } = await supabase
          .from('test_questions')
          .select('question_id, order_in_test')
          .eq('test_id', params.testId);

        if (questionsError) {
          setError('Error fetching questions1');
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
              throw new Error('Error fetching question details2');
            }

            const { data: testData, error: testError } = await supabase
              .from('tests')
              .select('answer, score, time')
              .eq('test_id', params.testId)
              .single();

            if (testError) {
              throw new Error('Error fetching test data3');
            }

            setScore(testData.score);
            setTimeElapsed(testData.time);

            return {
              ...questionData,
              order_in_test: question.order_in_test,
              answer: testData.answer[question.order_in_test - 1]
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
        console.error('Error fetching questions:', error);
        setError('Error fetching questions3');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [params.testId]);

  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

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
      <div ref={componentRef} className="no-page-break">
        <h1 className="text-3xl font-bold mb-4">Rezultati</h1>
        <div className="inline-flex text-xl font-bold mb-10">
          <div className="bg-white rounded-lg shadow-md py-3 px-6 mr-5 border border-gray-300">
            Točke: {score} / {totalPoints}
          </div>
          <div className="bg-white rounded-lg shadow-md py-3 px-6 mr-5 border border-gray-300">
            Čas: {formatTime(timeElapsed)}
          </div>
          <button
            onClick={handlePrint}
            className="bg-white rounded-lg shadow-md py-3 px-6 mr-5 border border-gray-300 hover:bg-black hover:text-white"
          >
            Shrani
          </button>
        </div>
        <Link
          href={`/dashboard`}
          className="bg-black border border-gray-300 text-white hover:bg-white hover:text-black font-semibold py-3 px-6 justify-end text-xl rounded-lg inline-block transition duration-300"
        >
          Končaj
        </Link>

        <ul className="space-y-8">
          {questionsData.map((question, index) => (
            <li
              key={index}
              className="bg-white rounded-lg border border-gray-300 shadow-md p-8"
            >
              <p className="text-xl font-semibold">
                {index + 1}. {question.question_text}
              </p>
              {question.picture && (
                <div className="mt-4">
                  <img
                    className="mt-2"
                    width={400}
                    height={300}
                    src={question.picture}
                    alt={`Question ${index + 1}`}
                  />
                </div>
              )}
              <div className="mt-2">
                <ul className="ml-6 list-disc">
                  {question.options.map(
                    (option: string, optionIndex: number) => {
                      const isCorrectOption =
                        option === question.correct_answer;
                      const isSelectedOptionCorrect =
                        option === question.answer;

                      return (
                        <li
                          key={optionIndex}
                          className={`font-bold text-base ${
                            isSelectedOptionCorrect
                              ? isCorrectOption
                                ? 'text-green-500'
                                : 'text-red-500'
                              : ''
                          }`}
                        >
                          {option}
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
              <p className="text-lg font-medium mt-2">
                Pravilni odgovor: {question.correct_answer}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center mt-8 mb-12">
        <Link
          href={`/dashboard`}
          className="bg-black border border-gray-300 text-white hover:bg-white hover:text-black font-semibold py-3 px-6 rounded-lg inline-block transition duration-300"
        >
          Končaj
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
