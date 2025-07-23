'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArticleList, Article } from '@/components/articles';
import { Button } from '@/components/ui';

// Mock data for user's articles
const mockUserArticles: Article[] = [
  {
    id: '1',
    title: 'My First Article on React Hooks',
    body: 'This is my comprehensive guide on React Hooks. I cover useState, useEffect, and custom hooks with practical examples.',
    author: {
      id: 'current-user',
      name: 'You'
    },
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    title: 'Building APIs with Node.js',
    body: 'In this article, I share my experience building scalable APIs with Node.js and Express.',
    author: {
      id: 'current-user',
      name: 'You'
    },
    tags: ['Node.js', 'API', 'Backend'],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  }
];

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>(mockUserArticles);

  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter(article => article.id !== id));
      // TODO: Call API to delete article
      console.log('Deleting article:', id);
    }
  };

  const handleSummarizeArticle = (id: string) => {
    // TODO: Implement summarization
    console.log('Summarizing article:', id);
    alert('Summarization feature will be implemented when connected to the API.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Manage your articles and track your writing progress
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/articles/new">
                <Button size="lg" className="w-full sm:w-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write New Article
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Articles</h2>
            <p className="mt-1 text-gray-600">Articles you&apos;ve published on the platform</p>
          </div>
          <div className="p-6">
            <ArticleList
              articles={articles}
              showActions={true}
              onDelete={handleDeleteArticle}
              onSummarize={handleSummarizeArticle}
              emptyMessage="You haven&apos;t published any articles yet. Start writing your first article!"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/articles/new">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Create Article</h4>
                    <p className="text-sm text-gray-600">Write and publish a new article</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Browse Articles</h4>
                    <p className="text-sm text-gray-600">Explore articles from the community</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
