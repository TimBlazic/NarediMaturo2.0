'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import supabase from 'utils/supabaseClient';

const HistoryWrapper = (props: any) => {
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBySubject, setSortBySubject] = useState<boolean>(false);

  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        const { data: testHistoryData, error: testHistoryError } =
          await supabase
            .from('tests')
            .select('*')
            .eq('user_id', props.user)
            .order('date_created', { ascending: false });

        if (testHistoryError) {
          setError('Error fetching test history');
          setLoading(false);
          return;
        }

        setTestHistory(testHistoryData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test history:', error);
        setError('Error fetching test history');
        setLoading(false);
      }
    };

    fetchTestHistory();
  }, []);

  if (loading) {
    return <div>Nalaganje...</div>;
  }

  if (error) {
    return <div className="container mx-auto text-center">Error: {error}</div>;
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const today = new Date();
  const todayTests = testHistory.filter(
    (test) =>
      new Date(test.date_created).getDate() === today.getDate() &&
      new Date(test.date_created).getMonth() === today.getMonth() &&
      new Date(test.date_created).getFullYear() === today.getFullYear()
  );
  const otherTests = testHistory.filter(
    (test) =>
      new Date(test.date_created).getDate() !== today.getDate() ||
      new Date(test.date_created).getMonth() !== today.getMonth() ||
      new Date(test.date_created).getFullYear() !== today.getFullYear()
  );

  const subjectsMap = new Map<string, number>();
  testHistory.forEach((test) => {
    const subject = test.subject;
    subjectsMap.set(subject, (subjectsMap.get(subject) || 0) + 1);
  });

  const sortedTests = sortBySubject
    ? [...testHistory].sort((a, b) => a.subject.localeCompare(b.subject))
    : [...testHistory].sort(
        (a, b) =>
          new Date(b.date_created).getTime() -
          new Date(a.date_created).getTime()
      );

  return (
    <div className="container mx-auto mb-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Zgodovina rešenih kvizov
      </h1>
      <div className="flex justify-center mb-4">
        <button
          className="bg-white  font-semibold border border-gray-300 hover:bg-black hover:text-white py-2 px-4 rounded-lg inline-block mr-4 transition duration-300 hover:bg-primary-dark"
          onClick={() => setSortBySubject(true)}
        >
          Razvrsti po predmetu
        </button>
        <button
          className="bg-white font-semibold border hover:bg-black hover:text-white border-gray-300 py-2 px-4 rounded-lg inline-block transition duration-300 hover:bg-primary-dark"
          onClick={() => setSortBySubject(false)}
        >
          Razvrsti po datumu
        </button>
      </div>
      <h2 className="font-bold mb-3">Današnji testi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todayTests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
            <p className="">Danes še nisi rešil nobenega testa.</p>
            <Link href="/selection" passHref>
              <button className="bg-black  text-white font-semibold border border-gray-300 py-2 px-4 rounded-lg inline-block mt-4 transition duration-300 hover:bg-white hover:text-black">
                Reši test zdaj
              </button>
            </Link>
          </div>
        ) : (
          todayTests.map((test, index) => (
            <Link href={`/test/results/${test.test_id}`} key={index}>
              <div className="bg-white rounded-lg shadow-md cursor-pointer p-6 hover:bg-black hover:text-white transition duration-300 border border-gray-300">
                <h2 className="text-xl font-semibold mb-4">{test.subject}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Datum: {new Date(test.date_created).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Točke: {test.score}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Čas: {formatTime(test.time)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
      <hr className="my-8" />
      <h2 className="font-bold mb-3">Vsi testi</h2>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTests.map((test, index) => (
            <Link href={`/test/results/${test.test_id}`} key={index}>
              <div className="bg-white rounded-lg shadow-md cursor-pointer p-6 hover:bg-black hover:text-white transition duration-300 border border-gray-300">
                <h2 className="text-xl font-semibold mb-4">{test.subject}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Datum: {new Date(test.date_created).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Točke: {test.score}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Čas: {formatTime(test.time)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryWrapper;
