'use client';

import s from './Navbar.module.css';
import { useSupabase } from '@/app/supabase-provider';
import { useEffect, useState, useRef } from 'react';

export default function SignOutButton({ userId }: { userId: string }) {
  const { supabase } = useSupabase();
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
  const [userName, setUserName] = useState<string | null>(null); // State to store user's name
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to dropdown menu

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

        setUserName(data?.full_name || null);
      } catch (error) {
        console.error('Error fetching user name:', error.message);
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
      {/* Profile picture button */}
      <button
        className={`${s.link} font-bold py-2 px-4 rounded-md shadow-inner-lg`}
        onClick={handleDropdownToggle} // Toggle dropdown on button click
      >
        <img src="user.png" alt="Profile" className="w-10 h-10 rounded-full" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow">
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
            <a
              href="/support"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Pomoč
            </a>
            <hr></hr>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              Odjavi se
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
