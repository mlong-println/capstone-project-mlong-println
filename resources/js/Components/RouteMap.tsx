import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface Coordinate {
    lat: number;
    lng: number;
}

interface RouteMapProps {
    coordinates: Coordinate[];
    onCoordinatesChange?: (coords: Coordinate[]) => void;
    editable?: boolean;
    height?: string;
    enableRoadSnapping?: boolean;
}

/**
 * MapClickHandler
 * Handles map click events to add waypoints when in editable mode
 */
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

/**
 * RouteMap Component
 * Interactive map for creating and viewing running routes
 * 
 * Features:
 * - Click to add waypoints when editable
 * - Displays route as polyline connecting waypoints
 * - Shows markers at each waypoint
 * - Calculates approximate distance
 */
export default function RouteMap({ 
    coordinates, 
    onCoordinatesChange, 
    editable = false,
    height = '400px',
    enableRoadSnapping = false  // Default to OFF - straight lines work better for park trails
}: RouteMapProps) {
    // Ensure coordinates is always an array
    const safeCoordinates = Array.isArray(coordinates) ? coordinates : [];
    
    const [localCoords, setLocalCoords] = useState<Coordinate[]>(safeCoordinates);
    const [routePath, setRoutePath] = useState<Coordinate[]>([]); // Actual road-snapped path
    const [elevations, setElevations] = useState<number[]>([]);
    const [loadingElevation, setLoadingElevation] = useState(false);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [roadSnapping, setRoadSnapping] = useState(true);  // Start with snapping ON for Google Maps
    const mapRef = useRef<L.Map | null>(null);
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Default center - Hamilton, Ontario, Canada
    const defaultCenter: [number, number] = [43.2557, -79.8711]; // Hamilton, ON
    const defaultZoom = 13;

    // Sync with parent coordinates
    useEffect(() => {
        setLocalCoords(safeCoordinates);
    }, [coordinates]);

    // Handle route snapping when localCoords changes
    useEffect(() => {
        // Clear any pending fetch
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }
        
        if (localCoords.length === 0) {
            setRoutePath([]);
            setElevations([]);
            return;
        }
        
        if (localCoords.length === 1) {
            setRoutePath(localCoords);
            return;
        }
        
        // For 2+ waypoints, fetch route path if road snapping is enabled AND editable
        if (roadSnapping && editable) {
            fetchTimeoutRef.current = setTimeout(() => {
                fetchRoutePath(localCoords);
            }, 300); // Small delay to batch rapid clicks
        } else {
            // Use straight lines between waypoints (or when viewing non-editable routes)
            setRoutePath(localCoords);
            if (editable) {
                fetchElevations(localCoords);
            }
        }
        
        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [localCoords, roadSnapping]);

    // Fetch route snapping via Laravel backend
    const fetchRoutePath = async (waypoints: Coordinate[]) => {
        if (waypoints.length < 2) return;
        
        setLoadingRoute(true);
        try {
            console.log('🗺️ Snapping route with', waypoints.length, 'waypoints...');
            
            const response = await fetch('/api/route-snap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ waypoints }),
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Route snap response:', data);
                
                if (data.success && data.coordinates && data.coordinates.length > 0) {
                    console.log('✅ Route snapped successfully with', data.coordinates.length, 'points');
                    setRoutePath(data.coordinates);
                    fetchElevations(data.coordinates);
                } else {
                    console.warn('⚠️ Route snapping returned no coordinates, using waypoints');
                    setRoutePath(waypoints);
                    fetchElevations(waypoints);
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Route snapping API error:', response.status, errorText);
                setRoutePath(waypoints);
                fetchElevations(waypoints);
            }
        } catch (error) {
            console.error('❌ Failed to fetch route path:', error);
            setRoutePath(waypoints);
            fetchElevations(waypoints);
        } finally {
            setLoadingRoute(false);
        }
    };

    // Fetch elevation data from Open-Elevation API
    const fetchElevations = async (coords: Coordinate[]) => {
        if (coords.length === 0) return;
        
        setLoadingElevation(true);
        try {
            const locations = coords.map(c => ({ latitude: c.lat, longitude: c.lng }));
            const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locations }),
            });
            
            if (response.ok) {
                const data = await response.json();
                const elevs = data.results.map((r: any) => r.elevation);
                setElevations(elevs);
            }
        } catch (error) {
            console.error('Failed to fetch elevation data:', error);
        } finally {
            setLoadingElevation(false);
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        if (!editable) return;

        const newCoords = [...localCoords, { lat, lng }];
        setLocalCoords(newCoords);
        
        // Immediately notify parent of user waypoints (not snapped path)
        if (onCoordinatesChange) {
            onCoordinatesChange(newCoords);
        }
    };

    const handleClearRoute = () => {
        setLocalCoords([]);
        if (onCoordinatesChange) {
            onCoordinatesChange([]);
        }
    };

    const handleUndoLast = () => {
        if (localCoords.length === 0) return;
        
        const newCoords = localCoords.slice(0, -1);
        setLocalCoords(newCoords);
        
        if (onCoordinatesChange) {
            onCoordinatesChange(newCoords);
        }
    };

    // Calculate distance using the road-snapped path (more accurate)
    const calculateDistance = () => {
        const pathToUse = routePath.length >= 2 ? routePath : localCoords;
        if (pathToUse.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 0; i < pathToUse.length - 1; i++) {
            const lat1 = pathToUse[i].lat;
            const lon1 = pathToUse[i].lng;
            const lat2 = pathToUse[i + 1].lat;
            const lon2 = pathToUse[i + 1].lng;

            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            totalDistance += R * c;
        }

        return totalDistance.toFixed(2);
    };

    // Calculate elevation gain and loss
    const calculateElevationStats = () => {
        if (elevations.length < 2) return { gain: 0, loss: 0 };

        let totalGain = 0;
        let totalLoss = 0;

        for (let i = 1; i < elevations.length; i++) {
            const diff = elevations[i] - elevations[i - 1];
            if (diff > 0) {
                totalGain += diff;
            } else {
                totalLoss += Math.abs(diff);
            }
        }

        return { 
            gain: Math.round(totalGain), 
            loss: Math.round(totalLoss) 
        };
    };

    // Use default center (Hamilton) - let users pan/zoom freely
    // Don't auto-center on coordinates to allow exploring the map
    const mapCenter: [number, number] = defaultCenter;

    return (
        <div className="space-y-3">
            {editable && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm text-blue-800">
                            <strong>Click on the map</strong> to add waypoints
                            {roadSnapping ? ' - route will snap to roads/paths' : ' - straight lines between points'}
                            {loadingRoute && <span className="ml-2 text-blue-600">⏳ Calculating route...</span>}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setRoadSnapping(!roadSnapping)}
                                className={`px-3 py-1 text-sm rounded transition ${
                                    roadSnapping 
                                        ? 'bg-green-600 text-white hover:bg-green-700' 
                                        : 'bg-gray-600 text-white hover:bg-gray-700'
                                }`}
                            >
                                {roadSnapping ? '🛣️ Road Snap: ON' : '📍 Direct Lines'}
                            </button>
                            {localCoords.length > 0 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleUndoLast}
                                        className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                                    >
                                        Undo Last
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClearRoute}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Clear Route
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm" style={{ height }}>
                <MapContainer
                    center={mapCenter}
                    zoom={defaultZoom}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {editable && <MapClickHandler onMapClick={handleMapClick} />}
                    
                    {/* Draw road-snapped route */}
                    {routePath.length > 1 && (
                        <Polyline
                            positions={routePath.map(coord => [coord.lat, coord.lng])}
                            color="#2563eb"
                            weight={5}
                            opacity={0.8}
                        />
                    )}
                    
                    {/* Show markers at each waypoint (user clicks) */}
                    {localCoords.map((coord, index) => (
                        <Marker
                            key={index}
                            position={[coord.lat, coord.lng]}
                            title={`Waypoint ${index + 1}`}
                        />
                    ))}
                </MapContainer>
            </div>

            {editable && localCoords.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="text-gray-600">Waypoints</div>
                            <div className="text-lg font-semibold text-gray-900">{localCoords.length}</div>
                        </div>
                        {localCoords.length > 1 && (
                            <div>
                                <div className="text-gray-600">Estimated Distance</div>
                                <div className="text-lg font-semibold text-gray-900">{calculateDistance()} km</div>
                            </div>
                        )}
                        {elevations.length > 1 && (
                            <>
                                <div>
                                    <div className="text-gray-600">Elevation Gain</div>
                                    <div className="text-lg font-semibold text-green-600">
                                        ↑ {calculateElevationStats().gain}m
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Elevation Loss</div>
                                    <div className="text-lg font-semibold text-red-600">
                                        ↓ {calculateElevationStats().loss}m
                                    </div>
                                </div>
                            </>
                        )}
                        {loadingElevation && (
                            <div className="col-span-2 text-gray-500 text-xs">
                                Loading elevation data...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
