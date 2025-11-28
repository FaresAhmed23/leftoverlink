import { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  MapPinIcon,
  PlusIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import FoodListings from "../components/FoodListings";
import AddListing from "../components/AddListing";
import UserProfile from "../components/UserProfile";

function Dashboard({ user, userLocation, onSignOut, onLocationRequest }) {
  const [currentView, setCurrentView] = useState("listings");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [listings, setListings] = useState([]); // Start empty
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const filters = {
          status: "available",
          ...(userLocation && {
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius: 20, // Default 20km search radius
          }),
        };

        const data = await api.getListings(filters);
        if (data.success) {
          setListings(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch listings", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentView === "listings") {
      fetchListings();
    }
  }, [userLocation, currentView]);

  const addNewListing = async (newListingData) => {
    try {
      const response = await api.createListing(newListingData);
      if (response.success) {
        // Refresh listings
        const data = await api.getListings();
        setListings(data.data);
        setCurrentView("listings");
      }
    } catch (error) {
      console.error("Failed to create listing", error);
      throw error; // Throw to AddListing form to handle
    }
  };

  const navigation = [
    { id: "listings", name: "Find Food", icon: MagnifyingGlassIcon },
    { id: "add", name: "Share Food", icon: PlusIcon },
    { id: "profile", name: "Profile", icon: UserIcon },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "add":
        return (
          <AddListing
            onAddListing={addNewListing}
            userLocation={userLocation}
            onBack={() => setCurrentView("listings")}
            user={user}
          />
        );
      case "profile":
        return (
          <UserProfile
            user={user}
            onBack={() => setCurrentView("listings")}
            onSignOut={onSignOut}
          />
        );
      default:
        return (
          <FoodListings
            listings={listings}
            userLocation={userLocation}
            user={user}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 ${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:hidden`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🍽️</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                LeftoverLink
              </span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  currentView === item.id
                    ? "bg-primary-100 text-primary-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-6 w-6 mr-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🍽️</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              LeftoverLink
            </span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 space-y-1 px-2 bg-white">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    currentView === item.id
                      ? "bg-primary-100 text-primary-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              {!userLocation && (
                <button
                  onClick={onLocationRequest}
                  className="flex items-center space-x-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <MapPinIcon className="h-4 w-4" />
                  <span>Enable Location</span>
                </button>
              )}

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.userType}
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
