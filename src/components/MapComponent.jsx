import React, { useEffect, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';

const Marker = () => (
    <div style={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        zIndex: 1000,
        cursor: 'pointer'
    }}>
        {/* Map marker pin */}
        <svg
            width="30"
            height="40"
            viewBox="0 0 30 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
        >
            <path
                d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25c0-8.284-6.716-15-15-15z"
                fill="#EA4335"
            />
            <circle cx="15" cy="15" r="5" fill="white" />
        </svg>
    </div>
);

const MapComponent = ({ lat = 53.7798, lng = -1.7528, zoom = 14, onLocationUpdate, id }) => {
    const siteKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const [markerPosition, setMarkerPosition] = useState(null);
    const [tempPosition, setTempPosition] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapsInstance, setMapsInstance] = useState(null);
    const hasInitialized = useRef(false);

    const defaultProps = {
        center: {
            lat: lat,
            lng: lng
        },
        zoom: zoom
    };

    const handleApiLoaded = (map, maps) => {
        setMapInstance(map);
        setMapsInstance(maps);
    };

    const handleMapClick = ({ lat, lng }) => {
        setTempPosition({ lat, lng });
    };

    const handleUpdate = () => {
        // Check if there's a tempPosition from map click or new lat/lng from inputs
        const newLat = tempPosition ? tempPosition.lat : lat;
        const newLng = tempPosition ? tempPosition.lng : lng;

        setMarkerPosition({ lat: newLat, lng: newLng });

        // Scroll/pan the map to the new position
        if (mapInstance) {
            mapInstance.panTo({ lat: newLat, lng: newLng });
        }

        if (onLocationUpdate) {
            onLocationUpdate(newLat, newLng);
        }
        setTempPosition(null);
    };

    useEffect(() => {
        if (id && !hasInitialized.current) {
            const parsedLat = parseFloat(lat);
            const parsedLng = parseFloat(lng);            
            if (lat !== "" && lng !== "" && parsedLat && parsedLng) {
                setMarkerPosition({ lat: parsedLat, lng: parsedLng });
                if (mapInstance) {
                    mapInstance.panTo({ lat: parsedLat, lng: parsedLng });
                    mapInstance.setZoom(zoom);
                    hasInitialized.current = true;
                }
            } else {
                setMarkerPosition(null);
                hasInitialized.current = true;
            }
        }
    }, [lat, lng, mapInstance, id]);

    return (
        <div className="row">
            <div className="col-12">
                <div style={{ height: '200px', width: '100%' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: siteKey
                        }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                        onClick={handleMapClick}
                        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                        yesIWantToUseGoogleMapApiInternals
                        options={{
                            zoomControl: true,
                            zoomControlOptions: {
                                position: 7, // RIGHT_TOP
                            },
                            mapTypeControl: true,
                            mapTypeControlOptions: {
                                position: 3, // TOP_RIGHT
                                style: 1, // HORIZONTAL_BAR
                                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
                            },
                            scaleControl: true,
                            streetViewControl: true,
                            streetViewControlOptions: {
                                position: 7, // RIGHT_TOP
                            },
                            fullscreenControl: true,
                            fullscreenControlOptions: {
                                position: 7, // RIGHT_TOP
                            },
                            styles: [
                                {
                                    featureType: 'water',
                                    elementType: 'geometry',
                                    stylers: [{ color: '#a2daf2' }]
                                },
                                {
                                    featureType: 'landscape.man_made',
                                    elementType: 'geometry',
                                    stylers: [{ color: '#f7f1df' }]
                                },
                                {
                                    featureType: 'landscape.natural',
                                    elementType: 'geometry',
                                    stylers: [{ color: '#d0e3b4' }]
                                }
                            ]
                        }}
                    >
                        {markerPosition && (
                            <Marker
                                lat={markerPosition.lat}
                                lng={markerPosition.lng}
                            />
                        )}
                    </GoogleMapReact>
                </div>
                <div className='text-center mt-3'>
                    <button
                        type="button"
                        className="btn btn-dark black-btn-hover-white"
                        style={{ fontSize: "12px", fontWeight: "700" }}
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;