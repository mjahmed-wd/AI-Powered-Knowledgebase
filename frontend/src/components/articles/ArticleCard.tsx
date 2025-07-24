import React from "react";
import Link from "next/link";
import { Article } from "@/types/api";
import { formatDate } from "@/utils/formatter";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex-grow">
        <div className="p-6 pb-4">
          <Link href={`/articles/${article.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
              {article.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {article.body}
          </p>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-1.5">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  {tag.name}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="inline-block text-gray-500 text-xs px-2.5 py-1">
                  +{article.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-blue-600 font-medium text-xs">
                {article.author?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span className="font-medium text-gray-700">
              {article.author?.name || "Unknown Author"}
            </span>
            <span className="mx-2">•</span>
            <time>{formatDate(article.createdAt)}</time>
          </div>

          <Link
            href={`/articles/${article.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-xs inline-flex items-center group"
          >
            Read more
            <svg
              className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};
