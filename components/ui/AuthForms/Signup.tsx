'use client';

import Button from '@/components/ui/Button';
import { handleRequest } from '@/utils/auth-helpers/client';
import { signUp } from '@/utils/auth-helpers/server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const userData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <Toaster />
      <form noValidate={true} className="mb-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md border border-gray-300"
            />
            <label htmlFor="password">Geslo</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md border border-gray-300"
            />
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1 bg-black text-white hover:bg-white hover:text-black duration-300"
            loading={isSubmitting}
          >
            Registriraj se
          </Button>
        </div>
      </form>
      <p>
        <Link href="/signin/password_signin" className="font-light text-sm">
          Že imaš račun? <span className="font-bold">Prijavi se.</span>
        </Link>
      </p>
    </div>
  );
}
