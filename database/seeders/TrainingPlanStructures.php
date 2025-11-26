<?php

namespace Database\Seeders;

/**
 * TrainingPlanStructures
 * Contains all training plan workout structures
 * Separated for better organization
 */
trait TrainingPlanStructures
{
    private function getIntermediate5kStructure(): array
    {
        return [
            'week_1' => [
                ['day' => 'Monday', 'workout' => 'Easy run 3 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 6x400m at 5K pace, 200m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training'],
                ['day' => 'Thursday', 'workout' => 'Tempo run: 2 km easy, 2 km at tempo pace, 1 km easy'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Long run 6 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 3 km or rest'],
            ],
            'week_2' => [
                ['day' => 'Monday', 'workout' => 'Easy run 4 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 8x400m at 5K pace, 200m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training'],
                ['day' => 'Thursday', 'workout' => 'Tempo run: 2 km easy, 3 km at tempo pace, 1 km easy'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Long run 7 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 3 km or rest'],
            ],
            'week_3' => [
                ['day' => 'Monday', 'workout' => 'Easy run 4 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 5x800m at 5K pace, 400m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training'],
                ['day' => 'Thursday', 'workout' => 'Tempo run: 2 km easy, 3 km at tempo pace, 1 km easy'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Long run 8 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 4 km or rest'],
            ],
            'week_4' => [
                ['day' => 'Monday', 'workout' => 'Easy run 3 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 4x1000m at 5K pace, 400m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training'],
                ['day' => 'Thursday', 'workout' => 'Tempo run: 2 km easy, 4 km at tempo pace, 1 km easy'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Long run 6 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 3 km or rest'],
            ],
            'week_5' => [
                ['day' => 'Monday', 'workout' => 'Easy run 4 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 6x800m at 5K pace, 400m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training'],
                ['day' => 'Thursday', 'workout' => 'Tempo run: 2 km easy, 4 km at tempo pace, 1 km easy'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Long run 8 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 4 km or rest'],
            ],
            'week_6' => [
                ['day' => 'Monday', 'workout' => 'Easy run 3 km'],
                ['day' => 'Tuesday', 'workout' => 'Easy run 4 km'],
                ['day' => 'Wednesday', 'workout' => 'Rest'],
                ['day' => 'Thursday', 'workout' => 'Easy run 3 km with 4x100m strides'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Race Day! 5K - Go for your PR!'],
                ['day' => 'Sunday', 'workout' => 'Rest and celebrate!'],
            ],
        ];
    }

    private function getAdvanced5kStructure(): array
    {
        return [
            'week_1' => [
                ['day' => 'Monday', 'workout' => 'Easy run 6 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 10x400m at 5K pace, 200m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 5 km + strength training'],
                ['day' => 'Thursday', 'workout' => 'Tempo run: 2 km easy, 5 km at tempo pace, 2 km easy'],
                ['day' => 'Friday', 'workout' => 'Rest or easy 4 km'],
                ['day' => 'Saturday', 'workout' => 'Long run 10 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 6 km'],
            ],
            'week_2' => [
                ['day' => 'Monday', 'workout' => 'Easy run 6 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 8x600m at 5K pace, 200m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 5 km + strength training'],
                ['day' => 'Thursday', 'workout' => 'Hill repeats: 8x90 sec uphill hard, jog down recovery'],
                ['day' => 'Friday', 'workout' => 'Rest or easy 4 km'],
                ['day' => 'Saturday', 'workout' => 'Long run 12 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 6 km'],
            ],
            'week_3' => [
                ['day' => 'Monday', 'workout' => 'Easy run 6 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 6x1000m at 5K pace, 400m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 5 km + strength training'],
                ['day' => 'Thursday', 'workout' => 'Tempo run: 2 km easy, 6 km at tempo pace, 2 km easy'],
                ['day' => 'Friday', 'workout' => 'Rest or easy 4 km'],
                ['day' => 'Saturday', 'workout' => 'Long run 12 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 6 km'],
            ],
            'week_4' => [
                ['day' => 'Monday', 'workout' => 'Easy run 5 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 5x1200m at 5K pace, 400m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 5 km'],
                ['day' => 'Thursday', 'workout' => 'Fartlek: 30 min with 10x(1 min hard, 1 min easy)'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Long run 8 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 5 km'],
            ],
            'week_5' => [
                ['day' => 'Monday', 'workout' => 'Easy run 6 km'],
                ['day' => 'Tuesday', 'workout' => 'Intervals: 8x800m at 5K pace, 300m recovery jog'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 5 km + strength training'],
                ['day' => 'Thursday', 'workout' => 'Tempo run: 2 km easy, 6 km at tempo pace, 2 km easy'],
                ['day' => 'Friday', 'workout' => 'Rest or easy 4 km'],
                ['day' => 'Saturday', 'workout' => 'Long run 12 km easy pace'],
                ['day' => 'Sunday', 'workout' => 'Easy run 6 km'],
            ],
            'week_6' => [
                ['day' => 'Monday', 'workout' => 'Easy run 4 km'],
                ['day' => 'Tuesday', 'workout' => 'Easy run 5 km with 6x100m strides'],
                ['day' => 'Wednesday', 'workout' => 'Rest'],
                ['day' => 'Thursday', 'workout' => 'Easy run 3 km with 4x100m strides'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Race Day! 5K - Go for your PR!'],
                ['day' => 'Sunday', 'workout' => 'Rest and celebrate!'],
            ],
        ];
    }

    private function getBeginner10kStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 10; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Rest'],
                ['day' => 'Tuesday', 'workout' => 'Easy run ' . (2 + $week) . ' km'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training 30 min'],
                ['day' => 'Thursday', 'workout' => 'Easy run ' . (3 + $week) . ' km'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => $week < 10 ? 'Long run ' . (4 + $week) . ' km' : 'Race Day! 10K'],
                ['day' => 'Sunday', 'workout' => $week < 10 ? 'Easy run or walk 30 min' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getIntermediate10kStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 8; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Easy run 5 km'],
                ['day' => 'Tuesday', 'workout' => $week < 8 ? 'Intervals: ' . (4 + $week) . 'x800m at 10K pace' : 'Easy run 4 km with strides'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training'],
                ['day' => 'Thursday', 'workout' => $week < 8 ? 'Tempo run ' . (5 + $week) . ' km' : 'Easy run 3 km'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => $week < 8 ? 'Long run ' . (8 + $week) . ' km' : 'Race Day! 10K'],
                ['day' => 'Sunday', 'workout' => $week < 8 ? 'Easy run 5 km' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getAdvanced10kStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 8; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Easy run 8 km'],
                ['day' => 'Tuesday', 'workout' => $week < 8 ? 'Intervals: ' . (6 + $week) . 'x1000m at 10K pace' : 'Easy run 6 km with strides'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 6 km + strength'],
                ['day' => 'Thursday', 'workout' => $week < 8 ? 'Tempo run ' . (8 + $week) . ' km' : 'Easy run 5 km'],
                ['day' => 'Friday', 'workout' => 'Rest or easy 5 km'],
                ['day' => 'Saturday', 'workout' => $week < 8 ? 'Long run ' . (12 + $week) . ' km' : 'Race Day! 10K - PR time!'],
                ['day' => 'Sunday', 'workout' => $week < 8 ? 'Easy run 8 km' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getBeginnerHalfStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 12; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Rest'],
                ['day' => 'Tuesday', 'workout' => 'Easy run ' . (3 + floor($week/2)) . ' km'],
                ['day' => 'Wednesday', 'workout' => 'Cross-training 30-45 min'],
                ['day' => 'Thursday', 'workout' => 'Easy run ' . (4 + floor($week/2)) . ' km'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => $week < 12 ? 'Long run ' . (8 + $week) . ' km' : 'Race Day! Half Marathon'],
                ['day' => 'Sunday', 'workout' => $week < 12 ? 'Easy run or walk 30 min' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getIntermediateHalfStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 12; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Rest or easy 5 km'],
                ['day' => 'Tuesday', 'workout' => $week < 12 ? 'Tempo run ' . (6 + floor($week/2)) . ' km' : 'Easy run 5 km'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 6 km'],
                ['day' => 'Thursday', 'workout' => $week < 12 ? 'Intervals: ' . (4 + floor($week/3)) . 'x1600m' : 'Easy run 4 km with strides'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => $week < 12 ? 'Long run ' . (12 + $week) . ' km' : 'Race Day! Half Marathon'],
                ['day' => 'Sunday', 'workout' => $week < 12 ? 'Easy run 6 km' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getAdvancedHalfStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 12; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Easy run 8 km'],
                ['day' => 'Tuesday', 'workout' => $week < 12 ? 'Tempo run ' . (8 + floor($week/2)) . ' km' : 'Easy run 6 km with strides'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 8 km + strength'],
                ['day' => 'Thursday', 'workout' => $week < 12 ? 'Intervals: ' . (5 + floor($week/3)) . 'x1600m at HM pace' : 'Easy run 5 km'],
                ['day' => 'Friday', 'workout' => 'Rest or easy 6 km'],
                ['day' => 'Saturday', 'workout' => $week < 12 ? 'Long run ' . (15 + $week) . ' km' : 'Race Day! Half Marathon - PR time!'],
                ['day' => 'Sunday', 'workout' => $week < 12 ? 'Easy run 8 km' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getBeginnerMarathonStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 16; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Rest'],
                ['day' => 'Tuesday', 'workout' => 'Easy run ' . (5 + floor($week/2)) . ' km'],
                ['day' => 'Wednesday', 'workout' => 'Cross-training 45 min'],
                ['day' => 'Thursday', 'workout' => 'Easy run ' . (6 + floor($week/2)) . ' km'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => $week < 16 ? 'Long run ' . (12 + $week * 1.5) . ' km' : 'Race Day! Marathon'],
                ['day' => 'Sunday', 'workout' => $week < 16 ? 'Easy run or walk 30-45 min' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getIntermediateMarathonStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 16; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Rest or easy 6 km'],
                ['day' => 'Tuesday', 'workout' => $week < 16 ? 'Tempo run ' . (8 + floor($week/2)) . ' km' : 'Easy run 6 km'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 8 km'],
                ['day' => 'Thursday', 'workout' => $week < 16 ? 'Intervals or hill repeats ' . (6 + floor($week/3)) . ' km' : 'Easy run 5 km with strides'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => $week < 16 ? 'Long run ' . (16 + $week * 1.5) . ' km' : 'Race Day! Marathon'],
                ['day' => 'Sunday', 'workout' => $week < 16 ? 'Easy run 8 km' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getAdvancedMarathonStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 18; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Easy run 10 km'],
                ['day' => 'Tuesday', 'workout' => $week < 18 ? 'Tempo run ' . (10 + floor($week/2)) . ' km' : 'Easy run 8 km with strides'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 10 km + strength'],
                ['day' => 'Thursday', 'workout' => $week < 18 ? 'Intervals: ' . (6 + floor($week/3)) . 'x1600m at MP' : 'Easy run 6 km'],
                ['day' => 'Friday', 'workout' => 'Rest or easy 8 km'],
                ['day' => 'Saturday', 'workout' => $week < 18 ? 'Long run ' . (20 + $week * 1.5) . ' km' : 'Race Day! Marathon - BQ time!'],
                ['day' => 'Sunday', 'workout' => $week < 18 ? 'Easy run 10 km' : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }

    private function getUltraStructure(): array
    {
        $weeks = [];
        for ($week = 1; $week <= 20; $week++) {
            $weeks["week_$week"] = [
                ['day' => 'Monday', 'workout' => 'Rest or easy 8 km'],
                ['day' => 'Tuesday', 'workout' => $week < 20 ? 'Easy run ' . (10 + floor($week/2)) . ' km' : 'Easy run 8 km'],
                ['day' => 'Wednesday', 'workout' => 'Easy run 10 km + strength'],
                ['day' => 'Thursday', 'workout' => $week < 20 ? 'Tempo or hill run ' . (12 + floor($week/2)) . ' km' : 'Easy run 6 km'],
                ['day' => 'Friday', 'workout' => 'Rest or easy 8 km'],
                ['day' => 'Saturday', 'workout' => $week < 20 ? 'Long run ' . (25 + $week * 2) . ' km' : 'Race Day! Ultra Marathon'],
                ['day' => 'Sunday', 'workout' => $week < 20 ? ($week % 2 == 0 ? 'Back-to-back long run ' . (15 + $week) . ' km' : 'Easy run 10 km') : 'Rest and celebrate!'],
            ];
        }
        return $weeks;
    }
}
