<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

/**
 * RouteSnapController
 * Handles route snapping to pedestrian paths using Google Maps Directions API
 */
class RouteSnapController extends Controller
{
    /**
     * Snap waypoints to walking/pedestrian paths including park trails
     * Uses Google Maps Directions API for best pedestrian path coverage
     */
    public function snap(Request $request)
    {
        $waypoints = $request->input('waypoints');
        
        if (!$waypoints || count($waypoints) < 2) {
            return response()->json(['error' => 'At least 2 waypoints required'], 400);
        }

        try {
            // Google Maps API Key - add to .env as GOOGLE_MAPS_API_KEY
            $apiKey = env('GOOGLE_MAPS_API_KEY');
            
            if (!$apiKey) {
                \Log::warning('Google Maps API key not configured, using straight lines');
                return response()->json([
                    'success' => false,
                    'coordinates' => $waypoints,
                    'message' => 'Google Maps API key not configured'
                ]);
            }
            
            // Build Google Directions API request
            $origin = "{$waypoints[0]['lat']},{$waypoints[0]['lng']}";
            $destination = "{$waypoints[count($waypoints) - 1]['lat']},{$waypoints[count($waypoints) - 1]['lng']}";
            
            // Middle waypoints
            $waypointStr = '';
            if (count($waypoints) > 2) {
                $middlePoints = array_slice($waypoints, 1, count($waypoints) - 2);
                $waypointStr = '&waypoints=' . collect($middlePoints)
                    ->map(fn($w) => "{$w['lat']},{$w['lng']}")
                    ->join('|');
            }
            
            $url = "https://maps.googleapis.com/maps/api/directions/json"
                . "?origin={$origin}"
                . "&destination={$destination}"
                . $waypointStr
                . "&mode=walking"  // Walking mode includes park paths and trails
                . "&key={$apiKey}";
            
            \Log::info('Google Maps Directions API request', ['url' => $url]);
            
            $response = Http::timeout(15)->get($url);
            
            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['status'] === 'OK' && isset($data['routes'][0]['overview_polyline']['points'])) {
                    // Decode the polyline
                    $polyline = $data['routes'][0]['overview_polyline']['points'];
                    $coordinates = $this->decodePolyline($polyline);
                    
                    \Log::info('Route snapped successfully', ['points' => count($coordinates)]);
                    
                    return response()->json([
                        'success' => true,
                        'coordinates' => $coordinates,
                        'distance' => $data['routes'][0]['legs'][0]['distance']['value'] ?? null,
                    ]);
                } else {
                    \Log::warning('Google Maps API returned error', ['status' => $data['status']]);
                }
            }
            
            // Fallback to straight lines if API fails
            return response()->json([
                'success' => false,
                'coordinates' => $waypoints,
                'message' => 'Route snapping unavailable, using straight lines'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Route snapping error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'coordinates' => $waypoints,
                'message' => 'Route snapping failed: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Decode Google Maps polyline format
     */
    private function decodePolyline($encoded)
    {
        $length = strlen($encoded);
        $index = 0;
        $points = [];
        $lat = 0;
        $lng = 0;

        while ($index < $length) {
            // Decode latitude
            $result = 0;
            $shift = 0;
            do {
                $b = ord($encoded[$index++]) - 63;
                $result |= ($b & 0x1f) << $shift;
                $shift += 5;
            } while ($b >= 0x20);
            $dlat = (($result & 1) ? ~($result >> 1) : ($result >> 1));
            $lat += $dlat;

            // Decode longitude
            $result = 0;
            $shift = 0;
            do {
                $b = ord($encoded[$index++]) - 63;
                $result |= ($b & 0x1f) << $shift;
                $shift += 5;
            } while ($b >= 0x20);
            $dlng = (($result & 1) ? ~($result >> 1) : ($result >> 1));
            $lng += $dlng;

            $points[] = [
                'lat' => $lat / 1e5,
                'lng' => $lng / 1e5
            ];
        }

        return $points;
    }
}
