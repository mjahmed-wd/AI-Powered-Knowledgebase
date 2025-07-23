'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArticleList, Article } from '@/components/articles';
import { Button } from '@/components/ui';
import { getMyArticles, deleteArticle, summarizeArticle } from '@/services/articleService';
import { Article as APIArticle } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import { notify } from '@/utils/notify';

// Helper function to convert API Article to Component Article
const convertAPIArticleToComponentArticle = (apiArticle: APIArticle): Article => ({
  id: apiArticle.id,
  title: apiArticle.title,
  body: apiArticle.content,
  author: {
    id: apiArticle.authorId,
    name: apiArticle.author?.name || 'Unknown Author'
  },
  tags: apiArticle.tags?.map(tag => tag.name) || [],
  createdAt: apiArticle.createdAt,
  updatedAt: apiArticle.updatedAt
});

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Load user's articles on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadMyArticles();
    }
  }, [isAuthenticated]);

  const loadMyArticles = async () => {
    try {
      setIsLoading(true);
      const userArticles = await getMyArticles();
      const convertedArticles = userArticles.map(convertAPIArticleToComponentArticle);
      setArticles(convertedArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
      notify.error('Failed to load your articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteArticle(id);
      setArticles(articles.filter(article => article.id !== id));
      notify.success('Article deleted successfully');
    } catch (error) {
      console.error('Delete article error:', error);
      notify.error('Failed to delete article. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSummarizeArticle = async (id: string) => {
    try {
      setIsSummarizing(id);
      const summary = await summarizeArticle(id);
      
      // Show summary in a modal or alert for now
      alert(`Article Summary:\n\n${summary.summary}`);
      notify.success('Article summarized successfully');
    } catch (error) {
      console.error('Summarize article error:', error);
      notify.error('Failed to summarize article. Please try again.');
    } finally {
      setIsSummarizing(null);
    }
  };

  // Show loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h2>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading your articles...</span>
                </div>
              </div>
            ) : (
              <ArticleList
                articles={articles}
                showActions={true}
                onDelete={handleDeleteArticle}
                onSummarize={handleSummarizeArticle}
                emptyMessage="You haven&apos;t published any articles yet. Start writing your first article!"
                isDeleting={isDeleting}
                isSummarizing={isSummarizing}
              />
            )}
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
