import { useState, useEffect } from 'react';

const quotes = [
    {
        text: "Suffering is a test. That's all it is. Suffering is the true test of life.",
        author: "David Goggins",
        gradient: "from-red-500 via-orange-500 to-yellow-500"
    },
    {
        text: "You are not going to find yourself. You are going to create yourself.",
        author: "Jordan Peterson",
        gradient: "from-blue-500 via-purple-500 to-pink-500"
    },
    {
        text: "The only person you are destined to become is the person you decide to be.",
        author: "Cameron Hanes",
        gradient: "from-green-500 via-teal-500 to-blue-500"
    },
    {
        text: "The miracle isn't that I finished. The miracle is that I had the courage to start.",
        author: "John Bingham",
        gradient: "from-purple-500 via-pink-500 to-red-500"
    },
    {
        text: "Run when you can, walk if you have to, crawl if you must; just never give up.",
        author: "Dean Karnazes",
        gradient: "from-yellow-500 via-orange-500 to-red-500"
    },
    {
        text: "The body achieves what the mind believes.",
        author: "Jim Ryun",
        gradient: "from-indigo-500 via-purple-500 to-pink-500"
    },
    {
        text: "It's not about having time. It's about making time.",
        author: "Unknown",
        gradient: "from-cyan-500 via-blue-500 to-indigo-500"
    },
    {
        text: "The only bad workout is the one that didn't happen.",
        author: "Unknown",
        gradient: "from-pink-500 via-rose-500 to-red-500"
    },
    {
        text: "Your mind will quit a thousand times before your body will. Feel the pain and do it anyway.",
        author: "David Goggins",
        gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    {
        text: "Don't limit your challenges. Challenge your limits.",
        author: "Unknown",
        gradient: "from-teal-500 via-green-500 to-lime-500"
    },
    {
        text: "The obsession is growth. The obsession is to be better today than I was yesterday.",
        author: "David Goggins",
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500"
    },
    {
        text: "If it doesn't challenge you, it won't change you.",
        author: "Fred DeVito",
        gradient: "from-amber-500 via-orange-500 to-red-500"
    },
    {
        text: "The pain you feel today will be the strength you feel tomorrow.",
        author: "Unknown",
        gradient: "from-emerald-500 via-green-500 to-teal-500"
    },
    {
        text: "Embrace the suck.",
        author: "Navy SEALs",
        gradient: "from-slate-500 via-gray-500 to-zinc-500"
    },
    {
        text: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar",
        gradient: "from-sky-500 via-blue-500 to-indigo-500"
    }
];

export default function InspirationalQuotes() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeIn(false);
            
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % quotes.length);
                setFadeIn(true);
            }, 500); // Wait for fade out before changing quote
        }, 30000); // Change every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const currentQuote = quotes[currentIndex];

    return (
        <div className={`relative overflow-hidden rounded-lg shadow-lg p-8 min-h-[300px] flex items-center justify-center bg-gradient-to-br ${currentQuote.gradient}`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div 
                className={`relative z-10 text-center transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
            >
                <svg 
                    className="w-12 h-12 text-white/30 mx-auto mb-4" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed drop-shadow-lg">
                    {currentQuote.text}
                </p>
                <p className="text-lg text-white/90 font-semibold drop-shadow">
                    — {currentQuote.author}
                </p>
            </div>
        </div>
    );
}
