<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users if they don't exist
        $users = [
            [
                'name' => 'John Runner',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'runner',
            ],
            [
                'name' => 'Jane Runner',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'role' => 'runner',
            ],
            [
                'name' => 'Mike Trainer',
                'email' => 'mike@example.com',
                'password' => Hash::make('password'),
                'role' => 'trainer',
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('Test users created successfully!');
        $this->command->info('Login credentials: email / password');
    }
}
