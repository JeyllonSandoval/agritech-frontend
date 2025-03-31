'use client';
import { useEffect, useRef } from 'react';
import homeData from '../common/data/home.json';

export default function Home() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach((element) => {
            observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen text-2xl">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-black/40 z-0" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-7xl font-bold text-white mb-4 reveal" style={{ animationDelay: '200ms' }}>
                        {homeData.hero.title}
                    </h1>
                    <h2 className="text-3xl text-white/90 mb-8 reveal" style={{ animationDelay: '400ms' }}>
                        {homeData.hero.subtitle}
                    </h2>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto reveal" style={{ animationDelay: '600ms' }}>
                        {homeData.hero.description}
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/5 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-emerald-900/10" />
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-5xl font-bold text-white text-center mb-16 reveal">
                        {homeData.features.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {homeData.features.items.map((feature, index) => (
                            <div key={index} 
                                className="group bg-white/5 backdrop-blur-xl rounded-xl p-6 
                                         border border-white/10 hover:border-emerald-400/30
                                         transition-all duration-500 hover:bg-white/10
                                         reveal hover:transform hover:scale-105"
                                style={{ animationDelay: `${index * 200}ms` }}>
                                <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                                    {/* Aquí irían los iconos */}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-white/70 group-hover:text-white/90 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Audience Section */}
            <section className="py-20 bg-black/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent" />
                <div className="container mx-auto px-6 relative z-5">
                    <h2 className="text-5xl font-bold text-white text-center mb-16 reveal">
                        {homeData.audience.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {homeData.audience.groups.map((group, index) => (
                            <div key={index} 
                                className="group bg-white/5 backdrop-blur-xl rounded-xl p-6 
                                        border border-white/10 hover:border-emerald-400/30
                                        transition-all duration-500 hover:bg-white/10
                                        reveal">
                                <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                                    {/* Aquí irían los iconos */}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                    {group.title}
                                </h3>
                                <p className="text-white/70 group-hover:text-white/90 transition-colors">
                                    {group.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-white/5 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-emerald-900/10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl font-bold text-white mb-8 reveal">
                        {homeData.contact.title}
                    </h2>
                    <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto reveal">
                        {homeData.contact.description}
                    </p>
                    <div className="flex flex-col items-center gap-6 reveal">
                        <a href={`mailto:${homeData.contact.email}`} 
                            className="text-emerald-400 hover:text-emerald-300 transition-all duration-300
                                    text-xl hover:scale-105 transform">
                            {homeData.contact.email}
                        </a>
                        <div className="flex gap-8">
                            {Object.entries(homeData.contact.social).map(([platform, handle]) => (
                                <a key={platform}
                                    href={`https://${platform}.com/${handle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/70 hover:text-emerald-400 transition-all duration-300
                                            hover:scale-110 transform px-4 py-2 rounded-lg
                                            hover:bg-white/5 border border-transparent
                                            hover:border-emerald-400/30">
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
