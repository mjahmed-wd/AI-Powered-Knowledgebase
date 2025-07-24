'use client';

import { Button } from '@/components/ui';
import { AppDispatch, RootState } from '@/store';
import { signOutUser } from '@/store/slices/authThunks';
import notify from '@/utils/notify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Header: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      // Logout user
      try {
        await dispatch(signOutUser()).unwrap();
        notify.success('Logged out successfully. See you next time!');
        router.push('/');
      } catch (error: unknown) {
        console.error('Logout error:', error);
        notify.error('Logout failed. Please try again.');
      }
    } else {
      // Navigate to login
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Knowledge Base</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
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

          <div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <span className="text-sm text-gray-700 hidden sm:block">
                Welcome, {user.name}
              </span>
            )}
            
            <Button
              onClick={handleAuthAction}
              variant={isAuthenticated ? 'outline' : 'primary'}
            >
              {isAuthenticated ? 'Logout' : 'Sign In'}
            </Button>

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
