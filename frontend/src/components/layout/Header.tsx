'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be managed by auth context later

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // TODO: Implement logout
      setIsLoggedIn(false);
    } else {
      // TODO: Navigate to login
      console.log('Navigate to login');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Knowledge Base</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isLoggedIn && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
                <Link href="/articles/new" className="text-gray-700 hover:text-gray-900 font-medium">
                  Write Article
                </Link>
              </>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center space-x-4">
            {/* Auth Button */}
            <Button
              onClick={handleAuthAction}
              variant={isLoggedIn ? 'outline' : 'primary'}
            >
              {isLoggedIn ? 'Logout' : 'Sign In'}
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
