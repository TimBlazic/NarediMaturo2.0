import { getSession, getUserDetails } from '@/app/supabase-server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import supabase from 'utils/supabaseClient';

export default async function Dashboard() {
  const session = await getSession();
  const userDetails = await getUserDetails();

  if (!session) {
    return redirect('/');
  }

  const { data: tests, error: errorAll } = await supabase
    .from('tests')
    .select('count', { count: 'exact' })
    .eq('user_id', session?.user.id);

  if (errorAll) {
    console.error('Error fetching all testdata:', errorAll);
    return (
      <div className="container mx-auto text-center">
        Error fetching all testdata
      </div>
    );
  }
  console.log(tests);

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
    .eq('user_id', session?.user.id)
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

  // Fetching all test subjects and their counts
  const { data: testSubjectsCounts, error: errorSubjectsCounts } =
    await supabase
      .from('tests')
      .select('subject')
      .eq('user_id', session?.user.id);

  if (errorSubjectsCounts) {
    console.error('Error fetching test subjects counts:', errorSubjectsCounts);
    return (
      <div className="container mx-auto text-center">
        Error fetching test subjects counts
      </div>
    );
  }

  // Count occurrences of each test subject
  const subjectCounts: { [key: string]: number } = {};
  testSubjectsCounts.forEach((test: { subject: string }) => {
    const subject = test.subject;
    subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
  });

  // Find subject with maximum count
  let mostFrequentSubject = 'Ni predmetov';
  let maxCount = 0;
  for (const subject in subjectCounts) {
    if (subjectCounts.hasOwnProperty(subject)) {
      if (subjectCounts[subject] > maxCount) {
        mostFrequentSubject = subject;
        maxCount = subjectCounts[subject];
      }
    }
  }

  return (
    <div className="bg-container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-7xl font-bold mb-6 text-center">
        Dobrodošli{' '}
        <span
          id="user-name"
          className="font-bold text-blue-500 dark:text-blue-500"
        >
          {userDetails?.full_name}
        </span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <Link
          href="selection"
          passHref
          className="border border-gray-300 h-10 px-12 py-28 rounded-xl m-5 bg-white font-bold shadow-md text-black text-3xl flex items-center justify-center transition duration-300 hover:bg-black hover:text-white"
        >
          Reši test
        </Link>
        <Link
          href="history"
          passHref
          className="h-10 px-12 py-28 rounded-xl m-5 bg-black border border-gray-300 font-bold  shadow-md text-white text-3xl flex items-center justify-center transition duration-300 hover:bg-white hover:text-black"
        >
          Preglej zgodovino
        </Link>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center border border-gray-300">
            <p className="text-lg font-semibold mb-2">
              Število rešenih vseh testov
            </p>
            <p className="text-4xl font-bold">{testCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center border border-gray-300">
            <p className="text-lg font-semibold mb-2">
              Število rešenih testov danes
            </p>
            <p className="text-4xl font-bold">{testCountToday}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center border border-gray-300">
            <p className="text-lg font-semibold mb-2">
              Največkrat rešen predmet
            </p>
            <p className="text-4xl font-bold">{mostFrequentSubject}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
