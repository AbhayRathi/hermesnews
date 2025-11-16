import React, { useState, useEffect } from 'react';
import type { Article } from '../types';

interface PurchaseModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (article: Article, finalPrice: number) => void;
  walletBalance: number | null;
}

type PurchaseStep = 'calculating' | 'negotiating' | 'payment' | 'confirming' | 'complete';

const USD_PER_IV_POINT = 0.50;

// --- Helper Components for Steps ---

const StepIndicator: React.FC<{ currentStep: PurchaseStep }> = ({ currentStep }) => {
    const steps: PurchaseStep[] = ['calculating', 'negotiating', 'payment', 'confirming', 'complete'];
    const stepIndex = steps.indexOf(currentStep);

    return (
        <div className="flex justify-center items-center space-x-2 mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${index <= stepIndex ? 'bg-brand-blue text-white' : 'bg-gray-700 text-gray-400'}`}>
                        {index < stepIndex ? '✓' : index + 1}
                    </div>
                    {index < steps.length - 1 && <div className={`h-1 flex-1 transition-colors ${index < stepIndex ? 'bg-brand-blue' : 'bg-gray-700'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

const CalculatingStep = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <p className="text-lg font-semibold text-gray-300">Analyzing Article...</p>
        <p className="text-sm text-gray-500">This may take a few moments.</p>
    </div>
);

const ConfirmingStep = () => (
     <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <p className="text-lg font-semibold text-gray-300">Confirming on Blockchain...</p>
        <p className="text-sm text-gray-500">Your transaction is being processed.</p>
    </div>
);

const CompleteStep: React.FC<{ txHash: string }> = ({ txHash }) => (
    <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-green-400 mb-4">Purchase Complete!</h3>
        <p className="text-gray-300 mb-2">The article has been added to your collection.</p>
        <div className="bg-gray-900 p-2 rounded-md">
            <p className="text-xs text-gray-500">Transaction Hash</p>
            <p className="text-sm font-mono text-cyan-400 break-all">{txHash}</p>
        </div>
    </div>
);


const PurchaseModal: React.FC<PurchaseModalProps> = ({ article, isOpen, onClose, onConfirm, walletBalance }) => {
  const [purchaseStep, setPurchaseStep] = useState<PurchaseStep>('calculating');
  const [negotiatedIV, setNegotiatedIV] = useState<number>(0);

  useEffect(() => {
    if (isOpen && article) {
      setPurchaseStep('calculating');
      setNegotiatedIV(article.informationValue);

      const timer = setTimeout(() => setPurchaseStep('negotiating'), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, article]);

  if (!isOpen || !article) return null;
  
  const negotiatedPrice = negotiatedIV * USD_PER_IV_POINT;
  const hasSufficientFunds = walletBalance !== null && walletBalance >= negotiatedPrice;

  const handleConfirm = () => {
    if (purchaseStep === 'negotiating') {
      setPurchaseStep('payment');
    } else if (purchaseStep === 'payment') {
        if (!hasSufficientFunds) return;
        setPurchaseStep('confirming');
        setTimeout(() => setPurchaseStep('complete'), 2000); // Simulate confirmation time
        setTimeout(() => {
             console.log(`Purchase confirmed for "${article.title}" at price: ${formatCurrency(negotiatedIV)}`);
            onConfirm(article, negotiatedPrice);
        }, 3500); // Close modal after success message
    }
  };

  const formatCurrency = (iv: number) => {
    const price = iv * USD_PER_IV_POINT;
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const sliderMinIV = article.informationValue * 0.5;
  const sliderMaxIV = article.informationValue * 1.5;

  const renderContent = () => {
    switch(purchaseStep) {
        case 'calculating': return <CalculatingStep />;
        case 'negotiating': return (
            <div className="space-y-6">
                <div className="bg-gray-900 p-4 rounded-lg text-center">
                    <p className="text-sm font-semibold text-cyan-400">SUGGESTED PRICE (IV: {article.informationValue.toFixed(2)})</p>
                    <p className="text-4xl font-bold text-white">{formatCurrency(article.informationValue)}</p>
                </div>
                <div>
                    <label htmlFor="negotiation-slider" className="block text-sm font-medium text-gray-300 mb-2">Negotiate Price (Your Offer)</label>
                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-mono text-gray-400">{formatCurrency(sliderMinIV)}</span>
                        <input id="negotiation-slider" type="range" min={sliderMinIV} max={sliderMaxIV} step="0.01" value={negotiatedIV} onChange={e => setNegotiatedIV(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                        <span className="text-xs font-mono text-gray-400">{formatCurrency(sliderMaxIV)}</span>
                    </div>
                    <div className="text-center mt-2 text-2xl font-bold text-white">{formatCurrency(negotiatedIV)}</div>
                </div>
            </div>
        );
        case 'payment': return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-center text-white">Confirm with Locus Wallet</h3>
                <div className="bg-gray-900 p-4 rounded-lg space-y-3 text-sm">
                    <p className="text-gray-400">Your <span className="font-semibold text-cyan-400">Buyer Agent</span> will execute this transaction.</p>
                    <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                        <span className="text-gray-300">Current Balance:</span>
                        <span className="font-mono text-white">{walletBalance?.toFixed(2) ?? '0.00'} USDC</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Article Cost:</span>
                        <span className="font-mono text-red-400">- {negotiatedPrice.toFixed(2)} USDC</span>
                    </div>
                    <div className="flex justify-between items-center font-bold border-t border-gray-700 pt-2">
                         <span className="text-gray-300">Remaining Balance:</span>
                        <span className={`font-mono ${hasSufficientFunds ? 'text-green-400' : 'text-red-500'}`}>
                           {(walletBalance !== null ? walletBalance - negotiatedPrice : 0).toFixed(2)} USDC
                        </span>
                    </div>
                </div>
                {!hasSufficientFunds && <p className="text-center text-red-400 text-sm">Insufficient funds. Please cancel and negotiate a lower price.</p>}
            </div>
        );
        case 'confirming': return <ConfirmingStep />;
        case 'complete': return <CompleteStep txHash={`0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`} />;
    }
  }

  const getButtonText = () => {
    switch(purchaseStep) {
        case 'negotiating': return 'Proceed to Payment';
        case 'payment': return 'Confirm Transaction';
        default: return 'Confirm';
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white text-center">x402 Article Purchase</h2>
            <p className="text-sm text-gray-400 text-center mt-1">{article.title}</p>
        </div>
        <div className="p-8">
            <StepIndicator currentStep={purchaseStep} />
            {renderContent()}
        </div>
        {(purchaseStep === 'negotiating' || purchaseStep === 'payment') && (
            <div className="p-6 bg-gray-900/50 flex justify-end space-x-4 rounded-b-lg">
                <button onClick={onClose} className="py-2 px-6 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
                <button onClick={handleConfirm} disabled={purchaseStep === 'payment' && !hasSufficientFunds} className="py-2 px-6 bg-brand-blue text-white font-bold rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {getButtonText()}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseModal;