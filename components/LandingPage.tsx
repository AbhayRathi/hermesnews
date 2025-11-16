import React from 'react';
import Link from 'next/link';

// Simple SVG Icons for visual appeal
const PublishIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ReadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const TechIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LandingPage: React.FC = () => {
    return (
        <div className="bg-brand-dark text-brand-light min-h-screen">
            {/* Hero Section */}
            <section className="text-center py-20 sm:py-32 bg-gray-900">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
                        The Future of News is Here.
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                        A decentralized marketplace powered by objective value, direct payments, and secure wallet technology.
                    </p>
                    <Link
                        href="/marketplace"
                        className="mt-8 inline-block bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Launch Hermes News
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <PublishIcon />
                            <h3 className="text-2xl font-bold text-white mb-2">For Publishers</h3>
                            <p className="text-gray-400">
                                Monetize your content fairly. Our system values information independently, ensuring you're rewarded for quality, not just clicks.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <ReadIcon />
                            <h3 className="text-2xl font-bold text-white mb-2">For Readers</h3>
                            <p className="text-gray-400">
                                Discover high-value news. Purchase articles seamlessly and securely with your Locus wallet, paying directly for what you consume.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <TechIcon />
                            <h3 className="text-2xl font-bold text-white mb-2">Powered by Web3</h3>
                            <p className="text-gray-400">
                                Built on the x402 protocol for direct micropayments and integrated with Locus for secure, decentralized identity and transactions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">How It All Works</h2>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 items-start">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-gray-800 border-2 border-brand-blue rounded-full text-2xl font-bold text-brand-blue">1</div>
                            <h4 className="text-xl font-semibold text-white mb-2">Publish Content</h4>
                            <p className="text-gray-400">Publishers upload their articles to the marketplace. The platform is open and accessible to all creators.</p>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="text-center">
                             <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-gray-800 border-2 border-brand-blue rounded-full text-2xl font-bold text-brand-blue">2</div>
                            <h4 className="text-xl font-semibold text-white mb-2">Value is Computed</h4>
                            <p className="text-gray-400">An independent system analyzes the content and assigns an <span className="font-semibold text-cyan-400">Information Value</span>, ensuring fair and objective pricing.</p>
                        </div>
                        
                        {/* Step 3 */}
                        <div className="text-center">
                             <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-gray-800 border-2 border-brand-blue rounded-full text-2xl font-bold text-brand-blue">3</div>
                            <h4 className="text-xl font-semibold text-white mb-2">Agents Consume</h4>
                            <p className="text-gray-400">Readers (or autonomous agents) purchase articles using the <span className="font-semibold text-cyan-400">x402 protocol</span> with their <span className="font-semibold text-cyan-400">Locus Wallet</span>, creating a direct-to-creator economy.</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Final CTA */}
            <section className="text-center py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                        Ready to Explore?
                    </h2>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                       Join the new information economy.
                    </p>
                    <Link
                        href="/marketplace"
                        className="mt-8 inline-block bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Enter Hermes News
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-6">
                <div className="container mx-auto text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Hermes News. A new paradigm for information exchange.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
