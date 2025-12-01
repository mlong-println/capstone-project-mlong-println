import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface Shoe {
    id: number;
    brand: string;
    model: string;
    color: string | null;
    distance: number;
    purchase_date: string | null;
    is_active: boolean;
    notes: string | null;
    wear_percentage: number;
    remaining_distance: number;
    needs_replacement: boolean;
}

interface GearIndexProps {
    shoes: Shoe[];
}

export default function Index({ shoes }: GearIndexProps) {
    const [localShoes, setLocalShoes] = useState(shoes);

    const activeShoes = localShoes.filter(shoe => shoe.is_active);
    const retiredShoes = localShoes.filter(shoe => !shoe.is_active);

    const handleRetire = (shoeId: number) => {
        if (confirm('Are you sure you want to retire this shoe?')) {
            router.post(`/gear/${shoeId}/retire`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalShoes(prev => prev.map(shoe => 
                        shoe.id === shoeId ? { ...shoe, is_active: false } : shoe
                    ));
                },
            });
        }
    };

    const handleReactivate = (shoeId: number) => {
        router.post(`/gear/${shoeId}/reactivate`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalShoes(prev => prev.map(shoe => 
                    shoe.id === shoeId ? { ...shoe, is_active: true } : shoe
                ));
            },
        });
    };

    const handleDelete = (shoeId: number) => {
        if (confirm('Are you sure you want to delete this shoe? This action cannot be undone.')) {
            router.delete(`/gear/${shoeId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalShoes(prev => prev.filter(shoe => shoe.id !== shoeId));
                },
            });
        }
    };

    const getWearColor = (percentage: number) => {
        if (percentage < 50) return 'bg-green-500';
        if (percentage < 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const ShoeCard = ({ shoe }: { shoe: Shoe }) => (
        <div className={`bg-white rounded-lg shadow p-6 ${shoe.needs_replacement ? 'border-2 border-red-400' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{shoe.brand} {shoe.model}</h3>
                    {shoe.color && (
                        <p className="text-sm text-gray-600 mt-1">Color: {shoe.color}</p>
                    )}
                    {shoe.purchase_date && (
                        <p className="text-xs text-gray-500 mt-1">
                            Purchased: {new Date(shoe.purchase_date).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/gear/${shoe.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                        Edit
                    </Link>
                    {shoe.is_active ? (
                        <button
                            onClick={() => handleRetire(shoe.id)}
                            className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                        >
                            Retire
                        </button>
                    ) : (
                        <button
                            onClick={() => handleReactivate(shoe.id)}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                            Reactivate
                        </button>
                    )}
                    <button
                        onClick={() => handleDelete(shoe.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Distance Stats */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Distance</span>
                    <span className="font-semibold text-gray-900">{shoe.distance ?? 0} km</span>
                </div>
                
                {/* Wear Progress Bar */}
                <div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Wear</span>
                        <span>{shoe.wear_percentage ?? 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${getWearColor(shoe.wear_percentage ?? 0)}`}
                            style={{ width: `${shoe.wear_percentage ?? 0}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className={`font-semibold ${shoe.needs_replacement ? 'text-red-600' : 'text-gray-900'}`}>
                        {(shoe.remaining_distance ?? 0).toFixed(0)} km
                    </span>
                </div>

                {shoe.needs_replacement && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                        <p className="text-sm text-red-800 font-medium">
                            ⚠️ Time to replace these shoes!
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                            Most running shoes should be replaced after 600-800km
                        </p>
                    </div>
                )}

                {shoe.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 italic">{shoe.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Gear
                    </h2>
                    <Link
                        href="/gear/create"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                    >
                        Add Shoe
                    </Link>
                </div>
            }
        >
            <Head title="My Gear" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Active Shoes */}
                    {activeShoes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Shoes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeShoes.map(shoe => (
                                    <ShoeCard key={shoe.id} shoe={shoe} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Retired Shoes */}
                    {retiredShoes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-500 mb-4">Retired Shoes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                                {retiredShoes.map(shoe => (
                                    <ShoeCard key={shoe.id} shoe={shoe} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {localShoes.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No shoes yet</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding your first pair of running shoes.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/gear/create"
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Add Shoe
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
