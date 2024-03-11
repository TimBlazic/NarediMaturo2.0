import { getSession, getUserDetails } from '@/app/supabase-server';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import supabase from 'utils/supabaseClient';

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="container mx-auto flex justify-center my-32 text-center">
        <Link
          href="/"
          className="h-10 px-4 rounded-xl m-5 bg-white border font-bold border-transparent text-black text-sm flex items-center justify-center transition duration-300 hover:bg-gray-800 hover:text-white"
        >
          Domača stran
        </Link>
        <Link
          href="/signin"
          className="h-10 px-4 rounded-xl m-5 bg-black border font-bold border-transparent text-white text-sm flex items-center justify-center transition duration-300 hover:bg-gray-800 hover:text-white"
        >
          Prijavi se
        </Link>
      </div>
    );
  }

  const userDetails = await getUserDetails(session.user.id);

  const { data: tests, error: errorAll } = await supabase
    .from('tests')
    .select('count', { count: 'exact' })
    .eq('user_id', session.user.id);

  if (errorAll) {
    console.error('Error fetching all testdata:', errorAll);
    return (
      <div className="container mx-auto text-center">
        Error fetching all testdata
      </div>
    );
  }

  const testCount = tests[0]?.count || 0;

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const { data: testsToday, error: errorToday } = await supabase
    .from('tests')
    .select('date')
    .eq('user_id', session.user.id)
    .gte('date', startOfToday.toISOString().split('T')[0]);

  if (errorToday) {
    console.error("Error fetching today's testdata:", errorToday);
    return (
      <div className="container mx-auto text-center">
        Error fetching today's testdata
      </div>
    );
  }

  const testCountToday = testsToday.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Dobrodošel,{' '}
        <span className="font-bold text-blue-500 dark:text-blue-500">
          {userDetails?.full_name}
        </span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="selection"
          passHref
          className="block bg-white rounded-lg shadow-md py-12 px-8 text-center text-xl font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
        >
          Reši test
        </Link>
        <Link
          href="history"
          passHref
          className="block bg-white rounded-lg shadow-md py-12 px-8 text-center text-xl font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
        >
          Preglej zgodovino
        </Link>
        <Link
          href=""
          passHref
          aria-disabled
          className="block bg-white rounded-lg shadow-md py-12 px-8 text-center text-xl font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
        >
          AI inštruktor
        </Link>
        <Link
          href=""
          passHref
          className="block bg-white rounded-lg shadow-md py-12 px-8 text-center text-xl font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
        >
          Ustvari pdf datoteko
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Statistika</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center">
            <p className="text-lg font-semibold mb-2">
              Število rešenih vseh testov
            </p>
            <p className="text-4xl font-bold">{testCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center">
            <p className="text-lg font-semibold mb-2">
              Število rešenih testov danes
            </p>
            <p className="text-4xl font-bold">{testCountToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
