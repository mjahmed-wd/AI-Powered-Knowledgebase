"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArticleList, SearchForm } from "@/components/articles";
import { Article, PaginatedResponse, ArticleSearchRequest } from "@/types/api";
import { Button } from "@/components/ui";
import { searchArticles, getLatestArticles } from "@/services/articleService";

interface SearchFormData {
  searchTerm: string;
  authorId: string;
  tagIds: string[];
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchInitialArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLatestArticles(12);
        setArticles(response || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch articles"
        );
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialArticles();
  }, []);

  const handleSearch = async (searchData: SearchFormData) => {
    try {
      setSearchLoading(true);
      setError(null);
      setHasSearched(true);
      const searchBody: Partial<ArticleSearchRequest> = {};
      if (searchData.searchTerm.trim()) {
        searchBody.searchTerm = searchData.searchTerm.trim();
      }
      if (searchData.tagIds.length > 0) {
        searchBody.tagIds = searchData.tagIds;
      }

      const paginationParams = {
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
      };

      const response: PaginatedResponse<Article> = await searchArticles(
        searchBody,
        paginationParams
      );

      setArticles(response.data || []);
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setArticles([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (pagination.page >= pagination.totalPages) return;

    try {
      setSearchLoading(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more articles"
      );
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="bg-white">
        <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between max-w-7xl">
          <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
            <h1 className="text-5xl font-bold leading-none sm:text-6xl text-gray-900">
              Share Your <span className="text-blue-600">Knowledge</span> With
              The World
            </h1>
            <p className="mt-6 mb-8 text-lg sm:mb-12 text-gray-600 leading-relaxed">
              Join our community of experts and passionate writers. Create
              insightful articles,
              <br className="hidden md:inline lg:hidden" />
              share tutorials, and help others learn from your expertise.
            </p>
            <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
              <Button
                size="lg"
                className="px-8 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => (window.location.href = "/articles/new")}
              >
                Start Writing
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  document.getElementById("articles-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Explore Articles
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  500+
                </div>
                <div className="text-gray-600 text-sm">Articles Published</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-gray-600 text-sm">Expert Authors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  10k+
                </div>
                <div className="text-gray-600 text-sm">Monthly Readers</div>
              </div>
            </div>
          </div>

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

      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchForm onSearch={handleSearch} loading={searchLoading} />
        </div>
      </section>

      <section className="bg-gray-50 py-16" id="articles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {hasSearched ? "Search Results" : "Latest Articles"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {hasSearched
                ? `Found ${pagination.total} article${
                    pagination.total !== 1 ? "s" : ""
                  } matching your search`
                : "Discover insights, tutorials, and expert knowledge from our community of writers"}
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Failed to load articles
                </h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <ArticleList
                articles={articles}
                emptyMessage={
                  hasSearched
                    ? "No articles match your search criteria. Try adjusting your search terms."
                    : "No articles available."
                }
              />

              {hasSearched && pagination.total > 0 && (
                <div className="text-center mt-8 text-gray-600">
                  Showing {articles.length} of {pagination.total} articles
                  {pagination.page < pagination.totalPages && (
                    <button
                      onClick={handleLoadMore}
                      disabled={searchLoading}
                      className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {searchLoading ? "Loading..." : "Load More"}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
