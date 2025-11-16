import React from 'react';
import type { Article } from '../types';
import ArticleCard from './ArticleCard';

interface MarketplaceProps {
  title: string;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveArticle: (articleId: string) => void;
  isWalletConnected: boolean;
  isPurchasedView: boolean;
}

const Marketplace: React.FC<MarketplaceProps> = ({ title, articles, onSelectArticle, onRemoveArticle, isWalletConnected, isPurchasedView }) => {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-brand-blue pb-3">{title}</h2>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
              onRemove={onRemoveArticle}
              isWalletConnected={isWalletConnected}
              isPurchased={isPurchasedView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            {isPurchasedView ? "You haven't purchased any articles yet." : "No articles available in the marketplace."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
