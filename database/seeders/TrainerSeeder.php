<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;

/**
 * TrainerSeeder
 * Seeds the database with the primary trainer account (Michael Long)
 * Creates user and associated profile with credentials and experience
 * Based in Hamilton, ON, Canada
 */
class TrainerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if trainer already exists
        $existingTrainer = User::where('email', 'michael.long@runconnect.com')->first();
        
        if ($existingTrainer) {
            $this->command->info('Trainer account already exists. Skipping...');
            return;
        }

        // Create trainer user account
        $trainer = User::create([
            'name' => 'Michael Long',
            'email' => 'michael.long@runconnect.com',
            'password' => Hash::make('password'), // Change this in production!
            'role' => 'trainer',
            'email_verified_at' => now(),
        ]);

        // Create trainer profile with experience and credentials
        Profile::create([
            'user_id' => $trainer->id,
            'bio' => 'Experienced running coach based in Hamilton, ON, specializing in marathon training, injury prevention, and performance optimization. Passionate about helping local runners of all levels achieve their goals.',
            'location' => 'Hamilton, ON',
            'profile_picture' => null, // Can be added later
            
            // Trainer-specific fields
            'certifications' => json_encode([
                'RRCA Certified Running Coach',
                'USATF Level 1 Coach',
                'CPR/First Aid Certified',
            ]),
            'years_experience' => 10,
            'specialties' => '5K training, 10K training, Half Marathon training, Full Marathon training, Ultra Marathon training, Injury prevention, Performance optimization',
            
            // Privacy settings
            'profile_public' => true,
            'show_stats' => true,
        ]);

        $this->command->info('Trainer account created successfully!');
        $this->command->info('Email: michael.long@runconnect.com');
        $this->command->info('Password: password');
        $this->command->info('Location: Hamilton, ON');
    }
}