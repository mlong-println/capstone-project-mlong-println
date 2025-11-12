<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Only register DatabaseService in non-testing environments
        if (!$this->app->environment('testing')) {
            $this->app->singleton(\App\Services\DatabaseService::class, function ($app) {
                return new \App\Services\DatabaseService();
            });
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
