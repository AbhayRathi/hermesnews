"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Marketplace from './components/Marketplace';
import UploadForm from './components/UploadForm';
import ArticleModal from './components/ArticleModal';
import LocusConnectModal from './components/LocusConnectModal';
import PurchaseModal from './components/PurchaseModal';
import MCPClient from './components/MCPClient';
import { disconnectWallet } from './services/locusService';
import type { Article, NewArticleData } from './types';

type AppTab = 'marketplace' | 'myArticles' | 'mcpClient';

const MarketplaceApp: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [purchasedArticles, setPurchasedArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  
  // State for the purchase flow
  const [purchaseChallenge, setPurchaseChallenge] = useState<{ invoice: string, token: string, article: Article } | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('marketplace');


  useEffect(() => {
    // Fetch initial articles from the mock API
    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/articles');
            if (!res.ok) throw new Error('Failed to fetch articles');
            const data: Article[] = await res.json();
            setArticles(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchArticles();
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
        const response = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData),
        });

        if (!response.ok) {
            throw new Error('Failed to add article');
        }

        const newArticle: Article = await response.json();
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
        // In a real app, you'd also make a DELETE request to the API
    }
  }, []);

  const handleSelectArticle = useCallback(async (article: Article) => {
    if (!walletAddress) return;

    // If it's already purchased, just open it
    if (purchasedArticles.some(p => p.id === article.id)) {
      setSelectedArticle(article);
      return;
    }

    // Attempt to fetch the protected article content
    try {
        const res = await fetch(`/api/articles/${article.id}`);
        
        if (res.ok) {
            const fullArticle: Article = await res.json();
            setSelectedArticle(fullArticle);
            return;
        }

        if (res.status === 402) {
            const authHeader = res.headers.get('WWW-Authenticate');
            if (authHeader) {
                const tokenMatch = authHeader.match(/token="([^"]+)"/);
                const invoiceMatch = authHeader.match(/invoice="([^"]+)"/);
                if (tokenMatch && invoiceMatch) {
                    setPurchaseChallenge({
                        article,
                        token: tokenMatch[1],
                        invoice: invoiceMatch[1],
                    });
                    setIsPurchaseModalOpen(true);
                    return;
                }
            }
        }
        
        throw new Error(`Unexpected response: ${res.status}`);

    } catch (error) {
        console.error("Error fetching article:", error);
        alert("Could not fetch article. See console for details.");
    }
  }, [walletAddress, purchasedArticles]);

  const handleCloseModal = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const handleClosePurchaseModal = useCallback(() => {
    setPurchaseChallenge(null);
    setIsPurchaseModalOpen(false);
  }, []);

  const handleConfirmPurchase = useCallback(async (purchasedArticle: Article, finalPrice: number, token: string, preimage: string) => {
    setIsPurchaseModalOpen(false);
    
    setWalletBalance(prev => (prev !== null ? prev - finalPrice : null));
    
    try {
        const res = await fetch(`/api/articles/${purchasedArticle.id}`, {
            headers: {
                'Authorization': `L402 ${token}:${preimage}`
            }
        });

        if (!res.ok) throw new Error('Payment verification failed.');

        const fullArticle: Article = await res.json();
        
        setArticles(prev => prev.filter(a => a.id !== purchasedArticle.id));
        setPurchasedArticles(prev => [fullArticle, ...prev]);

        setSelectedArticle(fullArticle);

    } catch (error) {
         console.error("Error after purchase confirmation:", error);
         alert("Payment succeeded, but failed to retrieve the article. Please try again.");
         setWalletBalance(prev => (prev !== null ? prev + finalPrice : null)); // Refund
    } finally {
        setPurchaseChallenge(null);
    }
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
                <TabButton tabName="mcpClient" label="MCP Client" />
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
                 {activeTab === 'mcpClient' && (
                    <MCPClient articles={articles} />
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
        challenge={purchaseChallenge}
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        onConfirm={handleConfirmPurchase}
        walletBalance={walletBalance}
      />
    </div>
  );
};

export default MarketplaceApp;