'use client';
import { useEffect } from 'react';
import aboutData from '../common/data/about.json';

export default function About() {
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
        <div className="w-2/3 min-h-screen text-2xl leading-relaxed flex flex-col justify-center items-center">
            {/* General Objective Section */}
            <section className="relative py-20 w-full">
                <div className="container mx-auto px-6">
                    <h2 className="text-5xl font-bold text-white mb-8 reveal">
                        General Objective
                    </h2>
                    <p className="text-2xl text-white/70 leading-relaxed reveal
                                bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-white/10
                                hover:border-emerald-400/30 transition-all duration-500"
                       style={{ animationDelay: '200ms' }}>
                        {aboutData.generalObjective}
                    </p>
                </div>
            </section>

            {/* Specific Objectives Section */}
            <section className="py-20 bg-white/5 backdrop-blur-xl rounded-2xl w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-emerald-900/10" />
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-5xl font-bold text-white mb-12 reveal">
                        Specific Objectives
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {aboutData.specificObjectives.map((objetivo, index) => (
                            <div key={index} 
                                className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 
                                        border border-white/10 hover:border-emerald-400/30 
                                        transition-all duration-500 hover:bg-white/10
                                        reveal hover:transform hover:scale-[1.02]"
                                style={{ animationDelay: `${index * 200}ms` }}>
                                <p className="text-2xl text-white/70 group-hover:text-white/90 transition-colors">
                                    {objetivo}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission and Vision Section */}
            <section className="py-20 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent" />
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-5">
                    <div className="animate-fadeIn [animation-delay:200ms]">
                        <h2 className="text-5xl font-bold text-white mb-8">Mission</h2>
                        <div className="space-y-6">
                            {aboutData.mission.map((item, index) => (
                                <p key={index} 
                                    className="text-2xl text-white/70 leading-relaxed
                                            bg-white/5 backdrop-blur-xl rounded-xl p-6 
                                            border border-white/10 hover:border-emerald-400/30 
                                            transition-all duration-500 hover:bg-white/10">
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="animate-fadeIn [animation-delay:400ms]">
                        <h2 className="text-5xl font-bold text-white mb-8">Vision</h2>
                        <div className="space-y-6">
                            {aboutData.vision.map((item, index) => (
                                <p key={index} 
                                   className="text-2xl text-white/70 leading-relaxed
                                            bg-white/5 backdrop-blur-xl rounded-xl p-6 
                                            border border-white/10 hover:border-emerald-400/30 
                                            transition-all duration-500 hover:bg-white/10">
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white/5 backdrop-blur-xl rounded-2xl w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-emerald-900/10" />
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-5xl font-bold text-white mb-12 animate-fadeIn">Values</h2>
                    <div className="flex flex-wrap gap-6">
                        {aboutData.values.map((valor, index) => (
                            <div key={index} 
                                className="group bg-white/5 backdrop-blur-xl rounded-xl p-8 
                                        border border-white/10 hover:border-emerald-400/30 
                                        transition-all duration-500 hover:bg-white/10
                                        flex-1 basis-[280px] animate-fadeIn hover:transform hover:scale-105"
                                style={{ animationDelay: `${index * 200}ms` }}>
                                <h3 className="text-2xl font-semibold text-white mb-4 
                                           group-hover:text-emerald-400 transition-colors">
                                    {valor.title}
                                </h3>
                                <p className="text-xl text-white/70 group-hover:text-white/90 transition-colors">
                                    {valor.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
