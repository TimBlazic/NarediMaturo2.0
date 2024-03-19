'use client';

import s from './Navbar.module.css';
import { useSupabase } from '@/app/supabase-provider';
import { useEffect, useState, useRef } from 'react';

export default function SignOutButton({ userId }: { userId: string }) {
  const { supabase } = useSupabase();
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Function to fetch user's name
  useEffect(() => {
    async function fetchUserName() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', userId)
          .single();

        if (error) {
          throw error;
        }

        if (data && 'full_name' in data) {
          setUserName(
            (data as { full_name: string } | null)?.full_name || null
          );
        } else {
          setUserName(null);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    }

    fetchUserName();
  }, [supabase, userId]);

  // Function to handle sign-out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Function to toggle dropdown visibility
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // Event listener to hide dropdown menu when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`${s.link} font-bold py-2 px-4 rounded-md shadow-inner-lg`}
        onClick={handleDropdownToggle} // Toggle dropdown on button click
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="black"
          className="bi bi-person-circle"
          viewBox="0 0 16 16"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <div className="py-2">
            <p className="block px-4 py-2 text-sm text-gray-70 hover:cursor-pointer">
              Prijavljen kot: <br></br>
              <span className="font-semibold">{userName}</span>
            </p>
            <hr></hr>
            <a
              href="/account"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Račun
            </a>
            <hr></hr>
            <a
              onClick={handleSignOut}
              href=""
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Odjavi se
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
