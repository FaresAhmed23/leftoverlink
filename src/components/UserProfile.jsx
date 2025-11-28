import { useState } from 'react'
import { 
  ArrowLeftIcon, 
  UserCircleIcon, 
  MapPinIcon, 
  BellIcon,
  ChartBarIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

function UserProfile({ user, onBack, onSignOut }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
    description: user?.description || '',
    preferences: {
      dietary: user?.preferences?.dietary || [],
      notifications: user?.preferences?.notifications ?? true,
      maxDistance: user?.preferences?.maxDistance || 5
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  const [stats] = useState({
    foodShared: user?.stats?.foodShared || 12,
    foodReceived: user?.stats?.foodReceived || 8,
    co2Saved: user?.stats?.co2Saved || 45, // kg of CO2 saved
    mealsProvided: user?.stats?.mealsProvided || 156,
    totalListings: 15,
    activeListings: 3,
    completedListings: 12
  })

  const userTypes = [
    {
      id: 'donor',
      title: '🏪 Food Donor',
      description: 'Restaurant, bakery, or business with leftover food',
      benefits: ['Post food donations', 'Track your impact', 'Connect with local charities']
    },
    {
      id: 'recipient',
      title: '🙋‍♀️ Individual Recipient',
      description: 'Individual looking for available food',
      benefits: ['Find nearby food', 'Get notifications', 'Save on grocery costs']
    },
    {
      id: 'charity',
      title: '🤝 Charity/Organization',
      description: 'Non-profit or community organization',
      benefits: ['Bulk food collection', 'Priority access', 'Impact reporting']
    }
  ]

  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    }))
  }

  const handleDietaryToggle = (dietary) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietary: prev.preferences.dietary.includes(dietary)
          ? prev.preferences.dietary.filter(d => d !== dietary)
          : [...prev.preferences.dietary, dietary]
      }
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would save to a backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setIsEditing(false)
      alert('Profile saved successfully!')
    } catch (error) {
      alert('Error saving profile: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    // Reset form data
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      organization: user?.organization || '',
      description: user?.description || '',
      preferences: {
        dietary: user?.preferences?.dietary || [],
        notifications: user?.preferences?.notifications ?? true,
        maxDistance: user?.preferences?.maxDistance || 5
      }
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack} 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={onSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircleIcon className="h-4 w-4" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-green-500 px-6 py-8">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-12 w-12 text-primary-500" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-primary-100 capitalize">{user?.userType}</p>
                    {user?.organization && (
                      <p className="text-primary-100">{user.organization}</p>
                    )}
                    {user?.verified && (
                      <div className="flex items-center mt-2">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">Verified Account</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="input-field"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profileData.name || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <p className="text-gray-900 py-2">{profileData.email}</p>
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(555) 123-4567"
                          className="input-field"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profileData.phone || 'Not provided'}</p>
                      )}
                    </div>

                    {(user?.userType === 'donor' || user?.userType === 'charity') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Organization
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.organization}
                            onChange={(e) => setProfileData(prev => ({ ...prev, organization: e.target.value }))}
                            placeholder="Your organization name"
                            className="input-field"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profileData.organization || 'Not provided'}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About {user?.userType === 'donor' ? 'Your Business' : 'You'}
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.description}
                      onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell us about yourself or your organization..."
                      rows="4"
                      className="input-field resize-none"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.description || 'No description provided'}</p>
                  )}
                </div>

                {/* Preferences */}
                {(user?.userType === 'recipient' || user?.userType === 'charity') && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Preferences</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Dietary Restrictions
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {dietaryOptions.map(dietary => (
                            <label
                              key={dietary}
                              className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                                profileData.preferences.dietary.includes(dietary)
                                  ? 'border-green-300 bg-green-50 text-green-800'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={profileData.preferences.dietary.includes(dietary)}
                                onChange={() => handleDietaryToggle(dietary)}
                                disabled={!isEditing}
                                className="mr-2"
                              />
                              <span className="text-sm capitalize">{dietary}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Distance: {profileData.preferences.maxDistance} miles
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="25"
                          value={profileData.preferences.maxDistance}
                          onChange={handlePreferenceChange}
                          name="maxDistance"
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profileData.preferences.notifications}
                            onChange={handlePreferenceChange}
                            name="notifications"
                            disabled={!isEditing}
                            className="mr-3"
                          />
                          <BellIcon className="h-4 w-4 mr-2" />
                          <span>Receive email notifications for nearby food</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6">
            {/* Impact Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-5 w-5 text-primary-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Your Impact</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="text-2xl font-bold">{stats.foodShared}</div>
                  <div className="text-green-100 text-sm">Food Items Shared</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="text-2xl font-bold">{stats.foodReceived}</div>
                  <div className="text-blue-100 text-sm">Food Items Received</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="text-2xl font-bold">{stats.co2Saved}</div>
                  <div className="text-purple-100 text-sm">kg CO₂ Saved</div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                  <div className="text-2xl font-bold">{stats.mealsProvided}</div>
                  <div className="text-orange-100 text-sm">Meals Provided</div>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            {user?.userType === 'donor' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Listings</span>
                    <span className="font-semibold">{stats.totalListings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Currently Active</span>
                    <span className="font-semibold text-green-600">{stats.activeListings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-blue-600">{stats.completedListings}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Since</h3>
              <p className="text-gray-600">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'January 2024'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Thank you for being part of our community! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile