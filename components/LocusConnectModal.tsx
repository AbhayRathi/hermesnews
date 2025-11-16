import React, { useState, useEffect } from 'react';
import { connectWallet } from '../services/locusService';

interface LocusConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const LocusConnectModal: React.FC<LocusConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [walletKey, setWalletKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setCopyButtonText('Copy'); // Reset button text
      
      // Fetch a new key from the mock service when modal opens
      connectWallet()
        .then(address => {
          setWalletKey(address);
        })
        .catch(err => {
            console.error("Failed to get mock wallet address", err);
            setWalletKey("Error fetching address...");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if(walletKey && !isLoading) {
      navigator.clipboard.writeText(walletKey).then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy'), 2000); // Reset after 2s
      });
    }
  };

  const handleConnect = () => {
    if(walletKey && !isLoading) {
      onConnect(walletKey);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Connect Locus Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8 space-y-6">
          <p className="text-gray-400">
            This is a simulation. In a real application, you would be prompted by the Locus Wallet extension. For now, you can use this generated key.
          </p>
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Your Simulated Wallet Key</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={isLoading ? "Generating key..." : walletKey}
                className="w-full p-3 bg-gray-900 text-gray-200 rounded-md font-mono text-sm border border-gray-700 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                {copyButtonText}
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
             <button
                onClick={onClose}
                className="py-2 px-6 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600 transition-colors"
             >
                Cancel
             </button>
             <button
                onClick={handleConnect}
                disabled={isLoading}
                className="py-2 px-6 bg-brand-blue text-white font-bold rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
             >
                {isLoading ? "Loading..." : "Connect"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocusConnectModal;