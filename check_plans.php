<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Total plans: " . \App\Models\TrainingPlan::count() . PHP_EOL;
echo "Public template plans: " . \App\Models\TrainingPlan::where('is_public', true)->where('is_template', true)->count() . PHP_EOL;
echo PHP_EOL . "List of public template plans:" . PHP_EOL;

\App\Models\TrainingPlan::where('is_public', true)
    ->where('is_template', true)
    ->select('id', 'name', 'distance_type')
    ->get()
    ->each(function($p) {
        echo $p->id . ' - ' . $p->name . ' (' . $p->distance_type . ')' . PHP_EOL;
    });
