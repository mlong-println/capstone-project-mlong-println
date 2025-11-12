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
        // Only register DatabaseService in non-testing environments
        // Tests use Laravel's built-in database connections
        if (!$this->app->environment('testing')) {
            $this->app->singleton(DatabaseService::class, function ($app) {
                return new DatabaseService();
            });
        }
    }
}