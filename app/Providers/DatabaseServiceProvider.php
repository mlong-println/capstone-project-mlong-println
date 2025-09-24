<?php

namespace App\Providers;

use App\Services\DatabaseService;
use Illuminate\Support\ServiceProvider;

/**
 * DatabaseServiceProvider - Registers our raw SQL database service
 * Handles dependency injection and service container binding
 */
class DatabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services with Laravel's container
     * Binds DatabaseService as a singleton for efficient connection reuse
     */
    public function register()
    {
        // Register DatabaseService as a singleton
        // This ensures only one database connection exists throughout the app
        $this->app->singleton(DatabaseService::class, function ($app) {
            return new DatabaseService();
        });
    }
}