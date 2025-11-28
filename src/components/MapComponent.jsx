import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../utils/googleMapsLoader";

function MapComponent({
  center,
  markers = [],
  height = "400px",
  zoom = 13,
  onLocationSelect,
  showDirections = false,
  userLocation = null,
}) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        const googleMaps = await loadGoogleMaps();

        const defaultCenter = { lat: 40.7128, lng: -74.006 };
        const mapCenter = center || defaultCenter;

        // CLASSIC WAY: Direct access to google.maps.Map
        const map = new googleMaps.Map(mapRef.current, {
          center: mapCenter,
          zoom: zoom,
          mapTypeControl: false,
          streetViewControl: false,
          // Removed mapId (not needed for standard markers)
        });

        setMapInstance(map);

        // Clear existing markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        // Add Markers (Classic Style)
        markers.forEach((markerData) => {
          if (markerData.position) {
            const marker = new googleMaps.Marker({
              map: map,
              position: markerData.position,
              title: markerData.title,
              // Standard red pin is default
            });

            if (markerData.onClick) {
              marker.addListener("click", () => markerData.onClick(markerData));
            }

            markersRef.current.push(marker);
          }
        });

        // Add User Location Marker (Blue Pin)
        if (userLocation) {
          const userMarker = new googleMaps.Marker({
            map: map,
            position: userLocation,
            title: "You are here",
            icon: {
              path: googleMaps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#3B82F6",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
            },
          });
          markersRef.current.push(userMarker);
        }

        // Click to select location
        if (onLocationSelect) {
          map.addListener("click", (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            onLocationSelect({ lat, lng });
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading map:", err);
        setError("Failed to load Google Maps");
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [center, zoom]);

  return (
    <div className="relative">
      {isLoading && (
        <div
          style={{ height }}
          className="bg-gray-100 flex items-center justify-center rounded-lg"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}
      {error && (
        <div
          style={{ height }}
          className="bg-red-50 flex items-center justify-center text-red-500 rounded-lg"
        >
          {error}
        </div>
      )}
      <div
        ref={mapRef}
        style={{ height, visibility: isLoading ? "hidden" : "visible" }}
        className="rounded-lg overflow-hidden shadow-lg"
      />
    </div>
  );
}

export default MapComponent;
