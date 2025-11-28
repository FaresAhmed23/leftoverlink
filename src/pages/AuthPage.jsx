import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";

function AuthPage({ mode, onAuth, onSwitchMode, onBack }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    userType: "recipient",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignUp = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (isSignUp) {
        response = await api.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        });
      } else {
        response = await api.login({
          email: formData.email,
          password: formData.password,
        });
      }

      // Store Token
      localStorage.setItem("leftoverlink_token", response.token);

      // Update App State
      onAuth(response.user);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button
            onClick={onBack}
            className="mb-6 text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🍽️</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? "Join LeftoverLink" : "Welcome Back"}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="input-field"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a...
                  </label>
                  <select
                    name="userType"
                    className="input-field"
                    value={formData.userType}
                    onChange={handleInputChange}
                  >
                    <option value="recipient">
                      Individual looking for food
                    </option>
                    <option value="donor">Restaurant/Business owner</option>
                    <option value="charity">Charity/Organization</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
