import Logo from '@/components/icons/Logo';
import EmailSignIn from '@/components/ui/AuthForms/EmailSignIn';
import ForgotPassword from '@/components/ui/AuthForms/ForgotPassword';
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import PasswordSignIn from '@/components/ui/AuthForms/PasswordSignIn';
import Separator from '@/components/ui/AuthForms/Separator';
import SignUp from '@/components/ui/AuthForms/Signup';
import UpdatePassword from '@/components/ui/AuthForms/UpdatePassword';
import Card from '@/components/ui/Card';
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
  getRedirectMethod
} from '@/utils/auth-helpers/settings';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignIn({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { disable_button: boolean };
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView =
      cookies().get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <h1 className="text-6xl font-extrabold">
            Naredi
            <span className="text-blue-500 dark:text-blue-500">Maturo</span>
          </h1>
        </div>
        <Card
          title={
            viewProp === 'forgot_password'
              ? 'Pozabljeno geslo'
              : viewProp === 'update_password'
              ? 'Posodobi geslo'
              : viewProp === 'signup'
              ? 'Registriraj se'
              : 'Prijavi se'
          }
        >
          {viewProp === 'password_signin' && (
            <PasswordSignIn
              allowEmail={allowEmail}
              redirectMethod={redirectMethod}
            />
          )}
          {viewProp === 'email_signin' && (
            <EmailSignIn
              allowPassword={allowPassword}
              redirectMethod={redirectMethod}
              disableButton={searchParams.disable_button}
            />
          )}
          {viewProp === 'forgot_password' && (
            <ForgotPassword
              allowEmail={allowEmail}
              redirectMethod={redirectMethod}
              disableButton={searchParams.disable_button}
            />
          )}
          {viewProp === 'update_password' && (
            <UpdatePassword redirectMethod={redirectMethod} />
          )}
          {viewProp === 'signup' && (
            <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
          )}
        </Card>
      </div>
    </div>
  );
}
