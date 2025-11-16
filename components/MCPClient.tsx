import React, { useState } from 'react';
import type { Article } from '../types';
import { payInvoice } from '../services/locusService';

interface MCPClientProps {
  articles: Article[];
}

const MCPClient: React.FC<MCPClientProps> = ({ articles }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quote, setQuote] = useState<{ itemCount: number; totalPrice: string; } | null>(null);
  const [challenge, setChallenge] = useState<{ token: string; invoice: string; } | null>(null);
  const [purchasedContent, setPurchasedContent] = useState<Article[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleArticle = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    // Reset state if selection changes
    setQuote(null);
    setChallenge(null);
    setPurchasedContent(null);
    setError(null);
  };

  const handleGetQuote = async () => {
    if (selectedIds.size === 0) {
      setError("Please select at least one article.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setPurchasedContent(null);
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getQuote', payload: { articleIds: Array.from(selectedIds) } }),
      });
      if (!res.ok) throw new Error('Failed to get quote.');
      const data = await res.json();
      setQuote(data.quote);
      setChallenge({ token: data.token, invoice: data.invoice });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePurchase = async () => {
      if (!challenge) return;
      setIsLoading(true);
      setError(null);
      try {
          const preimage = await payInvoice(challenge.invoice);
          const res = await fetch('/api/mcp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'purchase', payload: { token: challenge.token, preimage } }),
          });
          if (!res.ok) throw new Error('Purchase verification failed.');
          const data = await res.json();
          setPurchasedContent(data.articles);
      } catch (e) {
          setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">MCP Client Simulator</h3>
      <p className="text-gray-400 mb-6">This tool simulates how a machine or AI agent would programmatically purchase content from the Hermes News marketplace.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Selection */}
        <div className="bg-gray-900/50 p-6 rounded-lg">
          <h4 className="font-semibold text-lg mb-3">Step 1: Select Articles for Purchase</h4>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
            {articles.map(article => (
              <div key={article.id} className="flex items-center bg-gray-700 p-3 rounded-md">
                <input
                  type="checkbox"
                  id={`mcp-${article.id}`}
                  checked={selectedIds.has(article.id)}
                  onChange={() => handleToggleArticle(article.id)}
                  className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-brand-blue focus:ring-brand-blue"
                />
                <label htmlFor={`mcp-${article.id}`} className="ml-3 block text-sm text-gray-300 flex-grow truncate">
                  {article.title}
                </label>
                <span className="text-xs font-mono text-cyan-400 ml-2">IV: {article.informationValue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 & 3: Quote and Purchase */}
        <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Step 2: Get a Quote</h4>
                <button 
                    onClick={handleGetQuote} 
                    disabled={isLoading || selectedIds.size === 0}
                    className="w-full bg-brand-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Get Quote for {selectedIds.size} item(s)
                </button>
                {quote && challenge && (
                    <div className="mt-4 text-sm bg-gray-800 p-4 rounded-md space-y-2">
                        <div className="flex justify-between"><span className="text-gray-400">Items:</span><span>{quote.itemCount}</span></div>
                        <div className="flex justify-between font-bold"><span className="text-gray-400">Total Price:</span><span className="text-green-400">${quote.totalPrice} USDC</span></div>
                        <div className="pt-2"><p className="text-gray-500 text-xs font-mono break-all">Invoice: {challenge.invoice}</p></div>
                    </div>
                )}
            </div>
             <div className="bg-gray-900/50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Step 3: Pay & Fetch Content</h4>
                <button
                    onClick={handlePurchase}
                    disabled={isLoading || !challenge}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Pay & Fetch
                </button>
            </div>
        </div>
      </div>
      
      {/* Result */}
      <div className="mt-8">
         <h4 className="font-semibold text-lg mb-3">Result: Fetched Content</h4>
         <div className="bg-gray-900 p-4 rounded-lg min-h-[100px] text-xs font-mono text-green-300">
             {isLoading && <p>Loading...</p>}
             {error && <p className="text-red-400">{error}</p>}
             {purchasedContent && (
                 <pre className="whitespace-pre-wrap break-all">{JSON.stringify(purchasedContent, null, 2)}</pre>
             )}
              {!isLoading && !error && !purchasedContent && <p className="text-gray-500">Content will appear here after a successful purchase.</p>}
         </div>
      </div>
    </div>
  );
};

export default MCPClient;
