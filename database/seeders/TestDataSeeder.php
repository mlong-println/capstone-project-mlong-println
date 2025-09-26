<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Services\DatabaseService;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds test data for RunConnect development
 * Creates users, routes, runs, and ratings
 */
class TestDataSeeder extends Seeder
{
    public function run()
    {
        $db = app(DatabaseService::class);

        // Create test users with hashed passwords
        $sql = "INSERT INTO users (name, email, password, role) VALUES 
            (?, ?, ?, ?),
            (?, ?, ?, ?)";
        
        $db->executeQuery($sql, [
            'Test Runner',
            'runner@test.com',
            Hash::make('password123'),
            'runner',
            
            'Test Trainer',
            'trainer@test.com',
            Hash::make('password123'),
            'trainer'
        ]);
    }
}