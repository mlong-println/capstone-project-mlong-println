<?php

use Illuminate\Support\Facades\Route;
use App\Services\DatabaseService;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-db', function () {
    try {
        $db = app(DatabaseService::class);
        $result = $db->executeQuery("SELECT 1");
        return "Database connection successful!";
    } catch (\Exception $e) {
        return "Connection failed: " . $e->getMessage();
    }
});