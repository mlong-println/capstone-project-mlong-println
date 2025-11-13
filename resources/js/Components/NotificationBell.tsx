import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

interface NotificationBellProps {
    initialCount?: number;
}

export default function NotificationBell({ initialCount = 0 }: NotificationBellProps) {
    const [unreadCount, setUnreadCount] = useState(initialCount);

    // Poll for unread count every 30 seconds
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch('/notifications/unread-count');
                const data = await response.json();
                setUnreadCount(data.count);
            } catch (error) {
                console.error('Failed to fetch unread count:', error);
            }
        };

        // Fetch immediately
        fetchUnreadCount();

        // Then poll every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Link
            href="/notifications"
            className="relative inline-flex items-center justify-center p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition border border-white/20"
        >
            {/* Bell Icon SVG */}
            <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
            </svg>
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
            <span className="sr-only">
                {unreadCount} unread notifications
            </span>
        </Link>
    );
}
