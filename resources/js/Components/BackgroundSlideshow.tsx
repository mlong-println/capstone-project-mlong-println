import { useEffect, useState } from 'react';

/**
 * BackgroundSlideshow Component
 * Rotates through scenic Hamilton/running images every 15 seconds
 * Uses free stock photos from Unsplash and Pexels
 */

// Curated collection of free running/trail/waterfront images
const BACKGROUND_IMAGES = [
    // Trail running in forest
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80',
    // Waterfront path with lake view
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    // Mountain trail running
    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1920&q=80',
    // Scenic forest trail
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    // Runner on mountain path
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80',
    // Waterfall and nature trail
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    // Escarpment view
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    // Lake Ontario shoreline
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80',
    // Forest path in autumn
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80',
    // Sunrise over water
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
];

export default function BackgroundSlideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Preload first image
        const img = new Image();
        img.src = BACKGROUND_IMAGES[0];
        img.onload = () => setIsLoaded(true);

        // Rotate images every 15 seconds
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 -z-10">
            {BACKGROUND_IMAGES.map((image, index) => (
                <div
                    key={image}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}
        </div>
    );
}
