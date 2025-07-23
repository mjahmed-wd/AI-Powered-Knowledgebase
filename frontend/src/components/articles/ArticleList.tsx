import React from 'react';
import { ArticleCard, Article } from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onSummarize?: (id: string) => void;
  emptyMessage?: string;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  showActions = false,
  onDelete,
  onSummarize,
  emptyMessage = "No articles found."
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Articles Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          showActions={showActions}
          onDelete={onDelete}
          onSummarize={onSummarize}
        />
      ))}
    </div>
  );
};
