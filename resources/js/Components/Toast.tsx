import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function Toast() {
    const { flash } = usePage().props as any;
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setShow(true);
            setTimeout(() => setShow(false), 4000);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setShow(true);
            setTimeout(() => setShow(false), 4000);
        }
    }, [flash]);

    if (!show) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div
                className={`rounded-lg shadow-lg p-4 max-w-md ${
                    type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                }`}
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {type === 'success' ? (
                            <svg
                                className="h-5 w-5 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5 text-red-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </div>
                    <div className="ml-3 flex-1">
                        <p
                            className={`text-sm font-medium ${
                                type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}
                        >
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={() => setShow(false)}
                            className={`inline-flex rounded-md ${
                                type === 'success'
                                    ? 'text-green-400 hover:text-green-500'
                                    : 'text-red-400 hover:text-red-500'
                            }`}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
