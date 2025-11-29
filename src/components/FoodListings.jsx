import { useState } from "react";
import { api } from "../services/api";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  MapIcon,
  ListBulletIcon,
  FunnelIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import MapComponent from "./MapComponent";

function FoodListings({ listings, userLocation, user, isLoading }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedListing, setSelectedListing] = useState(null);

  const categoryIcons = {
    prepared_food: {
      emoji: "🍽️",
      name: "Prepared Meal",
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-100",
    },
    baked_goods: {
      emoji: "🥖",
      name: "Baked Goods",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-100",
    },
    produce: {
      emoji: "🥬",
      name: "Fresh Produce",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-100",
    },
    packaged_food: {
      emoji: "📦",
      name: "Packaged",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-100",
    },
    beverages: {
      emoji: "🥤",
      name: "Beverages",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-100",
    },
  };

  const getTimeRemaining = (expiryTime) => {
    const now = new Date();
    const diff = new Date(expiryTime) - now;
    if (diff < 0) return { text: "Expired", urgent: false };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return {
      text: hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`,
      urgent: hours < 3,
    };
  };

  const filteredListings = listings.filter((listing) => {
    const matchesFilter = filter === "all" || listing.category === filter;
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const claimListing = async (listingId) => {
    if (!user) {
      alert("Please sign in to claim food.");
      return;
    }
    try {
      const message = prompt("Add a note to the donor (Optional):");
      if (message === null) return;
      await api.claimListing(listingId, message);
      alert("Success! The donor has been notified.");
    } catch (error) {
      alert(error.message);
    }
  };

  const openDirections = (listing) => {
    const destLat = listing.location?.coordinates
      ? listing.location.coordinates[1]
      : listing.location.lat;
    const destLng = listing.location?.coordinates
      ? listing.location.coordinates[0]
      : listing.location.lng;

    if (userLocation) {
      window.open(
        `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destLat},${destLng}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`,
        "_blank"
      );
    }
  };

  const mapMarkers = filteredListings.map((listing) => ({
    position: {
      lat: listing.location?.coordinates
        ? listing.location.coordinates[1]
        : listing.location.lat,
      lng: listing.location?.coordinates
        ? listing.location.coordinates[0]
        : listing.location.lng,
    },
    title: listing.title,
    type: "food",
    listing: listing,
    onClick: (marker) => setSelectedListing(marker.listing),
  }));

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl h-96 p-6 shadow-sm border border-gray-100 flex flex-col"
        >
          <div className="flex justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded-full w-8"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-20 bg-gray-100 rounded mb-4"></div>
          <div className="mt-auto flex gap-3">
            <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {/* 1. Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Available Food
          </h1>
          <p className="text-gray-500 mt-2 flex items-center">
            {userLocation ? (
              <>
                <MapPinIcon className="h-4 w-4 mr-1 text-primary-500" />
                <span>Showing donations near you</span>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-amber-500" />
                <span className="text-amber-600 font-medium">
                  Enable location for accurate results
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-48 pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              {Object.entries(categoryIcons).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>
            <ChevronRightIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-90 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === "map"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Content Area */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Map View */}
          {viewMode === "map" && (
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white p-2 mb-8">
              <MapComponent
                center={userLocation}
                markers={mapMarkers}
                height="600px"
                zoom={13}
                userLocation={userLocation}
              />

              {/* Selected Listing Overlay */}
              {selectedListing && (
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">
                        {selectedListing.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {selectedListing.location?.address}
                      </p>
                    </div>
                    <button
                      onClick={() => claimListing(selectedListing.id)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold"
                    >
                      Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* List Grid View */}
          {viewMode === "list" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    🔍
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    No listings found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try changing your filters or search area.
                  </p>
                </div>
              ) : (
                filteredListings.map((listing) => {
                  const timeStatus = getTimeRemaining(listing.expiryTime);
                  const category =
                    categoryIcons[listing.category] ||
                    categoryIcons.prepared_food;
                  const isVerified = listing.verified;

                  return (
                    <div
                      key={listing._id || listing.id}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
                    >
                      {/* Card Header */}
                      <div className="p-6 pb-4">
                        <div className="flex justify-between items-start mb-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${category.bg} ${category.text} ${category.border} border`}
                          >
                            {category.emoji} {category.name}
                          </span>
                          {timeStatus.urgent && (
                            <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full animate-pulse">
                              <ClockIcon className="w-3.5 h-3.5 mr-1" />
                              Urgent
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {listing.title}
                        </h3>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span className="font-medium text-gray-900 mr-2">
                            {listing.donorName || listing.donor}
                          </span>
                          {isVerified && (
                            <div
                              className="bg-blue-100 p-0.5 rounded-full"
                              title="Verified Donor"
                            >
                              <svg
                                className="w-3 h-3 text-blue-600"
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

                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed bg-gray-50 p-3 rounded-lg">
                          {listing.description}
                        </p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-500">
                            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">
                              {listing.location?.address ||
                                "Location not provided"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span
                              className={
                                timeStatus.urgent
                                  ? "text-red-600 font-medium"
                                  : ""
                              }
                            >
                              Expires: {timeStatus.text}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-auto p-4 border-t border-gray-50 bg-gray-50/50 flex gap-3">
                        {user?.userType === "donor" &&
                        listing.donor === user?.id ? (
                          <button className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                            Manage
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              claimListing(listing._id || listing.id)
                            }
                            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <HeartIcon className="w-4 h-4" /> I want this
                          </button>
                        )}
                        <button
                          onClick={() => openDirections(listing)}
                          className="w-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                          title="Get Directions"
                        >
                          <MapPinIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FoodListings;
