'use client';

import Button from '../Button';
import { handleRequest } from '@/utils/auth-helpers/client';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod
}: PasswordSignInProps) {
  const router = useRouter(); // Always call useRouter
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
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
            className="mt-1 border border-gray-300 bg-black text-white hover:bg-white hover:text-black"
            loading={isSubmitting}
          >
            Prijavi se
          </Button>
        </div>
      </form>
      <p>
        <Link href="/signin/signup" className="font-light text-sm">
          Nimaš računa? <span className="font-bold">Registriraj se.</span>
        </Link>
      </p>
    </div>
  );
}
