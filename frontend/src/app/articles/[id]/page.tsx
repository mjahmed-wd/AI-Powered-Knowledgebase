'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Article } from '@/components/articles';

// Mock data - this will be replaced with API calls later
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with React Hooks',
    body: `React Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class. In this comprehensive guide, we will explore the most commonly used hooks and how they can improve your React development workflow.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes — they let you use React without classes.

## useState Hook

The useState hook is the most basic hook that allows you to add state to functional components. Here's a simple example:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Custom Hooks

Building your own hooks lets you extract component logic into reusable functions. A custom hook is a JavaScript function whose name starts with "use" and that may call other hooks.

## Conclusion

React Hooks provide a more direct API to the React concepts you already know. They offer a powerful and expressive way to reuse stateful logic between components.`,
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
    body: `TypeScript generics provide a way to make components work with any data type and not restrict to one data type. So, components can be called or used with a variety of data types. Generics in TypeScript is almost similar to C# generics.

## What are Generics?

Generics allow you to create reusable components that can work with different types while maintaining type safety. Instead of using any, generics preserve the type information.

## Basic Generic Functions

Here's a simple example of a generic function:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
let output2 = identity<number>(42);
\`\`\`

## Generic Interfaces

You can also create generic interfaces:

\`\`\`typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
\`\`\`

## Generic Classes

Classes can also use generics:

\`\`\`typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
\`\`\`

## Conclusion

Generics are a powerful feature that help you write flexible, reusable, and type-safe code in TypeScript.`,
    author: {
      id: '2',
      name: 'Jane Smith'
    },
    tags: ['TypeScript', 'Programming', 'Development'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  }
];

export default function ArticleDetail() {
  const params = useParams();
  const articleId = params.id as string;
  
  // In a real app, you would fetch the article based on the ID
  const article = mockArticles.find(a => a.id === articleId);
  const [isOwner] = useState(articleId === '1'); // Mock: user owns article with id '1'

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this article?')) {
      // TODO: Call API to delete article
      console.log('Deleting article:', articleId);
      // Redirect to dashboard after deletion
      window.location.href = '/dashboard';
    }
  };

  const handleSummarize = () => {
    // TODO: Implement summarization
    console.log('Summarizing article:', articleId);
    alert('Summarization feature will be implemented when connected to the API.');
  };

  // Convert markdown-like content to HTML (basic implementation)
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              {paragraph.substring(3)}
            </h2>
          );
        }
        if (paragraph.startsWith('```')) {
          const code = paragraph.replace(/```\w*\n?/g, '');
          return (
            <pre key={index} className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4">
              <code className="text-sm">{code}</code>
            </pre>
          );
        }
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {paragraph}
          </p>
        );
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to articles
          </Link>
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <header className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center text-gray-600">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium">
                    {article.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{article.author.name}</p>
                  <p className="text-sm text-gray-500">
                    Published on {formatDate(article.createdAt)}
                  </p>
                </div>
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSummarize}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Summarize Article
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Article
                  </Button>
                </div>
              )}
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="prose prose-lg max-w-none">
              {formatContent(article.body)}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockArticles
              .filter(a => a.id !== articleId)
              .slice(0, 2)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/articles/${relatedArticle.id}`}
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    By {relatedArticle.author.name} • {formatDate(relatedArticle.createdAt)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {relatedArticle.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
