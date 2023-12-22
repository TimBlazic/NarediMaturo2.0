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
    <div className="flex h-screen">
      <div className="bg-white w-1/3 m-5 h-1/2 py-8 flex flex-col items-center justify-center border border-white rounded-xl">
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
          className="text-gray-500 mt-2 hover:text-gray-700 border rounded-xl py-2 px-10 focus:outline-none focus:text-gray-700"
        >
          Profil
        </Link>
      </div>
      <div className="bg-white w-1/4 m-5 h-1/4 py-8 flex flex-col items-center justify-center border border-white rounded-xl">
        <Link
          href="/pages/selection"
          passHref
          className="bg-white text-black h-1 w-1/5 py-24 text-center text-2xl m-5 font-bold uppercase items-center justify-center"
        >
          Kviz
        </Link>
      </div>
    </div>
  );
}
