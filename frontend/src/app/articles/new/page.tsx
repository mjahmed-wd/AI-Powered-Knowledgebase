'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, TagSelector } from '@/components/ui';
import { createArticle } from '@/services/articleService';
import { Tag } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import { notify } from '@/utils/notify';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(10, 'Title must be at least 10 characters'),
  body: Yup.string()
    .required('Article content is required')
    .min(100, 'Article content must be at least 100 characters'),
  tagIds: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one tag')
    .required('Please select at least one tag')
});

interface FormValues {
  title: string;
  body: string;
  tagIds: string[];
  submit?: string;
}

export default function CreateArticle() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const initialValues: FormValues = {
    title: '',
    body: '',
    tagIds: []
  };

  const handleSubmit = async (values: FormValues, { setSubmitting, setFieldError }: FormikHelpers<FormValues>) => {
    try {
      const articleData = {
        title: values.title.trim(),
        body: values.body.trim(),
        tagIds: values.tagIds
      };

      await createArticle(articleData);
      notify.success('Article published successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Create article error:', error);
      setFieldError('submit', 'An error occurred while creating the article. Please try again.');
      notify.error('Failed to publish article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTagsChange = (tags: Tag[], setFieldValue: (field: string, value: string[]) => void) => {
    setSelectedTags(tags);
    setFieldValue('tagIds', tags.map(tag => tag.id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to create an article</h2>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Write New Article</h1>
              <p className="mt-1 text-gray-600">Share your knowledge with the community</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                    Article Title
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter a compelling title for your article"
                    className={`
                      block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 text-lg
                      focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${errors.title && touched.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                  />
                  {errors.title && touched.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="body">
                    Article Content
                  </label>
                  <Field
                    as="textarea"
                    id="body"
                    name="body"
                    rows={20}
                    placeholder="Write your article content here... You can use Markdown syntax for formatting."
                    className={`
                      block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                      focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${errors.body && touched.body ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                  />
                  {errors.body && touched.body && (
                    <p className="mt-1 text-sm text-red-600">{errors.body}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <TagSelector
                    selectedTags={selectedTags}
                    onTagsChange={(tags) => handleTagsChange(tags, setFieldValue)}
                    placeholder="Search or create tags for your article..."
                    className="mt-1"
                  />
                  {errors.tagIds && touched.tagIds && (
                    <p className="mt-1 text-sm text-red-600">{errors.tagIds}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Add relevant tags to help others discover your article. You can select existing tags or create new ones.
                  </p>
                  
                  {selectedTags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-2">Selected tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Publish Article
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Are you sure you want to discard this article?')) {
                        router.push('/dashboard');
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
