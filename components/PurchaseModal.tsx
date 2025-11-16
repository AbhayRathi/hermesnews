import React, { useState, useEffect } from 'react';
import type { Article } from '../types';
import { payInvoice } from '../services/locusService';

interface PurchaseModalProps {
  challenge: { article: Article; invoice: string; token: string; } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (article: Article, finalPrice: number, token: string, preimage: string) => void;
  walletBalance: number | null;
}

const USD_PER_IV_POINT = 0.50;

const PurchaseModal: React.FC<PurchaseModalProps> = ({ challenge, isOpen, onClose, onConfirm, walletBalance }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const article = challenge?.article;
  const price = article ? article.informationValue * USD_PER_IV_POINT : 0;
  const hasSufficientFunds = walletBalance !== null && walletBalance >= price;

  useEffect(() => {
    // Reset state when modal opens or challenge changes
    if (isOpen) {
      setIsPaying(false);
      setPaymentError(null);
    }
  }, [isOpen, challenge]);

  if (!isOpen || !article || !challenge) return null;

  const handlePay = async () => {
    if (!hasSufficientFunds) {
        setPaymentError("Insufficient funds.");
        return;
    }

    setIsPaying(true);
    setPaymentError(null);

    try {
        // This simulates interacting with a WebLN wallet to pay the invoice
        const preimage = await payInvoice(challenge.invoice);
        
        // Pass all necessary data back to the parent to complete the flow
        onConfirm(article, price, challenge.token, preimage);

    } catch (error) {
        console.error("Payment simulation failed:", error);
        setPaymentError("Payment failed. Please try again.");
        setIsPaying(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white text-center">x402 Article Purchase</h2>
            <p className="text-sm text-gray-400 text-center mt-1 truncate">{article.title}</p>
        </div>
        <div className="p-8 space-y-4">
            <h3 className="text-lg font-semibold text-center text-white">Payment Required</h3>
            
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 text-sm">
                <p className="text-gray-400">Your wallet will be used to pay the following invoice to unlock the content.</p>
                <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                    <span className="text-gray-300">Article Cost:</span>
                    <span className="font-mono text-white">{price.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                     <span className="text-gray-300">Your Balance:</span>
                    <span className={`font-mono ${hasSufficientFunds ? 'text-green-400' : 'text-red-500'}`}>
                       {walletBalance?.toFixed(2) ?? '0.00'} USDC
                    </span>
                </div>
                 {paymentError && <p className="text-center text-red-400 text-xs pt-2">{paymentError}</p>}
                 {!hasSufficientFunds && <p className="text-center text-red-400 text-xs pt-2">Insufficient funds to complete this purchase.</p>}
            </div>

            <div className="text-xs text-gray-500 space-y-1">
                <p className="font-semibold">Mock Invoice:</p>
                <p className="font-mono break-all bg-gray-900 p-2 rounded">{challenge.invoice}</p>
            </div>
        </div>

        <div className="p-6 bg-gray-900/50 flex justify-end space-x-4 rounded-b-lg">
            <button onClick={onClose} disabled={isPaying} className="py-2 px-6 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50">Cancel</button>
            <button onClick={handlePay} disabled={isPaying || !hasSufficientFunds} className="py-2 px-6 bg-brand-blue text-white font-bold rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
                {isPaying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                ) : 'Pay & Read'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;