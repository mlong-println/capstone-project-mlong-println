import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FormEventHandler } from 'react';

interface Shoe {
    id: number;
    brand: string;
    model: string;
    color: string | null;
    distance: number;
    purchase_date: string | null;
    is_active: boolean;
    notes: string | null;
}

interface EditProps {
    shoe: Shoe;
    brands: string[];
}

export default function Edit({ shoe, brands }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        brand: shoe.brand || '',
        model: shoe.model || '',
        color: shoe.color || '',
        purchase_date: shoe.purchase_date || '',
        notes: shoe.notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('gear.update', shoe.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Shoe
                    </h2>
                    <Link
                        href="/gear"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Gear
                    </Link>
                </div>
            }
        >
            <Head title="Edit Shoe" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Brand */}
                            <div>
                                <InputLabel htmlFor="brand" value="Brand *" />
                                <select
                                    id="brand"
                                    value={data.brand}
                                    onChange={(e) => setData('brand', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select a brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.brand} className="mt-2" />
                            </div>

                            {/* Model */}
                            <div>
                                <InputLabel htmlFor="model" value="Model/Name *" />
                                <TextInput
                                    id="model"
                                    type="text"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Pegasus 40, Ghost 15, Clifton 9"
                                    required
                                />
                                <InputError message={errors.model} className="mt-2" />
                            </div>

                            {/* Color */}
                            <div>
                                <InputLabel htmlFor="color" value="Color (Optional)" />
                                <TextInput
                                    id="color"
                                    type="text"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Black/White, Blue"
                                />
                                <InputError message={errors.color} className="mt-2" />
                            </div>

                            {/* Purchase Date */}
                            <div>
                                <InputLabel htmlFor="purchase_date" value="Purchase Date (Optional)" />
                                <TextInput
                                    id="purchase_date"
                                    type="date"
                                    value={data.purchase_date}
                                    onChange={(e) => setData('purchase_date', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.purchase_date} className="mt-2" />
                            </div>

                            {/* Notes */}
                            <div>
                                <InputLabel htmlFor="notes" value="Notes (Optional)" />
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={3}
                                    placeholder="Any additional notes about this shoe..."
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            {/* Current Stats */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Current Stats</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Total Distance:</span>
                                        <span className="ml-2 font-semibold text-gray-900">{shoe.distance} km</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Status:</span>
                                        <span className={`ml-2 font-semibold ${shoe.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                                            {shoe.is_active ? 'Active' : 'Retired'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-4">
                                <Link
                                    href="/gear"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
