import { useState } from "react";
import { api } from "../services/api";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  EyeIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import MapComponent from "./MapComponent";

function FoodListings({ listings, userLocation, user }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [selectedListing, setSelectedListing] = useState(null);

  const categoryIcons = {
    prepared_food: {
      emoji: "🍽️",
      name: "Prepared Food",
      color: "bg-orange-100 text-orange-800",
    },
    baked_goods: {
      emoji: "🥖",
      name: "Baked Goods",
      color: "bg-yellow-100 text-yellow-800",
    },
    produce: {
      emoji: "🥬",
      name: "Fresh Produce",
      color: "bg-green-100 text-green-800",
    },
    packaged_food: {
      emoji: "📦",
      name: "Packaged Food",
      color: "bg-blue-100 text-blue-800",
    },
    beverages: {
      emoji: "🥤",
      name: "Beverages",
      color: "bg-purple-100 text-purple-800",
    },
  };

  const getTimeRemaining = (expiryTime) => {
    const now = new Date();
    const diff = expiryTime - now;

    if (diff < 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getUrgencyData = (expiryTime) => {
    const now = new Date();
    const diff = expiryTime - now;
    const hours = diff / (1000 * 60 * 60);

    if (hours < 1) {
      return {
        level: "urgent",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: ExclamationTriangleIcon,
      };
    }
    if (hours < 3) {
      return {
        level: "moderate",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: ClockIcon,
      };
    }
    return {
      level: "good",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: ClockIcon,
    };
  };

  const filteredListings = listings.filter((listing) => {
    const matchesFilter = filter === "all" || listing.category === filter;
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const claimListing = async (listingId) => {
    if (!user) {
      alert("Please sign in to claim food.");
      return;
    }

    try {
      const message = prompt(
        "Optional: Add a message to the donor (e.g., 'I will pick up at 5pm')"
      );
      if (message === null) return; // Cancelled

      await api.claimListing(listingId, message);
      alert("Success! The donor has been notified.");

      // Optional: Trigger a refresh of the list here if you passed a refresh function down
    } catch (error) {
      alert(error.message);
    }
  };

  const openDirections = (listing) => {
    if (userLocation) {
      const directionsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${listing.location.lat},${listing.location.lng}`;
      window.open(directionsUrl, "_blank");
    } else {
      // Fallback to just the destination
      const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        listing.location.address
      )}`;
      window.open(searchUrl, "_blank");
    }
  };

  // Create markers for map view
  const mapMarkers = filteredListings.map((listing) => ({
    position: { lat: listing.location.lat, lng: listing.location.lng },
    title: listing.title,
    type: "food",
    listing: listing,
    onClick: (marker) => setSelectedListing(marker.listing),
  }));

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Available Food Near You
            </h1>
            {userLocation ? (
              <p className="text-gray-600 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                Showing results based on your location
              </p>
            ) : (
              <p className="text-amber-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                Enable location for better results
              </p>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <EyeIcon className="h-4 w-4 mr-1 inline" />
              List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "map"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapIcon className="h-4 w-4 mr-1 inline" />
              Map
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search food, restaurant, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-field"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryIcons).map(([key, category]) => (
            <option key={key} value={key}>
              {category.emoji} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <div className="mb-6">
          <MapComponent
            center={userLocation}
            markers={mapMarkers}
            height="500px"
            zoom={12}
            userLocation={userLocation}
          />

          {/* Selected Listing Details */}
          {selectedListing && (
            <div className="mt-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-primary-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {categoryIcons[selectedListing.category]?.emoji}{" "}
                    {selectedListing.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {selectedListing.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📍 {selectedListing.location.address}</span>
                    <span>
                      ⏰ {getTimeRemaining(selectedListing.expiryTime)}
                    </span>
                    <span>🍽️ {selectedListing.quantity}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => claimListing(selectedListing.id)}
                    className="btn-primary px-4 py-2"
                  >
                    I'm Interested
                  </button>
                  <button
                    onClick={() => openDirections(selectedListing)}
                    className="btn-secondary px-4 py-2"
                  >
                    Directions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No food found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or check back later for new donations.
              </p>
            </div>
          ) : (
            filteredListings.map((listing) => {
              const urgency = getUrgencyData(listing.expiryTime);
              const category = categoryIcons[listing.category];

              return (
                <div
                  key={listing.id}
                  className="card p-6 hover:transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color} mb-2`}
                      >
                        {category.emoji} {category.name}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {listing.title}
                      </h3>
                    </div>
                    {listing.verified && (
                      <div className="bg-green-100 text-green-800 p-1 rounded-full">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-primary-600">
                      {listing.donor}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {listing.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="truncate">
                        {listing.location.address}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        <strong>Quantity:</strong> {listing.quantity}
                      </span>
                      {listing.distance && (
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                          {listing.distance} mi
                        </span>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between p-2 rounded-lg border ${urgency.color}`}
                    >
                      <div className="flex items-center">
                        <urgency.icon className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">
                          {getTimeRemaining(listing.expiryTime)}
                        </span>
                      </div>
                    </div>

                    {listing.allergens.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                        <div className="flex items-center text-red-800 text-sm">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <strong>Contains:</strong>
                          <span className="ml-1">
                            {listing.allergens.join(", ")}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="text-blue-800 text-sm">
                        <strong>📋 Pickup:</strong> {listing.pickupInstructions}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    {user?.userType === "donor" &&
                    listing.donor === user?.name ? (
                      <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        ✏️ Edit Listing
                      </button>
                    ) : (
                      <button
                        onClick={() => claimListing(listing.id)}
                        className="flex-1 btn-primary"
                      >
                        <HeartIcon className="h-4 w-4 mr-2" />
                        I'm Interested
                      </button>
                    )}
                    <button
                      onClick={() => openDirections(listing)}
                      className="btn-secondary"
                    >
                      <MapPinIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default FoodListings;
