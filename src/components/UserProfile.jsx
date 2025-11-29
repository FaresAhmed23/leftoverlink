import { useState } from "react";
import {
  ArrowLeftIcon,
  UserCircleIcon,
  BellIcon,
  ChartBarIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

function UserProfile({ user, onBack, onSignOut }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    organization: user?.organization || "",
    description: user?.description || "",
    preferences: {
      dietary: user?.preferences?.dietary || [],
      notifications: user?.preferences?.notifications ?? true,
      maxDistance: user?.preferences?.maxDistance || 5,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  // In a real app, these would come from the API
  const stats = {
    foodShared: user?.stats?.foodShared || 0,
    foodReceived: user?.stats?.foodReceived || 0,
    co2Saved: user?.stats?.co2Saved || 0,
    mealsProvided: user?.stats?.mealsProvided || 0,
    totalListings: user?.stats?.totalListings || 0,
  };

  const dietaryOptions = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
    "nut-free",
    "halal",
    "kosher",
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsEditing(false);
      // Here you would call an onUpdate prop to refresh parent state
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error saving profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleDietaryToggle = (dietary) => {
    setProfileData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietary: prev.preferences.dietary.includes(dietary)
          ? prev.preferences.dietary.filter((d) => d !== dietary)
          : [...prev.preferences.dietary, dietary],
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
      {/* Profile Header Banner */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 h-48 md:h-64">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full transition-all backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-1.5 shadow-xl ring-4 ring-white/50">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl md:text-5xl font-bold text-gray-400">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-2 md:mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {profileData.name}
              </h1>
              <div className="flex items-center text-gray-600 mt-1">
                <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mr-2">
                  {user?.userType}
                </span>
                {user?.organization && <span>{user.organization}</span>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-4 w-full md:w-auto">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 md:flex-none btn-secondary flex items-center justify-center gap-2 bg-white shadow-sm hover:shadow-md"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Profile
                </button>
                <button
                  onClick={onSignOut}
                  className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 md:flex-none btn-secondary flex items-center justify-center gap-2 bg-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 md:flex-none btn-primary flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircleIcon className="h-4 w-4" />
                  )}
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Stats & Info */}
          <div className="space-y-6">
            {/* Impact Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <ChartBarIcon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900">Your Impact</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.foodShared}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase mt-1">
                    Shared
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.foodReceived}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase mt-1">
                    Received
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center col-span-2">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.co2Saved}kg
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase mt-1">
                    CO₂ Emissions Prevented
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Email
                  </label>
                  <div className="flex items-center gap-2 text-gray-700 mt-1">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    {profileData.email}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700 mt-1">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      {profileData.phone || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER/RIGHT COLUMN: Editable Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="font-bold text-xl text-gray-900 mb-6">
                Profile Settings
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    ) : (
                      <div className="py-2 text-gray-900 border-b border-gray-100">
                        {profileData.name}
                      </div>
                    )}
                  </div>

                  {(user?.userType === "donor" ||
                    user?.userType === "charity") && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Organization Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.organization}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              organization: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                      ) : (
                        <div className="py-2 text-gray-900 border-b border-gray-100 flex items-center gap-2">
                          <BuildingStorefrontIcon className="h-4 w-4 text-gray-400" />
                          {profileData.organization || "N/A"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio / Description
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={profileData.description}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                      placeholder="Tell the community about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {profileData.description || "No description provided."}
                    </p>
                  )}
                </div>

                {(user?.userType === "recipient" ||
                  user?.userType === "charity") && (
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4">
                      Preferences
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Dietary Restrictions
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {dietaryOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() =>
                                isEditing && handleDietaryToggle(option)
                              }
                              disabled={!isEditing}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                profileData.preferences.dietary.includes(option)
                                  ? "bg-green-100 text-green-800 border-2 border-green-200"
                                  : "bg-gray-100 text-gray-500 border-2 border-transparent"
                              }`}
                            >
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-blue-900">
                            Notifications
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={profileData.preferences.notifications}
                              onChange={handlePreferenceChange}
                              name="notifications"
                              disabled={!isEditing}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <p className="text-xs text-blue-700">
                          Receive email alerts when new food is posted near you.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
