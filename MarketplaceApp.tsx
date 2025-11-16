"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Marketplace from './components/Marketplace';
import UploadForm from './components/UploadForm';
import ArticleModal from './components/ArticleModal';
import LocusConnectModal from './components/LocusConnectModal';
import PurchaseModal from './components/PurchaseModal';
import { generateSummary } from './services/geminiService';
import { disconnectWallet } from './services/locusService';
import type { Article, NewArticleData } from './types';
import { SAMPLE_NEWS_DATA } from './constants';

type AppTab = 'marketplace' | 'myArticles';

const MarketplaceApp: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [purchasedArticles, setPurchasedArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [articleToPurchase, setArticleToPurchase] = useState<Article | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('marketplace');

  useEffect(() => {
    // Parse the sample data and initialize the state
    try {
      const rawDataString = `[${SAMPLE_NEWS_DATA.trim().replace(/}\s*{/g, '},{')}]`;
      const parsedData: Omit<Article, 'id' | 'informationValue'>[] = JSON.parse(rawDataString);
      
      const initialArticles = parsedData.map((item, index) => ({
        ...item,
        id: `${Date.now()}-${index}`, // Create a unique ID
        informationValue: Math.random() * 11 + 1, // IV range for prices ~$0.50-$6.00
      })).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()); // Sort by most recent

      setArticles(initialArticles);
    } catch (error)
 {
      console.error("Failed to parse sample data:", error);
    }
  }, []);

  const handleConnectWallet = useCallback(() => {
    setIsConnectModalOpen(true);
  }, []);
  
  const handleConfirmConnect = useCallback((address: string) => {
    setWalletAddress(address);
    // Simulate initial wallet balance
    const initialBalance = Math.random() * 20 + 10; // Random balance between $10 and $30
    setWalletBalance(initialBalance);
    setIsConnectModalOpen(false);
  }, []);

  const handleCloseConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
  }, []);

  const handleDisconnectWallet = useCallback(async () => {
    try {
      await disconnectWallet();
      setWalletAddress(null);
      setWalletBalance(null); // Clear balance on disconnect
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }, []);

  const handleAddArticle = useCallback(async (articleData: NewArticleData) => {
    setIsLoading(true);
    try {
      // Call the new service that fetches from our secure API route
      const summary = await generateSummary(articleData.article);
      const newArticle: Article = {
        ...articleData,
        id: Date.now().toString(),
        time: new Date().toISOString(),
        summary: summary,
        informationValue: Math.random() * 11 + 1, // IV range for prices ~$0.50-$6.00
      };
      setArticles(prevArticles => [newArticle, ...prevArticles]);
    } catch (error) {
        console.error("Failed to add article:", error)
        alert("There was an error uploading your article. Please check the console for details.")
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRemoveArticle = useCallback((articleId: string) => {
    if(window.confirm("Are you sure you want to remove this listing?")){
        setArticles(prev => prev.filter(article => article.id !== articleId));
    }
  }, []);

  const handleSelectArticle = useCallback((article: Article) => {
    if (!walletAddress) return;

    if (activeTab === 'myArticles') {
      setSelectedArticle(article);
    } else {
      console.log(`Initiating x402 purchase for "${article.title}"`);
      setArticleToPurchase(article);
      setIsPurchaseModalOpen(true);
    }
  }, [walletAddress, activeTab]);

  const handleCloseModal = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const handleClosePurchaseModal = useCallback(() => {
    setArticleToPurchase(null);
    setIsPurchaseModalOpen(false);
  }, []);

  const handleConfirmPurchase = useCallback((purchasedArticle: Article, finalPrice: number) => {
    setIsPurchaseModalOpen(false);
    setArticleToPurchase(null);

    // Deduct from balance
    setWalletBalance(prev => (prev !== null ? prev - finalPrice : null));
    
    // Move article from marketplace to purchased list
    setArticles(prev => prev.filter(a => a.id !== purchasedArticle.id));
    setPurchasedArticles(prev => [purchasedArticle, ...prev]);

    // Show the full article content
    setSelectedArticle(purchasedArticle);
  }, []);

  const TabButton: React.FC<{tabName: AppTab, label: string}> = ({tabName, label}) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-6 py-2 text-lg font-semibold rounded-t-md transition-colors ${
          isActive
            ? 'bg-gray-800 text-white border-b-2 border-brand-blue'
            : 'bg-gray-900 text-gray-400 hover:bg-gray-800/50'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header 
        walletAddress={walletAddress}
        walletBalance={walletBalance}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />
      <main className="container mx-auto p-4 md:p-8">
        <UploadForm onUpload={handleAddArticle} isLoading={isLoading} />
        
        <div className="mt-12">
            <div className="flex border-b border-gray-700">
                <TabButton tabName="marketplace" label="Marketplace" />
                <TabButton tabName="myArticles" label="My Articles" />
            </div>
            <div className="bg-gray-800 p-8 rounded-b-lg rounded-tr-lg">
                {activeTab === 'marketplace' && (
                     <Marketplace
                        title="Available Articles"
                        articles={articles}
                        onSelectArticle={handleSelectArticle}
                        onRemoveArticle={handleRemoveArticle}
                        isWalletConnected={!!walletAddress}
                        isPurchasedView={false}
                    />
                )}
                {activeTab === 'myArticles' && (
                     <Marketplace
                        title="Your Purchased Articles"
                        articles={purchasedArticles}
                        onSelectArticle={handleSelectArticle}
                        onRemoveArticle={() => {}} // No remove on purchased
                        isWalletConnected={!!walletAddress}
                        isPurchasedView={true}
                    />
                )}
            </div>
        </div>

      </main>
      <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
      <LocusConnectModal
        isOpen={isConnectModalOpen}
        onClose={handleCloseConnectModal}
        onConnect={handleConfirmConnect}
      />
      <PurchaseModal
        article={articleToPurchase}
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        onConfirm={handleConfirmPurchase}
        walletBalance={walletBalance}
      />
    </div>
  );
};

export default MarketplaceApp;
