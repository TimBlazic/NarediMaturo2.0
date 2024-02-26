'use client';

// Import the necessary modules/components
import Button from '@/components/ui/Button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import supabase from 'utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Define the Question interface
interface Question {
  question_id: number;
  question_text: string;
  points: number;
  options: string[];
  correct_answer: string;
  picture?: string;
}

// Define the SubjectPage component
const SubjectPage: React.FC<{ params: { subject: string } }> = ({ params }) => {
  // State variables to store questions, selected options, quiz ID, and quiz score
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Function to fetch questions from the database
  const fetchQuestions = async () => {
    try {
      const quiz_id = generateUUID(); // Generate a unique quiz ID

      // Fetch questions from the 'questions' table based on the subject
      const response = await supabase
        .from('questions')
        .select(
          'question_id, question_text, points, options, correct_answer, picture'
        )
        .eq('subject', params.subject);

      // Extract the data and handle any errors
      const { data: questionsData, error: questionsError } = response;
      if (questionsError) {
        console.error('Error fetching questions:', questionsError.message);
        return;
      }

      const shuffledQuestions = questionsData
        ? shuffleArray(questionsData).slice(0, 20) // Uporabite slice(0, 20) za omejitev na prvih 20 elementov
        : [];
      setQuestions(shuffledQuestions);

      setQuizId(quiz_id);
    } catch (error) {
      console.error('Error when fetching questions:', error.message);
    }
  };

  // Function to handle radio button option change
  const handleOptionChange = (index: number, option: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = option;
    setSelectedOptions(newSelectedOptions);
  };

  // Function to send quiz data to the database
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
        // Preveri, ali je bil podan odgovor na vprašanje
        const answer = selectedOptions[index] || null;
        answers.push(answer);

        // Povečaj rezultat, če je odgovor pravilen
        if (answer === question.correct_answer) {
          score += question.points;
        }
      });

      // Pošlji podatke v bazo s pravilno vrednostjo rezultata
      const { error: quizError } = await supabase.from('quizzes').insert([
        {
          quiz_id: quizId,
          user_id: user_id,
          date_created: new Date(),
          allScore: questions.reduce((total, q) => total + q.points, 0),
          score: score, // Uporabite pravilno izračunano vrednost rezultata
          answer: answers
        }
      ]);

      if (quizError) {
        console.error('Error inserting quiz:', quizError.message);
        return;
      }

      // Insert questions into the 'quiz_questions' table with the same quiz ID
      const questionInserts = questions.map((question, index) => ({
        quiz_id: quizId,
        question_id: question.question_id,
        order_in_quiz: index + 1
      }));

      const { error: questionError } = await supabase
        .from('quiz_questions')
        .insert(questionInserts);

      if (questionError) {
        console.error('Error inserting quiz questions:', questionError.message);
        return;
      }

      console.log('Quiz data inserted successfully');

      // Redirect to the results page with quiz_id as query parameter
    } catch (error) {
      console.error('Error inserting quiz:', error.message);
    }
  };

  // Function to generate a UUID
  const generateUUID = () => {
    return uuidv4();
  };

  // Function to shuffle an array
  const shuffleArray = (array: Question[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Render the component
  return (
    <div className="container mx-auto">
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

// Export the component
export default SubjectPage;
