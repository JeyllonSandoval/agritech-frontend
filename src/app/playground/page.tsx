import ProtectedRoute from '@/utils/protectedRoute';
import playgroundData from '@/data/Lenguage/en/playground.json';
import { 
    ChartBarIcon, 
    SparklesIcon, 
    DevicePhoneMobileIcon, 
    ChartPieIcon,
    CheckCircleIcon,
    Cog6ToothIcon,
    WrenchScrewdriverIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'chart':
            return <ChartBarIcon className="w-5 h-5" />;
        case 'leaf':
            return <SparklesIcon className="w-5 h-5" />;
        case 'mobile':
            return <DevicePhoneMobileIcon className="w-5 h-5" />;
        case 'pie':
            return <ChartPieIcon className="w-5 h-5" />;
        case 'check':
            return <CheckCircleIcon className="w-5 h-5" />;
        case 'cog':
            return <Cog6ToothIcon className="w-5 h-5" />;
        case 'wrench':
            return <WrenchScrewdriverIcon className="w-5 h-5" />;
        case 'chat':
            return <ChatBubbleLeftRightIcon className="w-5 h-5" />;
        case 'sparkles':
            return <SparklesIcon className="w-5 h-5" />;
        default:
            return null;
    }
};

export default function Playground() {
    return (
        <ProtectedRoute>
            <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
                <div className="w-full max-w-4xl h-full flex flex-col p-4 sm:p-6 md:p-8">
                    <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6 md:space-y-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-4 sm:mb-6 md:mb-8">
                            {playgroundData.title}
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 sm:p-5 md:p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10">
                                <h3 className="text-lg sm:text-xl font-semibold text-emerald-400 mb-3 sm:mb-4">
                                    {playgroundData.sections.quickGuide.title}
                                </h3>
                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/70">
                                    {playgroundData.sections.quickGuide.items.map((item, index) => (
                                        <li key={index} className="flex items-start group">
                                            <span className="mr-2 text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                                {getIcon(item.icon)}
                                            </span>
                                            <span className="group-hover:text-white/90 transition-colors">
                                                {item.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 sm:p-5 md:p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10">
                                <h3 className="text-lg sm:text-xl font-semibold text-emerald-400 mb-3 sm:mb-4">
                                    {playgroundData.sections.nextSteps.title}
                                </h3>
                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/70">
                                    {playgroundData.sections.nextSteps.items.map((item, index) => (
                                        <li key={index} className="flex items-start group">
                                            <span className="mr-2 text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                                {getIcon(item.icon)}
                                            </span>
                                            <span className="group-hover:text-white/90 transition-colors">
                                                {item.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto py-4 text-center bg-white/5 backdrop-blur-sm border-t border-white/10 rounded-2xl">
                        <p className="text-sm sm:text-base text-white/70 hover:text-white/90 transition-colors">
                            {playgroundData.helpText}
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
