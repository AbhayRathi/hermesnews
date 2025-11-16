import React from 'react';

interface HeaderProps {
  walletAddress: string | null;
  walletBalance: number | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ walletAddress, walletBalance, onConnect, onDisconnect }) => {
  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <header className="bg-gray-800 shadow-lg p-4 sm:p-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wider">
            Hermes News
            </h1>
            <p className="text-gray-400 mt-1 text-xs sm:text-sm">
            Powered by Locus and the Information Value System
            </p>
        </div>
        <div>
            {walletAddress ? (
                 <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg">
                    {walletBalance !== null && (
                      <>
                        <span className="text-sm font-semibold text-white pl-1">${walletBalance.toFixed(2)} USDC</span>
                        <div className="h-6 border-l border-gray-600"></div>
                      </>
                    )}
                    <span className="text-sm font-mono text-green-400">{truncatedAddress}</span>
                    <button 
                        onClick={onDisconnect}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                    >
                        Disconnect
                    </button>
                 </div>
            ) : (
                <button 
                    onClick={onConnect}
                    className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Connect Locus Wallet
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;