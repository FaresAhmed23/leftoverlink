import { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  MapPinIcon,
  PlusIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import FoodListings from "../components/FoodListings";
import AddListing from "../components/AddListing";
import UserProfile from "../components/UserProfile";

function Dashboard({ user, userLocation, onSignOut, onLocationRequest }) {
  const [currentView, setCurrentView] = useState("listings");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const filters = {
          status: "available",
          ...(userLocation && {
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius: 20,
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
        const data = await api.getListings();
        setListings(data.data);
        setCurrentView("listings");
      }
    } catch (error) {
      console.error("Failed to create listing", error);
      throw error;
    }
  };

  const navigation = [
    { id: "listings", name: "Find Food", icon: MagnifyingGlassIcon },
    { id: "add", name: "Share Food", icon: PlusIcon },
    { id: "profile", name: "Profile", icon: UserIcon },
  ];

  const SidebarItem = ({ item, mobile = false }) => (
    <button
      onClick={() => {
        setCurrentView(item.id);
        if (mobile) setIsMobileMenuOpen(false);
      }}
      className={`w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        currentView === item.id
          ? "bg-primary-50 text-primary-700 shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <item.icon
        className={`flex-shrink-0 h-5 w-5 mr-3 transition-colors ${
          currentView === item.id
            ? "text-primary-600"
            : "text-gray-400 group-hover:text-gray-500"
        }`}
      />
      {item.name}
    </button>
  );

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
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🍽️</span>
                <span className="text-lg font-bold text-gray-900">
                  LeftoverLink
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigation.map((item) => (
                <SidebarItem key={item.id} item={item} mobile={true} />
              ))}
            </nav>
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={onSignOut}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-20 flex-shrink-0 px-8">
            <span className="text-3xl mr-2">🍽️</span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              LeftoverLink
            </span>
          </div>

          <div className="flex-grow flex flex-col px-4 pt-6">
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => (
                <SidebarItem key={item.id} item={item} />
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={onSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex flex-1 justify-end items-center space-x-6">
              {!userLocation && (
                <button
                  onClick={onLocationRequest}
                  className="hidden sm:flex items-center space-x-2 text-sm font-medium bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <MapPinIcon className="h-4 w-4 animate-bounce" />
                  <span>Enable Location</span>
                </button>
              )}

              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 font-medium capitalize bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {user.userType}
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-green-400 p-0.5 shadow-sm">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
