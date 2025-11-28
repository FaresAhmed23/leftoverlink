import { useState } from "react";
import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import MapComponent from "./MapComponent";
import { loadGoogleMaps } from "../utils/googleMapsLoader";

function LocationPicker({
  onLocationSelect,
  initialLocation = null,
  required = true,
  label = "Pick Location",
}) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState(initialLocation?.address || "");
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    initialLocation || { lat: 40.7128, lng: -74.006 }
  );

  // Function to get address from lat/lng
  const geocodePosition = async (lat, lng) => {
    try {
      const googleMaps = await loadGoogleMaps();
      // CLASSIC WAY: Direct access
      const geocoder = new googleMaps.Geocoder();

      const response = await geocoder.geocode({ location: { lat, lng } });

      if (response.results[0]) {
        const formattedAddress = response.results[0].formatted_address;
        setAddress(formattedAddress);
        return formattedAddress;
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Function to search by text
  const geocodeAddress = async (addressQuery) => {
    if (!addressQuery.trim()) return;

    setIsSearching(true);
    try {
      const googleMaps = await loadGoogleMaps();
      // CLASSIC WAY: Direct access
      const geocoder = new googleMaps.Geocoder();

      const response = await geocoder.geocode({ address: addressQuery });

      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        const newLocation = { lat, lng };

        // Update map center and trigger selection
        setMapCenter(newLocation);
        handleLocationSelect(newLocation);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Search failed", error);
      alert("Error searching location");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    // Get the address for this new point
    const formattedAddress = await geocodePosition(location.lat, location.lng);

    if (onLocationSelect) {
      onLocationSelect({
        coordinates: [location.lng, location.lat], // MongoDB GeoJSON format
        address: formattedAddress,
        lat: location.lat,
        lng: location.lng,
      });
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    geocodeAddress(formData.get("address"));
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(loc);
        handleLocationSelect(loc);
      });
    } else {
      alert("Geolocation not supported");
    }
  };

  const markers = selectedLocation
    ? [
        {
          position: selectedLocation,
          title: "Selected Location",
        },
      ]
    : [];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Address Search */}
      <form onSubmit={handleAddressSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="address"
            placeholder="Search address..."
            className="pl-10 input-field"
            disabled={isSearching}
          />
        </div>
        <button
          type="submit"
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
          disabled={isSearching}
        >
          {isSearching ? "..." : "Search"}
        </button>
        <button
          type="button"
          onClick={useCurrentLocation}
          className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          title="Use current location"
        >
          <MapPinIcon className="h-5 w-5 text-gray-600" />
        </button>
      </form>

      {/* Selected Address Display */}
      {address && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex items-center">
          <MapPinIcon className="h-4 w-4 mr-2" />
          {address}
        </div>
      )}

      {/* Map */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
        <MapComponent
          center={mapCenter}
          markers={markers}
          height="350px"
          zoom={15}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      <p className="text-sm text-gray-500">
        💡 Click on the map to pinpoint the exact location.
      </p>
    </div>
  );
}

export default LocationPicker;
