import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, CircleMarker, useMapEvents } from 'react-leaflet';
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

// Component to auto-fit map bounds to route
function MapBoundsUpdater({ coordinates }: { coordinates: Coordinate[] }) {
    const map = useMapEvents({});
    
    useEffect(() => {
        if (coordinates.length > 0) {
            const bounds = L.latLngBounds(coordinates.map(c => [c.lat, c.lng]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [coordinates, map]);
    
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
    const [waypoints, setWaypoints] = useState<Coordinate[]>([]); // User-clicked waypoints only
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

    // Sync with parent coordinates - only on initial load, not when we update parent
    const initialLoadRef = useRef(true);
    useEffect(() => {
        // Only sync on initial load or when coordinates are cleared
        if (initialLoadRef.current || safeCoordinates.length === 0) {
            initialLoadRef.current = false;
            setLocalCoords(safeCoordinates);
            // If loading existing route with many points, it's already snapped - don't re-snap
            if (safeCoordinates.length > 20) {
                setRoutePath(safeCoordinates);
                setWaypoints([]); // No waypoints to show for existing routes
            } else if (safeCoordinates.length > 0) {
                setWaypoints(safeCoordinates);
            }
        }
    }, [coordinates]);

    // Handle route snapping when waypoints change
    useEffect(() => {
        // Clear any pending fetch
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }
        
        if (waypoints.length === 0) {
            // If no waypoints but we have localCoords (existing route), use them
            if (localCoords.length > 0) {
                setRoutePath(localCoords);
            } else {
                setRoutePath([]);
                setElevations([]);
            }
            return;
        }
        
        if (waypoints.length === 1) {
            setRoutePath(waypoints);
            return;
        }
        
        // For 2+ waypoints, fetch route path if road snapping is enabled AND editable
        if (roadSnapping && editable && waypoints.length >= 2) {
            fetchTimeoutRef.current = setTimeout(() => {
                fetchRoutePath(waypoints);
            }, 300); // Small delay to batch rapid clicks
        } else {
            // Use straight lines between waypoints
            setRoutePath(waypoints);
        }
        
        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [waypoints, roadSnapping, editable]);

    // Fetch route snapping via Laravel backend using axios (handles CSRF automatically)
    const fetchRoutePath = async (waypoints: Coordinate[]) => {
        if (waypoints.length < 2) return;
        
        setLoadingRoute(true);
        try {
            console.log('🗺️ Snapping route with', waypoints.length, 'waypoints...');
            
            const response = await window.axios.post('/api/route-snap', { waypoints });
            const data = response.data;
            
            console.log('✅ Route snap response:', data);
            
            if (data.success && data.coordinates && data.coordinates.length > 0) {
                console.log('✅ Route snapped successfully with', data.coordinates.length, 'points');
                const snappedCoords = data.coordinates;
                setRoutePath(snappedCoords);
                // Disable elevation fetching - API is unreliable and causes CORS spam
                // fetchElevations(snappedCoords);
                
                // Update parent with snapped coordinates (not waypoints)
                if (onCoordinatesChange) {
                    onCoordinatesChange(snappedCoords);
                }
            } else {
                console.warn('⚠️ Route snapping returned no coordinates, using waypoints');
                setRoutePath(waypoints);
                // fetchElevations(waypoints);
            }
        } catch (error: any) {
            console.error('❌ Failed to fetch route path:', error.response?.status, error.message);
            setRoutePath(waypoints);
            // fetchElevations(waypoints);
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

        const newWaypoint = { lat, lng };
        const newWaypoints = [...waypoints, newWaypoint];
        setWaypoints(newWaypoints);
        setLocalCoords(newWaypoints); // Trigger snapping
    };

    const handleClearRoute = () => {
        setWaypoints([]);
        setLocalCoords([]);
        setRoutePath([]);
        
        if (onCoordinatesChange) {
            onCoordinatesChange([]);
        }
    };

    const handleUndoLast = () => {
        if (waypoints.length === 0) return;
        
        const newWaypoints = waypoints.slice(0, -1);
        setWaypoints(newWaypoints);
        setLocalCoords(newWaypoints);
        
        // If no waypoints left, clear everything
        if (newWaypoints.length === 0) {
            setRoutePath([]);
            if (onCoordinatesChange) {
                onCoordinatesChange([]);
            }
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

    // Calculate map center based on route coordinates, or use default
    const mapCenter: [number, number] = (() => {
        const coordsToUse = routePath.length > 0 ? routePath : localCoords;
        
        if (coordsToUse.length > 0) {
            // Calculate center of all coordinates
            const latSum = coordsToUse.reduce((sum, coord) => sum + coord.lat, 0);
            const lngSum = coordsToUse.reduce((sum, coord) => sum + coord.lng, 0);
            return [latSum / coordsToUse.length, lngSum / coordsToUse.length];
        }
        
        return defaultCenter; // Hamilton, ON
    })();

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
                            {(waypoints.length > 0 || routePath.length > 0) && (
                                <>
                                    {waypoints.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleUndoLast}
                                            className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                                        >
                                            Undo Last
                                        </button>
                                    )}
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
                    
                    {/* Auto-fit map to route bounds */}
                    {!editable && routePath.length > 0 && <MapBoundsUpdater coordinates={routePath} />}
                    
                    {/* Draw road-snapped route */}
                    {routePath.length > 1 && (
                        <Polyline
                            positions={routePath.map(coord => [coord.lat, coord.lng])}
                            color="#2563eb"
                            weight={5}
                            opacity={0.8}
                        />
                    )}
                    
                    {/* Show small dots at waypoints instead of big markers */}
                    {waypoints.map((coord, index) => (
                        <CircleMarker
                            key={index}
                            center={[coord.lat, coord.lng]}
                            radius={5}
                            pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.8 }}
                        />
                    ))}
                </MapContainer>
            </div>

            {editable && (waypoints.length > 0 || routePath.length > 0) && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {routePath.length > 1 && (
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
