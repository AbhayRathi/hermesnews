
import React from 'react';
import type { Article } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  const formattedDate = new Date(article.time).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-700 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white">{article.title}</h2>
            <p className="text-gray-400 mt-2">
              By <span className="font-semibold text-gray-300">{article.author}</span> for <span className="font-semibold text-gray-300">{article.publisher}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close article"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{article.article}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
