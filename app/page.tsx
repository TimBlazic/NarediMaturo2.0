'use client';

import { TypewriterEffect } from '../components/ui/typewriter-effect';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: 'Naredi'
    },
    {
      text: 'Maturo.',
      className: 'text-blue-500 dark:text-blue-500'
    }
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center scroll-smooth mt-10 md:mt-40 top-40">
        <p className="text-neutral-600 dark:text-neutral-200 text-base mb-6 md:mb-10 text-center px-6">
          Odgovori na vsa vprašanja iz prejšnji matur.
        </p>
        <TypewriterEffect words={words} />
        <div className="flex flex-col space-y-6 items-center">
          <Link
            href="/signin"
            className="h-10 px-4 rounded-xl bg-black border font-bold border-transparent text-white text-sm flex items-center justify-center transition duration-300 hover:bg-gray-800 hover:text-white"
          >
            Pridruži se
          </Link>

          <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-6 md:mb-0">
            <div className="animate-bounce justify-center items-center flex mt-80">
              <svg
                width="48"
                height="48"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
                className="mt-28"
              >
                <path d="M24 12c0-6.623-5.377-12-12-12s-12 5.377-12 12 5.377 12 12 12 12-5.377 12-12zm-1 0c0-6.071-4.929-11-11-11s-11 4.929-11 11 4.929 11 11 11 11-4.929 11-11zm-11.5 4.828l-3.763-4.608-.737.679 5 6.101 5-6.112-.753-.666-3.747 4.604v-11.826h-1v11.828z" />
              </svg>
            </div>
            <div className="flex flex-col items-center justify-between rounded-lg p-6">
              <h2 className="text-lg md:text-3xl font-bold mb-2 text-center">
                Na izbiro imaš{' '}
                <span className="text-blue-500 dark:text-blue-500">
                  20 različnih
                </span>{' '}
                predmetov.
              </h2>
              <div className="w-full flex justify-center">
                <img
                  src="ss_landing_page/predmeti.png"
                  alt="dashboard image"
                  className="object-cover rounded-lg mb-4 w-full"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-6 md:mb-0">
            <div className="flex flex-col items-center justify-between rounded-lg p-6">
              <h2 className="text-lg md:text-3xl font-bold mb-2 text-center">
                Preveri zgodovino{' '}
                <span className="text-blue-500 dark:text-blue-500">
                  rešenih
                </span>{' '}
                testov.
              </h2>
              <div className="w-full flex justify-center">
                <img
                  src="ss_landing_page/zgodovina2.png"
                  alt="dashboard image"
                  className="object-cover rounded-lg mb-4 w-full"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-6 md:mb-0">
            <div className="flex flex-col items-center justify-between rounded-lg p-6">
              <h2 className="text-lg md:text-3xl font-bold mb-2 text-center">
                Preglej{' '}
                <span className="text-blue-500 dark:text-blue-500">
                  rezultate
                </span>{' '}
                rešenih testov.
              </h2>
              <div className="w-full flex justify-center">
                <img
                  src="ss_landing_page/rezultati2.png"
                  alt="dashboard image"
                  className="object-cover rounded-lg mb-4 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default TypewriterEffectSmoothDemo;
