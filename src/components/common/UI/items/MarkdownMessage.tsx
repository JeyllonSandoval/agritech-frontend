import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownMessageProps {
    content: string;
    className?: string;
}

export default function MarkdownMessage({ content, className = '' }: MarkdownMessageProps) {
    return (
        <div className={`prose prose-invert max-w-none ${className}`}>
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    // Personalizar estilos para elementos Markdown
                    h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-white/90 mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-white/80 mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-base font-medium text-white/70 mb-1">{children}</h3>
                    ),
                    p: ({ children }) => (
                        <p className="text-white/80 mb-2 leading-relaxed whitespace-pre-wrap">{children}</p>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-white/90">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-white/70">{children}</em>
                    ),
                    code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                            <code className="bg-gray-700/50 text-emerald-300 px-1 py-0.5 rounded text-sm font-mono">
                                {children}
                            </code>
                        ) : (
                            <pre className="bg-gray-800/50 p-3 rounded-lg overflow-x-auto mb-3">
                                <code className="text-emerald-300 text-sm font-mono block">
                                    {children}
                                </code>
                            </pre>
                        );
                    },
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside text-white/80 mb-2 space-y-1">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-white/80 mb-2 space-y-1">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-white/80">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-emerald-400/50 pl-4 italic text-white/70 mb-2">
                            {children}
                        </blockquote>
                    ),
                    a: ({ children, href }) => (
                        <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 underline"
                        >
                            {children}
                        </a>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-3">
                            <table className="min-w-full border-collapse border border-gray-600/30">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-gray-600/30 px-3 py-2 text-left text-white/90 font-semibold bg-gray-700/30">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-gray-600/30 px-3 py-2 text-white/80">
                            {children}
                        </td>
                    ),
                    hr: () => (
                        <hr className="border-gray-600/30 my-4" />
                    ),
                    br: () => (
                        <br />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
} 