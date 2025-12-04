<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Removing duplicate plans (IDs 14-26)..." . PHP_EOL;

$deleted = \App\Models\TrainingPlan::whereIn('id', [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26])->delete();

echo "Deleted {$deleted} duplicate plans." . PHP_EOL;
echo PHP_EOL . "Remaining plans: " . \App\Models\TrainingPlan::count() . PHP_EOL;
