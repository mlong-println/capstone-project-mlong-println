import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ActivityHeart() {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Fetch pending activity count on mount
        fetchPendingCount();

        // Poll every 30 seconds
        const interval = setInterval(fetchPendingCount, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchPendingCount = async () => {
        try {
            const response = await fetch('/activity/pending-count');
            const data = await response.json();
            setPendingCount(data.count || 0);
        } catch (error) {
            console.error('Failed to fetch pending activity count:', error);
        }
    };

    return (
        <Link
            href="/activity"
            className="relative text-white/80 hover:text-white transition"
        >
            <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                />
            </svg>
            {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {pendingCount > 9 ? '9+' : pendingCount}
                </span>
            )}
        </Link>
    );
}
