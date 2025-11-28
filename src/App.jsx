import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { api } from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState("landing"); // 'landing', 'auth', 'dashboard'
  const [authMode, setAuthMode] = useState("signin"); // 'signin', 'signup'
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("leftoverlink_token");
      if (token) {
        try {
          const data = await api.getProfile();
          if (data.success) {
            setUser(data.user);
            setCurrentPage("dashboard");
          } else {
            // Token invalid
            handleSignOut();
          }
        } catch (error) {
          console.error("Session expired", error);
          handleSignOut();
        }
      }
    };

    checkAuth();
  }, []);

  // Get user location when they're authenticated
  useEffect(() => {
    if (user && !userLocation) {
      getCurrentLocation();
    }
  }, [user]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location access denied:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  const handleGetStarted = (email) => {
    setAuthMode("signup");
    setCurrentPage("auth");
  };

  const handleSignIn = () => {
    setAuthMode("signin");
    setCurrentPage("auth");
  };

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem("leftoverlink_user", JSON.stringify(userData));
    setCurrentPage("dashboard");
  };

  const handleSignOut = () => {
    setUser(null);
    setUserLocation(null);
    localStorage.removeItem("leftoverlink_token"); // Remove token
    // localStorage.removeItem('leftoverlink_user') // No longer needed
    setCurrentPage("landing");
  };

  const handleSwitchAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  const handleBackToLanding = () => {
    setCurrentPage("landing");
  };

  // Render current page
  if (currentPage === "landing") {
    return (
      <LandingPage onGetStarted={handleGetStarted} onSignIn={handleSignIn} />
    );
  }

  if (currentPage === "auth") {
    return (
      <AuthPage
        mode={authMode}
        onAuth={handleAuth}
        onSwitchMode={handleSwitchAuthMode}
        onBack={handleBackToLanding}
      />
    );
  }

  if (currentPage === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        userLocation={userLocation}
        onSignOut={handleSignOut}
        onLocationRequest={getCurrentLocation}
      />
    );
  }

  return null;
}

export default App;
