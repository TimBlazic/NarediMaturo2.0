import { getSession, getUserDetails } from '@/app/supabase-server';
import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Account() {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails()
  ]);

  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  }

  const updateName = async (formData: FormData) => {
    'use server';

    const user = session?.user;
    const newName = formData.get('name') as string;
    const supabase = createServerActionClient<Database>({ cookies });

    const { error } = await supabase
      .from('users')
      .update({ full_name: newName })
      .eq('id', user?.id);
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  return (
    <section className="mb-32">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl">
            Profil
          </h1>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Ime"
          description="Vnesi svoje polno ime."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">največ 64 znakov</p>
              <Button
                variant="slim"
                type="submit"
                form="nameForm"
                disabled={true}
              >
                Posodobi Ime
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="nameForm" action={updateName}>
              <input
                type="text"
                name="name"
                className="w-1/2 p-3 rounded-md"
                defaultValue={userDetails?.full_name ?? ''}
                placeholder="Tvoje ime"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
        <Card
          title="Mail"
          description="Vnesi svoj e-naslov za prijavo v račun."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">Poslali ti bomo mail za potrditev.</p>
              <Button
                variant="slim"
                type="submit"
                form="emailForm"
                disabled={true}
              >
                Posodobi Mail
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="emailForm" action={updateEmail}>
              <input
                type="text"
                name="email"
                className="w-1/2 p-3 rounded-md"
                defaultValue={user ? user.email : ''}
                placeholder="Your email"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700">{footer}</div>
    </div>
  );
}
