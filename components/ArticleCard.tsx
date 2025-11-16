import React from 'react';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  onRemove: (articleId: string) => void;
  isWalletConnected: boolean;
  isPurchased: boolean;
}

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const colors: { [key: string]: string } = {
    Science: 'bg-blue-500 text-blue-100',
    Technology: 'bg-green-500 text-green-100',
    Politics: 'bg-red-500 text-red-100',
    Environment: 'bg-teal-500 text-teal-100',
    History: 'bg-yellow-600 text-yellow-100',
    Health: 'bg-purple-500 text-purple-100',
    Entertainment: 'bg-pink-500 text-pink-100',
  };
  const colorClass = colors[category] || 'bg-gray-500 text-gray-100';
  return <span className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full ${colorClass}`}>{category}</span>;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect, onRemove, isWalletConnected, isPurchased }) => {
  const formattedDate = new Date(article.time).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-transform transform hover:-translate-y-1 hover:shadow-2xl relative">
      <CategoryBadge category={article.category} />
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{article.title}</h3>
        <p className="text-sm text-gray-400 mb-4">
          By {article.author} for {article.publisher}
        </p>
        <p className="text-gray-300 flex-grow text-sm">{article.summary}</p>
      </div>
      <div className="p-6 bg-gray-900/50 flex justify-between items-center">
        <div className="text-lg font-bold">
          <span className="text-cyan-400">IV: </span>
          <span className="text-white">{article.informationValue.toFixed(2)}</span>
        </div>
        <button
          onClick={() => onSelect(article)}
          disabled={!isWalletConnected}
          className="bg-brand-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          title={!isWalletConnected ? "Connect your wallet to purchase" : isPurchased ? "Read article" : "Purchase article"}
        >
          {isPurchased ? "Read Article" : "Purchase (x402)"}
        </button>
      </div>
      {!isPurchased && (
        <button
          onClick={() => onRemove(article.id)}
          className="absolute bottom-4 left-4 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Remove article"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ArticleCard;