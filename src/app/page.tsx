'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import homeData from '@/data/home.json';
import { 
    DocumentTextIcon, 
    ChatBubbleLeftRightIcon, 
    FolderIcon, 
    AcademicCapIcon,
    UserGroupIcon,
    BookOpenIcon,
    SparklesIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

type SocialPlatform = {
    linkedin: {
        profileOne: { title: string; urlPlayerOne: string; };
        profileTwo: { title: string; urlPlayerTwo: string; };
    };
    github: {
        optionOne: { title: string; urlFrontEnd: string; };
        optionTwo: { title: string; urlBackEnd: string; };
    };
};

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

    const getFeatureIcon = (iconName: string) => {
        switch (iconName) {
            case 'document':
                return <DocumentTextIcon className="w-8 h-8 md:w-12 md:h-12" />;
            case 'chat':
                return <ChatBubbleLeftRightIcon className="w-8 h-8 md:w-12 md:h-12" />;
            case 'folder':
                return <FolderIcon className="w-8 h-8 md:w-12 md:h-12" />;
            case 'learn':
                return <AcademicCapIcon className="w-8 h-8 md:w-12 md:h-12" />;
            default:
                return null;
        }
    };

    const getAudienceIcon = (iconName: string) => {
        switch (iconName) {
            case 'farmer':
                return <UserGroupIcon className="w-8 h-8 md:w-12 md:h-12" />;
            case 'student':
                return <BookOpenIcon className="w-8 h-8 md:w-12 md:h-12" />;
            case 'sprout':
                return <SparklesIcon className="w-8 h-8 md:w-12 md:h-12" />;
            default:
                return null;
        }
    };

    return (
        <main className="absolute inset-0 overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Hero Section */}
            <section className="min-h-screen w-full snap-start relative flex items-center justify-center overflow-hidden py-20 lg:py-0">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-black/40 z-0" />
                <div className="container mx-auto px-4 md:px-6 text-center relative z-1 flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center">
                        <Image 
                            src={homeData.hero.image} 
                            alt="Hero Image" 
                            width={100} 
                            height={100}
                            className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28" 
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 reveal" style={{ animationDelay: '200ms' }}>
                        {homeData.hero.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 reveal" style={{ animationDelay: '400ms' }}>
                        {homeData.hero.subtitle}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto reveal" style={{ animationDelay: '600ms' }}>
                        {homeData.hero.description}
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="min-h-screen snap-start py-20 bg-white/5 backdrop-blur-xl relative overflow-hidden flex items-center justify-center">
                <div className="container mx-auto px-4 md:px-6 relative z-1 flex flex-col items-center justify-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 md:mb-16 reveal">
                        {homeData.features.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {homeData.features.items.map((feature, index) => (
                            <div key={index} 
                                className="group bg-white/5 backdrop-blur-xl rounded-xl p-4 md:p-6 
                                         border border-white/10 hover:border-emerald-400/30
                                         transition-all duration-500 hover:bg-white/10
                                         reveal hover:transform hover:scale-105"
                                style={{ animationDelay: `${index * 200}ms` }}>
                                <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                                    {getFeatureIcon(feature.icon)}
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-base md:text-lg lg:text-xl text-white/70 group-hover:text-white/90 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Audience Section */}
            <section className="min-h-screen snap-start py-20 bg-black/50 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent z-0" />
                <div className="container mx-auto px-4 md:px-6 relative z-1 flex flex-col items-center justify-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 md:mb-16 reveal">
                        {homeData.audience.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {homeData.audience.groups.map((group, index) => (
                            <div key={index} 
                                className="group bg-white/5 backdrop-blur-xl rounded-xl p-4 md:p-6
                                        border border-white/10 hover:border-emerald-400/30
                                        transition-all duration-500 hover:bg-white/10
                                        reveal">
                                <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                                    {getAudienceIcon(group.icon)}
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                    {group.title}
                                </h3>
                                <p className="text-base md:text-lg lg:text-xl text-white/70 group-hover:text-white/90 transition-colors">
                                    {group.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="min-h-screen snap-start py-20 bg-white/5 backdrop-blur-xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-emerald-900/10 z-0" />
                <div className="container mx-auto px-4 md:px-6 text-center relative z-1 flex flex-col items-center justify-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-8 reveal">
                        {homeData.contact.title}
                    </h2>
                    <p className="text-base md:text-lg lg:text-2xl text-white/70 mb-8 md:mb-12 max-w-2xl mx-auto reveal">
                        {homeData.contact.description}
                    </p>
                    <div className="flex flex-col items-center gap-4 md:gap-6 reveal">
                        <a href={`mailto:${homeData.contact.email}`} 
                            className="text-emerald-400 hover:text-emerald-300 transition-all duration-300
                                    text-lg md:text-xl lg:text-2xl hover:scale-105 transform flex items-center gap-2">
                            <EnvelopeIcon className="w-5 h-5 md:w-6 md:h-6" />
                            {homeData.contact.email}
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}