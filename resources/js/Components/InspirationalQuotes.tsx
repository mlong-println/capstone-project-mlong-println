import { useState, useEffect } from 'react';

/**
 * Inspirational Quotes with varied backgrounds, fonts, and imagery
 * Each quote has unique styling for visual interest
 */
const quotes = [
    {
        text: "Suffering is a test. That's all it is. Suffering is the true test of life.",
        author: "David Goggins",
        background: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80", // Mountain runner
        font: "font-bold",
        textColor: "text-white",
        overlay: "bg-gradient-to-t from-black/80 via-black/50 to-black/30"
    },
    {
        text: "You are not going to find yourself. You are going to create yourself.",
        author: "Jordan Peterson",
        background: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80", // Trail in forest
        font: "font-extrabold italic",
        textColor: "text-yellow-100",
        overlay: "bg-gradient-to-br from-purple-900/70 via-blue-900/60 to-transparent"
    },
    {
        text: "The only person you are destined to become is the person you decide to be.",
        author: "Cameron Hanes",
        background: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Mountain landscape
        font: "font-semibold tracking-wide",
        textColor: "text-white",
        overlay: "bg-gradient-to-r from-green-900/80 via-teal-900/60 to-blue-900/80"
    },
    {
        text: "The miracle isn't that I finished. The miracle is that I had the courage to start.",
        author: "John Bingham",
        background: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80", // Sunrise trail
        font: "font-light italic text-3xl",
        textColor: "text-orange-50",
        overlay: "bg-gradient-to-t from-orange-900/90 via-pink-900/50 to-purple-900/70"
    },
    {
        text: "Run when you can, walk if you have to, crawl if you must; just never give up.",
        author: "Dean Karnazes",
        background: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", // Forest path
        font: "font-black uppercase tracking-tight",
        textColor: "text-lime-100",
        overlay: "bg-gradient-to-br from-black/70 via-green-900/60 to-black/70"
    },
    {
        text: "The body achieves what the mind believes.",
        author: "Jim Ryun",
        background: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", // Mountain peak
        font: "font-bold tracking-wider",
        textColor: "text-cyan-50",
        overlay: "bg-gradient-to-t from-indigo-950/90 via-purple-900/60 to-pink-900/70"
    },
    {
        text: "It's not about having time. It's about making time.",
        author: "Unknown",
        background: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80", // Nature landscape
        font: "font-medium italic",
        textColor: "text-white",
        overlay: "bg-gradient-to-br from-cyan-900/80 via-blue-900/70 to-indigo-900/80"
    },
    {
        text: "The only bad workout is the one that didn't happen.",
        author: "Unknown",
        background: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80", // Autumn trail
        font: "font-extrabold",
        textColor: "text-pink-50",
        overlay: "bg-gradient-to-t from-rose-950/90 via-pink-900/60 to-red-900/70"
    },
    {
        text: "Your mind will quit a thousand times before your body will. Feel the pain and do it anyway.",
        author: "David Goggins",
        background: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Dramatic landscape
        font: "font-black tracking-tight",
        textColor: "text-red-50",
        overlay: "bg-gradient-to-br from-red-950/90 via-orange-900/70 to-black/80"
    },
    {
        text: "Don't limit your challenges. Challenge your limits.",
        author: "Unknown",
        background: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80", // Forest trail
        font: "font-bold uppercase text-2xl tracking-widest",
        textColor: "text-emerald-100",
        overlay: "bg-gradient-to-t from-green-950/90 via-teal-900/60 to-emerald-900/70"
    },
    {
        text: "The obsession is growth. The obsession is to be better today than I was yesterday.",
        author: "David Goggins",
        background: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80", // Mountain runner
        font: "font-semibold italic",
        textColor: "text-violet-100",
        overlay: "bg-gradient-to-br from-violet-950/90 via-purple-900/70 to-fuchsia-900/80"
    },
    {
        text: "If it doesn't challenge you, it won't change you.",
        author: "Fred DeVito",
        background: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80", // Trail running
        font: "font-extrabold tracking-wide",
        textColor: "text-amber-50",
        overlay: "bg-gradient-to-t from-amber-950/90 via-orange-900/70 to-red-900/80"
    },
    {
        text: "The pain you feel today will be the strength you feel tomorrow.",
        author: "Unknown",
        background: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", // Forest
        font: "font-bold",
        textColor: "text-teal-50",
        overlay: "bg-gradient-to-br from-emerald-950/90 via-green-900/70 to-teal-900/80"
    },
    {
        text: "Embrace the suck.",
        author: "Navy SEALs",
        background: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", // Mountain
        font: "font-black uppercase text-4xl tracking-widest",
        textColor: "text-slate-100",
        overlay: "bg-gradient-to-t from-slate-950/95 via-gray-900/80 to-zinc-900/85"
    },
    {
        text: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar",
        background: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80", // Sky and nature
        font: "font-medium italic",
        textColor: "text-sky-50",
        overlay: "bg-gradient-to-br from-sky-950/90 via-blue-900/70 to-indigo-900/80"
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
        <div className="relative overflow-hidden rounded-lg shadow-2xl min-h-[300px] flex items-center justify-center">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ backgroundImage: `url(${currentQuote.background})` }}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 ${currentQuote.overlay}`}></div>
            
            {/* Content */}
            <div 
                className={`relative z-10 text-center px-8 py-12 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
            >
                <svg 
                    className={`w-12 h-12 ${currentQuote.textColor} opacity-40 mx-auto mb-6`}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className={`text-2xl md:text-3xl ${currentQuote.font} ${currentQuote.textColor} mb-6 leading-relaxed drop-shadow-2xl`}>
                    {currentQuote.text}
                </p>
                <p className={`text-lg ${currentQuote.textColor} opacity-90 font-semibold drop-shadow-lg`}>
                    — {currentQuote.author}
                </p>
            </div>
        </div>
    );
}
