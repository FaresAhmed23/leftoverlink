// Location utility functions for LeftoverLink

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in miles, rounded to 1 decimal place
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(R * c * 10) / 10
}

/**
 * Get user's current location
 * @returns {Promise<{lat: number, lng: number}>} User's coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

/**
 * Generate Google Maps directions URL
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {number} destLat - Destination latitude
 * @param {number} destLng - Destination longitude
 * @returns {string} Google Maps URL
 */
export const getDirectionsUrl = (userLat, userLng, destLat, destLng) => {
  return `https://www.google.com/maps/dir/${userLat},${userLng}/${destLat},${destLng}`
}

/**
 * Format address for display
 * @param {string} address - Full address
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  return address.length > 50 ? address.substring(0, 47) + '...' : address
}

/**
 * Check if coordinates are valid
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinates = (lat, lng) => {
  return typeof lat === 'number' && 
         typeof lng === 'number' && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180
}