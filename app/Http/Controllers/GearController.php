<?php

namespace App\Http\Controllers;

use App\Models\Shoe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class GearController extends Controller
{
    /**
     * Popular running shoe brands
     */
    private function getBrands(): array
    {
        return [
            'Adidas',
            'ASICS',
            'Brooks',
            'Hoka One One',
            'Mizuno',
            'New Balance',
            'Nike',
            'On Running',
            'Puma',
            'Reebok',
            'Saucony',
            'Altra',
            'Salomon',
            'Under Armour',
            'Karhu',
            'Topo Athletic',
            'Inov-8',
            'La Sportiva',
            'Merrell',
            'Newton Running',
            'Pearl Izumi',
            'Skechers',
            'The North Face',
            'Vibram FiveFingers',
            'Xero Shoes',
            'Allbirds',
            'APL',
            'Craft',
            'Diadora',
            'Joma',
            'K-Swiss',
            'Li-Ning',
            '361 Degrees',
            'Anta',
            'Asolo',
            'Avia',
            'Bata',
            'Camel',
            'Columbia',
            'Converse',
            'Decathlon',
            'Ecco',
            'Fila',
            'Garmont',
            'Geox',
            'Hi-Tec',
            'Hummel',
            'Icebug',
            'Kalenji',
            'Keen',
            'Lotto',
            'Mammut',
            'Meindl',
            'Millet',
            'Montrail',
            'Norda',
            'Oboz',
            'Patagonia',
            'Reebok',
            'Scarpa',
            'Scott',
            'Tecnica',
            'Timberland',
            'Vasque',
            'Vivo Barefoot',
            'Other',
        ];
    }

    /**
     * Display user's shoes
     */
    public function index()
    {
        $shoes = auth()->user()->shoes()
            ->orderBy('is_active', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($shoe) {
                return [
                    'id' => $shoe->id,
                    'brand' => $shoe->brand,
                    'model' => $shoe->model,
                    'color' => $shoe->color,
                    'distance' => (float) $shoe->distance,
                    'purchase_date' => $shoe->purchase_date?->format('Y-m-d'),
                    'is_active' => $shoe->is_active,
                    'notes' => $shoe->notes,
                    'wear_percentage' => $shoe->wear_percentage,
                    'remaining_distance' => $shoe->remaining_distance,
                    'needs_replacement' => $shoe->needsReplacement(),
                ];
            });

        return Inertia::render('Gear/Index', [
            'shoes' => $shoes,
        ]);
    }

    /**
     * Show the form for creating a new shoe
     */
    public function create()
    {
        return Inertia::render('Gear/Create', [
            'brands' => $this->getBrands(),
        ]);
    }

    /**
     * Store a newly created shoe
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'color' => 'nullable|string|max:255',
            'purchase_date' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        auth()->user()->shoes()->create($validated);

        return Redirect::route('gear.index')->with('success', 'Shoe added successfully!');
    }

    /**
     * Show the form for editing a shoe
     */
    public function edit(Shoe $shoe)
    {
        // Ensure user owns this shoe
        if ($shoe->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Gear/Edit', [
            'shoe' => $shoe,
            'brands' => $this->getBrands(),
        ]);
    }

    /**
     * Update the specified shoe
     */
    public function update(Request $request, Shoe $shoe)
    {
        // Ensure user owns this shoe
        if ($shoe->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'color' => 'nullable|string|max:255',
            'purchase_date' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        $shoe->update($validated);

        return Redirect::route('gear.index')->with('success', 'Shoe updated successfully!');
    }

    /**
     * Retire a shoe
     */
    public function retire(Shoe $shoe)
    {
        // Ensure user owns this shoe
        if ($shoe->user_id !== auth()->id()) {
            abort(403);
        }

        $shoe->update(['is_active' => false]);

        return Redirect::back()->with('success', 'Shoe retired successfully!');
    }

    /**
     * Reactivate a shoe
     */
    public function reactivate(Shoe $shoe)
    {
        // Ensure user owns this shoe
        if ($shoe->user_id !== auth()->id()) {
            abort(403);
        }

        $shoe->update(['is_active' => true]);

        return Redirect::back()->with('success', 'Shoe reactivated!');
    }

    /**
     * Remove the specified shoe
     */
    public function destroy(Shoe $shoe)
    {
        // Ensure user owns this shoe
        if ($shoe->user_id !== auth()->id()) {
            abort(403);
        }

        $shoe->delete();

        return Redirect::route('gear.index')->with('success', 'Shoe deleted successfully!');
    }
}
