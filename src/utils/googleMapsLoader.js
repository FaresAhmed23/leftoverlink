let googleMapsPromise = null;

export const loadGoogleMaps = () => {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    // If already loaded
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // REMOVED 'loading=async' to force classic loading
    // ADDED 'v=weekly' to ensure stable version
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(
          new Error("Google Maps loaded but window.google.maps is undefined")
        );
      }
    };

    script.onerror = (error) => {
      reject(error);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};
