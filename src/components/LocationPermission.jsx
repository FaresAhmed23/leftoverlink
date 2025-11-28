function LocationPermission({ permission, onRetry }) {
  if (permission === 'not_supported') {
    return (
      <div className="location-permission warning">
        <h3>⚠️ Location Not Supported</h3>
        <p>Your browser doesn't support location services. You can still use LeftoverLink, but distance calculations won't be available.</p>
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div className="location-permission error">
        <h3>📍 Location Access Needed</h3>
        <p>
          LeftoverLink works best when we can show you the nearest food available. 
          Please enable location access to find food closest to you.
        </p>
        <div className="permission-actions">
          <button onClick={onRetry} className="retry-btn">
            🔄 Try Again
          </button>
          <details className="location-help">
            <summary>How to enable location access</summary>
            <div className="help-content">
              <p><strong>Chrome/Edge:</strong> Click the location icon in the address bar</p>
              <p><strong>Firefox:</strong> Click "Permissions" → Allow location access</p>
              <p><strong>Safari:</strong> Safari → Settings → Privacy → Location Services</p>
            </div>
          </details>
        </div>
      </div>
    )
  }

  return null
}

export default LocationPermission