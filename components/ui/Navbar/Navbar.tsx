import s from './Navbar.module.css';
import SignOutButton from './SignOutButton';
import { createServerSupabaseClient, getSession } from '@/app/supabase-server';
import supabase from '@/utils/supabaseClient';
import { Session } from 'inspector';
import Link from 'next/link';

export default async function Navbar() {
  const session = await getSession();
  const userId = session?.user.id;

  console.log(userId);

  return (
    <nav className={s.root}>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex text-3xl font-bold items-center flex-1">
            {userId ? (
              <Link href="/dashboard" className={s.logo} aria-label="Logo">
                Naredi
                <span className="text-blue-500 dark:text-blue-500">Maturo</span>
              </Link>
            ) : (
              <Link href="/" className={s.logo} aria-label="Logo">
                Naredi
                <span className="text-blue-500 dark:text-blue-500">Maturo</span>
              </Link>
            )}
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {userId ? <SignOutButton userId={userId} /> : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
