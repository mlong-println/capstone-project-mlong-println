<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Michael Long (admin, user_id: 1) as the organizer
        $michael = User::find(1);

        if (!$michael) {
            $this->command->warn('User with ID 1 (Michael Long - Admin) not found. Skipping event seeding.');
            return;
        }

        // Get next Saturday for weekly events
        $nextSaturday = Carbon::now()->next(Carbon::SATURDAY);
        $nextSunday = Carbon::now()->next(Carbon::SUNDAY);

        $events = [
            [
                'title' => 'Saturday Westdale Brewery Run',
                'description' => 'Weekly run around Westdale! Starting and finishing at Fairweather Brewery. 8km route through the beautiful Westdale neighborhood. Open to all skill levels - whether you\'re a beginner or experienced runner, everyone is welcome. Post-run refreshments at the brewery! Meets every Saturday.',
                'location' => 'Fairweather Brewery, Westdale',
                'event_date' => $nextSaturday->copy()->setTime(9, 0),
                'max_participants' => 30,
                'organizer_id' => $michael->id,
                'status' => 'upcoming',
                'distance_km' => 8,
            ],
            [
                'title' => 'Sunday Waterfront to Burlington Pier',
                'description' => 'Weekly scenic waterfront run starting at Confederation Park, running to Burlington Pier and back. Perfect for 10-15k runners. No pressure - stop or turn back whenever you want or need to. Enjoy the beautiful lakefront views at your own pace! Meets every Sunday.',
                'location' => 'Confederation Park, Hamilton Waterfront',
                'event_date' => $nextSunday->copy()->setTime(8, 30),
                'max_participants' => 25,
                'organizer_id' => $michael->id,
                'status' => 'upcoming',
                'distance_km' => 12.5,
            ],
            [
                'title' => 'Saturday Bruce Trail Adventure',
                'description' => 'Weekly trail run tackling the Bruce Trail from Albion Falls parking lot to Tiffany Falls and back. For experienced trail running enthusiasts - route will likely be 20km+. Expect technical terrain, elevation changes, and stunning waterfall views. Bring proper trail shoes and hydration! Meets every Saturday.',
                'location' => 'Albion Falls Parking Lot',
                'event_date' => $nextSaturday->copy()->setTime(8, 0),
                'max_participants' => 15,
                'organizer_id' => $michael->id,
                'status' => 'upcoming',
                'distance_km' => 20,
                'difficulty' => 'hard',
            ],
            [
                'title' => 'Sunday Around the Bay Training',
                'description' => 'Weekly training run for Around the Bay 30K! Route: Start at Cannon/Kenilworth, down Woodward to waterfront, wrap around the bay using North Shore, connect to Plains/York Blvd, finish at Cannon/Kenilworth. Post-run coffee at Cannon Coffee. Perfect preparation for race day! Meets every Sunday.',
                'location' => 'Cannon St & Kenilworth Ave',
                'event_date' => $nextSunday->copy()->setTime(8, 0),
                'max_participants' => 40,
                'organizer_id' => $michael->id,
                'status' => 'upcoming',
                'distance_km' => 30,
                'difficulty' => 'hard',
            ],
            [
                'title' => 'Saturday New Runners: Gage Park 5K',
                'description' => 'Weekly beginner-friendly walk/run event in Gage Park! 5km route starting at the water fountain. This is a no-pressure, supportive environment for new runners. Walk, run, or do a mix of both - finish where you can! Perfect for those just starting their running journey. Meets every Saturday.',
                'location' => 'Gage Park Water Fountain',
                'event_date' => $nextSaturday->copy()->setTime(10, 0),
                'max_participants' => 50,
                'organizer_id' => $michael->id,
                'status' => 'upcoming',
                'distance_km' => 5,
                'difficulty' => 'easy',
            ],
        ];

        foreach ($events as $eventData) {
            Event::create($eventData);
        }

        $this->command->info('5 sample events created successfully!');
    }
}
