"use client";

import { getAllTagsSimple } from "@/services/tagService";
import { Tag } from "@/types/api";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";

interface SearchFormData {
  searchTerm: string;
  authorId: string;
  tagIds: string[];
}

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
  initialValues?: Partial<SearchFormData>;
  loading?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  initialValues = {},
  loading = false,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const tagsResponse = await getAllTagsSimple();

        setTags(tagsResponse);
      } catch (error) {
        console.error("Error loading search form data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const defaultValues: SearchFormData = {
    searchTerm: "",
    authorId: "",
    tagIds: [],
    ...initialValues,
  };

  const handleSubmit = (
    values: SearchFormData,
    { setSubmitting }: FormikHelpers<SearchFormData>
  ) => {
    onSearch(values);
    setSubmitting(false);
  };

  const handleClear = (resetForm: () => void) => {
    resetForm();
    onSearch(defaultValues);
    setShowFilters(false);
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span>Loading search options...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Articles
        </h2>
      </div>

      <div className="p-6">
        <Formik
          initialValues={defaultValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, resetForm }) => (
            <Form className="space-y-6">
              <div className="relative">
                <div className="flex items-center bg-gray-50 rounded-lg border-2 border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => handleClear(resetForm)}
                    disabled={isSubmitting || loading}
                    className="p-3 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <Field name="searchTerm">
                    {({ field }: FieldProps) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Search articles by title or content..."
                        className="flex-1 bg-transparent px-2 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                    )}
                  </Field>

                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Search"
                  >
                    {isSubmitting || loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-3 ml-1 rounded-lg transition-colors ${
                      showFilters 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title="Toggle filters"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-100 animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Filter by Tags
                      {values.tagIds.length > 0 && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {values.tagIds.length} selected
                        </span>
                      )}
                    </h3>
                    {values.tagIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFieldValue("tagIds", [])}
                        className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                    {tags.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        No tags available
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {tags.map((tag) => (
                          <label
                            key={tag.id}
                            className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={values.tagIds.includes(tag.id)}
                                onChange={(e) => {
                                  const newTagIds = e.target.checked
                                    ? [...values.tagIds, tag.id]
                                    : values.tagIds.filter((id) => id !== tag.id);
                                  setFieldValue("tagIds", newTagIds);
                                }}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                              />
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors flex-1">
                              {tag.name}
                            </span>
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
