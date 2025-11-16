import React, { useState, useEffect } from 'react';

interface LocusConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const LocusConnectModal: React.FC<LocusConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [walletKey, setWalletKey] = useState('');

  useEffect(() => {
    // Reset the key when the modal is opened/closed
    if (!isOpen) {
      setWalletKey('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = () => {
    if (walletKey.trim()) {
      onConnect(walletKey.trim());
    } else {
      alert("Please enter a wallet key.");
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
            This is a simulation. In a real application, you would be prompted by the Locus Wallet extension. For now, you can enter any text to act as your wallet key.
          </p>
          <div>
            <label htmlFor="wallet-key-input" className="text-sm font-semibold text-gray-300 mb-2 block">Your Simulated Wallet Key</label>
            <input
              id="wallet-key-input"
              type="text"
              value={walletKey}
              onChange={(e) => setWalletKey(e.target.value)}
              placeholder="Paste your wallet key here..."
              className="w-full p-3 bg-gray-900 text-gray-200 rounded-md font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
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
                disabled={!walletKey.trim()}
                className="py-2 px-6 bg-brand-blue text-white font-bold rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
             >
                Connect
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocusConnectModal;