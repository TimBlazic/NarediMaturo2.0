'use client';

import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center scroll-smooth mt-10 md:mt-40 top-40">
        <p className="text-neutral-600 dark:text-neutral-200 text-base mb-6 md:mb-10 text-center px-6">
          Odgovori na vsa vprašanja iz prejšnji matur.
        </p>
        <h1 className="text-6xl font-extrabold">
          Naredi{' '}
          <span className="text-blue-500 dark:text-blue-500">Maturo.</span>
        </h1>
        <div className="flex flex-col space-y-6 items-center mt-5">
          <Link
            href="/signin"
            className="h-10 px-4 rounded-xl bg-black border font-bold border-transparent text-white text-sm flex items-center justify-center transition duration-300 hover:bg-gray-800 hover:text-white"
          >
            Pridruži se
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
