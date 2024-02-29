import { getSession, getUserDetails } from '@/app/supabase-server';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const getRandomProfilePicture = () => {
  const profilePictures = ['idk_pfp.jpeg'];
  const randomIndex = Math.floor(Math.random() * profilePictures.length);
  return profilePictures[randomIndex];
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    return <div>You are not authenticated. Please log in.</div>;
  }

  const { data, error } = await supabase
    .from('users')
    .select('full_name')
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Error fetching user data:', error);
    return <div>Error fetching user data</div>;
  }

  const userDetails = await getUserDetails();
  const fullName = userDetails?.full_name && userDetails.full_name;

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="bg-white shadow-lg lg:w-1/3 lg:m-auto m-5 p-8 rounded-xl flex flex-col items-center justify-center border border-gray-200">
        <div className="mb-6">
          <img
            className="w-32 h-32 object-cover rounded-full"
            src={getRandomProfilePicture()}
            alt="Profile"
          />
        </div>
        <h2 className="text-lg text-gray-800 font-bold">{fullName}</h2>
        <Link
          href="/account"
          className="text-gray-500 mt-2 hover:text-gray-700 border border-gray-200 shadow-md rounded-lg py-2 px-6 focus:outline-none focus:text-gray-700"
        >
          Profil
        </Link>
      </div>
      <div className="bg-white shadow-lg lg:w-1/3 lg:m-auto m-5 p-8 rounded-xl flex flex-col items-center justify-center border border-gray-200">
        <Link
          href="/selection"
          passHref
          className="bg-white text-black h-20 w-20 py-5 text-center text-2xl m-5 font-bold uppercase rounded-lg focus:outline-none focus:text-gray-700"
        >
          Kviz
        </Link>
      </div>
    </div>
  );
}
