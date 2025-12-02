<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Route;
use App\Models\User;

class PublicRoutesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 10 public routes in Hamilton area under Michael Long's profile
     */
    public function run(): void
    {
        // Get Michael Long (admin, user_id: 1) as the creator
        $michael = User::find(1);

        if (!$michael) {
            $this->command->warn('User with ID 1 (Michael Long - Admin) not found. Skipping route seeding.');
            return;
        }

        $routes = [
            // 1. Easy - Short beginner route
            [
                'name' => 'Gage Park Beginner Loop',
                'description' => 'Perfect starter route around Gage Park. Flat, well-maintained paths through the park and surrounding residential streets. Ideal for new runners building confidence.',
                'distance' => 3.2,
                'difficulty' => 'easy',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2456, 'lng' => -79.8456],
                    ['lat' => 43.2467, 'lng' => -79.8467],
                    ['lat' => 43.2478, 'lng' => -79.8478],
                    ['lat' => 43.2467, 'lng' => -79.8467],
                    ['lat' => 43.2456, 'lng' => -79.8456],
                ]),
            ],
            // 2. Easy - Flat waterfront
            [
                'name' => 'Confederation to Burlington Pier',
                'description' => 'Scenic waterfront route from Confederation Park to Burlington Pier and back. Completely flat, paved trail with stunning lake views. Perfect for easy long runs.',
                'distance' => 14.5,
                'difficulty' => 'easy',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2701, 'lng' => -79.8711],
                    ['lat' => 43.2689, 'lng' => -79.8756],
                    ['lat' => 43.2678, 'lng' => -79.8801],
                    ['lat' => 43.2667, 'lng' => -79.8856],
                    ['lat' => 43.2656, 'lng' => -79.8911],
                ]),
            ],
            // 3. Easy - Westdale neighborhood
            [
                'name' => 'Westdale Village Circuit',
                'description' => 'Charming route through Westdale neighborhood. Quiet tree-lined streets with minimal traffic. Starts and finishes near Fairweather Brewery for post-run refreshments!',
                'distance' => 6.8,
                'difficulty' => 'easy',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2609, 'lng' => -79.9192],
                    ['lat' => 43.2621, 'lng' => -79.9178],
                    ['lat' => 43.2633, 'lng' => -79.9165],
                    ['lat' => 43.2621, 'lng' => -79.9178],
                    ['lat' => 43.2609, 'lng' => -79.9192],
                ]),
            ],
            // 4. Moderate - Rolling hills
            [
                'name' => 'McMaster to Dundurn Loop',
                'description' => 'Moderate route with rolling hills connecting McMaster campus to Dundurn Castle. Mix of campus paths and city streets. Good for building strength.',
                'distance' => 9.3,
                'difficulty' => 'moderate',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2609, 'lng' => -79.9192],
                    ['lat' => 43.2634, 'lng' => -79.9012],
                    ['lat' => 43.2656, 'lng' => -79.8856],
                    ['lat' => 43.2634, 'lng' => -79.9012],
                    ['lat' => 43.2609, 'lng' => -79.9192],
                ]),
            ],
            // 5. Moderate - Gradual elevation
            [
                'name' => 'Chedoke Radial Trail',
                'description' => 'Historic rail trail with gradual but steady climb from lower city to mountain. Great for tempo runs and threshold training without brutal hills.',
                'distance' => 11.2,
                'difficulty' => 'moderate',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2456, 'lng' => -79.9012],
                    ['lat' => 43.2478, 'lng' => -79.9034],
                    ['lat' => 43.2501, 'lng' => -79.9056],
                    ['lat' => 43.2523, 'lng' => -79.9078],
                    ['lat' => 43.2545, 'lng' => -79.9101],
                ]),
            ],
            // 6. Moderate - Mixed terrain
            [
                'name' => 'Red Hill Valley Trail',
                'description' => 'Long paved trail following Red Hill Creek with gentle rolling sections. Mostly flat with occasional small hills. Perfect for marathon training.',
                'distance' => 16.8,
                'difficulty' => 'moderate',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2234, 'lng' => -79.8012],
                    ['lat' => 43.2256, 'lng' => -79.8034],
                    ['lat' => 43.2278, 'lng' => -79.8056],
                    ['lat' => 43.2301, 'lng' => -79.8078],
                    ['lat' => 43.2323, 'lng' => -79.8101],
                ]),
            ],
            // 7. Hard - Technical trail
            [
                'name' => 'Bruce Trail: Albion to Tiffany Falls',
                'description' => 'Challenging technical trail from Albion Falls to Tiffany Falls. Roots, rocks, steep climbs, and waterfall views. True trail running - bring proper shoes and expect 600m+ elevation gain.',
                'distance' => 22.4,
                'difficulty' => 'hard',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2890, 'lng' => -79.7856],
                    ['lat' => 43.2912, 'lng' => -79.7878],
                    ['lat' => 43.2934, 'lng' => -79.7901],
                    ['lat' => 43.2956, 'lng' => -79.7923],
                    ['lat' => 43.2978, 'lng' => -79.7945],
                ]),
            ],
            // 8. Hard - Stairs and elevation
            [
                'name' => 'Escarpment Stairs Circuit',
                'description' => 'Brutal workout hitting Wentworth, James, and Dundurn stairs. Over 1000 steps total with steep climbs between. This is serious hill training - not for the faint of heart.',
                'distance' => 13.7,
                'difficulty' => 'hard',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2567, 'lng' => -79.8712],
                    ['lat' => 43.2589, 'lng' => -79.8734],
                    ['lat' => 43.2612, 'lng' => -79.8756],
                    ['lat' => 43.2634, 'lng' => -79.8778],
                    ['lat' => 43.2656, 'lng' => -79.8801],
                ]),
            ],
            // 9. Hard - Long distance with hills
            [
                'name' => 'Around the Bay 30K Training Route',
                'description' => 'Full Around the Bay race simulation. Starts Cannon/Kenilworth, down Woodward to waterfront, around the bay via North Shore, up Plains/York, finish at Cannon Coffee. Hills, distance, and grit.',
                'distance' => 30.0,
                'difficulty' => 'hard',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2534, 'lng' => -79.8312],
                    ['lat' => 43.2556, 'lng' => -79.8534],
                    ['lat' => 43.2578, 'lng' => -79.8756],
                    ['lat' => 43.2601, 'lng' => -79.8678],
                    ['lat' => 43.2534, 'lng' => -79.8312],
                ]),
            ],
            // 10. Hard - Ultra distance trail
            [
                'name' => 'Hamilton to Dundas Peak Ultra',
                'description' => 'Epic trail adventure from downtown Hamilton to Dundas Peak and back. Mix of urban, trail, and technical terrain. 1200m+ elevation gain. Bring hydration pack and snacks - this is an all-day adventure.',
                'distance' => 35.6,
                'difficulty' => 'hard',
                'created_by' => $michael->id,
                'is_public' => true,
                'coordinates' => json_encode([
                    ['lat' => 43.2567, 'lng' => -79.8712],
                    ['lat' => 43.2689, 'lng' => -79.9012],
                    ['lat' => 43.2789, 'lng' => -79.9567],
                    ['lat' => 43.2689, 'lng' => -79.9012],
                    ['lat' => 43.2567, 'lng' => -79.8712],
                ]),
            ],
        ];

        foreach ($routes as $routeData) {
            Route::create($routeData);
        }

        $this->command->info('10 public routes created successfully under Michael Long\'s profile!');
    }
}
