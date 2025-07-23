'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArticleList, Article } from '@/components/articles';
import { Button } from '@/components/ui';

// Mock data - this will be replaced with API calls later
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with React Hooks',
    body: 'React Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class. In this comprehensive guide, we will explore the most commonly used hooks and how they can improve your React development workflow.',
    author: {
      id: '1',
      name: 'John Doe'
    },
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Understanding TypeScript Generics',
    body: 'TypeScript generics provide a way to make components work with any data type and not restrict to one data type. So, components can be called or used with a variety of data types. Generics in TypeScript is almost similar to C# generics.',
    author: {
      id: '2',
      name: 'Jane Smith'
    },
    tags: ['TypeScript', 'Programming', 'Development'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Building Scalable APIs with Node.js',
    body: 'Node.js has become one of the most popular platforms for building scalable network applications. In this article, we will explore best practices for building robust APIs that can handle high traffic and complex business logic.',
    author: {
      id: '3',
      name: 'Mike Johnson'
    },
    tags: ['Node.js', 'API', 'Backend', 'JavaScript'],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'CSS Grid Layout Complete Guide',
    body: 'CSS Grid Layout is a two-dimensional layout method for web pages. It allows you to layout items in rows and columns, and it has many features that make building complex responsive layouts straightforward.',
    author: {
      id: '4',
      name: 'Sarah Wilson'
    },
    tags: ['CSS', 'Frontend', 'Web Design'],
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z'
  },
  {
    id: '5',
    title: 'Introduction to Machine Learning',
    body: 'Machine Learning is a subset of artificial intelligence that focuses on the development of algorithms and statistical models that enable computers to improve their performance on a specific task through experience.',
    author: {
      id: '5',
      name: 'David Brown'
    },
    tags: ['Machine Learning', 'AI', 'Data Science'],
    createdAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z'
  },
  {
    id: '6',
    title: 'Modern Database Design Principles',
    body: 'Database design is the process of structuring a database in a way that meets the requirements of users and provides optimal performance. This article covers the fundamental principles of modern database design.',
    author: {
      id: '6',
      name: 'Emily Davis'
    },
    tags: ['Database', 'SQL', 'Backend'],
    createdAt: '2024-01-10T16:30:00Z',
    updatedAt: '2024-01-10T16:30:00Z'
  }
];

export default function Home() {
  const [articles] = useState<Article[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get all unique tags
  const allTags = Array.from(
    new Set(mockArticles.flatMap(article => article.tags))
  ).sort();

  // Filter articles based on search query and selected tags
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => article.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically through filteredArticles
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between max-w-7xl">
          {/* Content Side */}
          <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
            <h1 className="text-5xl font-bold leading-none sm:text-6xl text-gray-900">
              Share Your{" "}
              <span className="text-blue-600">Knowledge</span>{" "}
              With The World
            </h1>
            <p className="mt-6 mb-8 text-lg sm:mb-12 text-gray-600 leading-relaxed">
              Join our community of experts and passionate writers. Create insightful articles,
              <br className="hidden md:inline lg:hidden" />
              share tutorials, and help others learn from your expertise.
            </p>
            <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
              <Button
                size="lg"
                className="px-8 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => window.location.href = '/articles/new'}
              >
                Start Writing
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  document.getElementById('articles-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Explore Articles
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-gray-600 text-sm">Articles Published</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-gray-600 text-sm">Expert Authors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600 mb-1">10k+</div>
                <div className="text-gray-600 text-sm">Monthly Readers</div>
              </div>
            </div>
          </div>
          
          {/* Illustration Side */}
          <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
            <Image 
              src="/business-svg.svg" 
              alt="Knowledge sharing illustration" 
              width={500}
              height={500}
              className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128 animate-fade-in-right"
            />
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search articles, tutorials, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Filter Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filter by Tags</h3>
              <div className="flex items-center gap-3">
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all filters
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  Filter Tags
                  {selectedTags.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedTags.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Selected:</span>
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Options */}
            {isFilterOpen && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {allTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-white rounded p-2 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="bg-gray-50 py-16" id="articles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover insights, tutorials, and expert knowledge from our community of writers
            </p>
          </div>

          {/* Results Summary */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              {filteredArticles.length === mockArticles.length
                ? `Showing all ${filteredArticles.length} articles`
                : `Found ${filteredArticles.length} of ${mockArticles.length} articles`}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
            </p>
          </div>

          {/* Articles Grid */}
          <ArticleList
            articles={filteredArticles}
            emptyMessage="No articles match your search criteria. Try adjusting your search terms or selected tags."
          />
        </div>
      </section>
    </div>
  );
}
