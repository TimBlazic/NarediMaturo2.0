'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import supabase from 'utils/supabaseClient';

const HistoryWrapper = (props: any) => {
  const [testHistory, settestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchtestHistory = async () => {
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

        settestHistory(testHistoryData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test history:', error.message);
        setError('Error fetching test history');
        setLoading(false);
      }
    };

    fetchtestHistory();
  }, []);

  if (loading) {
    return <div className="container mx-auto text-center">Loading...</div>;
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

  // Statistika
  const totalTests = testHistory.length;
  const subjectsMap = new Map<string, number>();
  testHistory.forEach((test) => {
    const subject = test.subject;
    subjectsMap.set(subject, (subjectsMap.get(subject) || 0) + 1);
  });
  const mostFrequentSubject = [...subjectsMap.entries()].reduce(
    (a, e) => (e[1] > a[1] ? e : a),
    ['', 0]
  )[0];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Zgodovina rešenih kvizov
      </h1>

      <h2 className="font-bold mb-3">Današnji testi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todayTests.map((test, index) => (
          <Link href={`/test/results/${test.test_id}`} key={index}>
            <div className="bg-white rounded-lg shadow-md cursor-pointer p-6 hover:bg-gray-100 transition duration-300">
              <h2 className="text-xl font-semibold mb-4">{test.subject}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Datum: {new Date(test.date_created).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mb-2">Točke: {test.score}</p>
              <p className="text-sm text-gray-500 mb-2">
                Čas: {formatTime(test.time)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <hr className="my-8" />
      <h2 className="font-bold mb-3">Vsi testi</h2>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTests.map((test, index) => (
            <Link href={`/test/results/${test.test_id}`} key={index}>
              <div className="bg-white rounded-lg shadow-md cursor-pointer p-6 hover:bg-gray-100 transition duration-300">
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
      <div className="flex justify-center mt-8">
        <Link
          href="/dashboard"
          passHref
          className="bg-primary text-white font-semibold py-3 px-6 rounded-lg inline-block transition duration-300 hover:bg-primary-dark"
        >
          Domov
        </Link>
      </div>
    </div>
  );
};

export default HistoryWrapper;
