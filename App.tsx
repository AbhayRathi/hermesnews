import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MarketplaceApp from './MarketplaceApp';

const App: React.FC = () => {
    // State to track the current route based on the URL hash
    const [route, setRoute] = useState(window.location.hash);

    // Effect to listen for changes in the URL hash
    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };

        window.addEventListener('hashchange', handleHashChange);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // Simple routing logic: show landing page by default, or marketplace if hash is #marketplace
    switch (route) {
        case '#marketplace':
            return <MarketplaceApp />;
        default:
            return <LandingPage />;
    }
};

export default App;
