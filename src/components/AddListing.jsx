import { useState } from "react";
import {
  ArrowLeftIcon,
  PhotoIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LocationPicker from "./LocationPicker";

function AddListing({ onAddListing, userLocation, onBack, user }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "prepared_food",
    quantity: "",
    expiryTime: "",
    allergens: [],
    pickupInstructions: "",
    donor: user?.name || user?.organization || "",
    location: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [availableAllergens] = useState([
    "gluten",
    "dairy",
    "nuts",
    "eggs",
    "soy",
    "shellfish",
    "fish",
    "sesame",
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAllergenToggle = (allergen) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const handleLocationSelect = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      location: locationData,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const categoryOptions = [
    {
      value: "prepared_food",
      label: "Prepared Food",
      emoji: "🍽️",
      desc: "Ready-to-eat meals, sandwiches, etc.",
    },
    {
      value: "baked_goods",
      label: "Baked Goods",
      emoji: "🥖",
      desc: "Bread, pastries, cakes, cookies",
    },
    {
      value: "produce",
      label: "Fresh Produce",
      emoji: "🥬",
      desc: "Fruits, vegetables, fresh ingredients",
    },
    {
      value: "packaged_food",
      label: "Packaged Food",
      emoji: "📦",
      desc: "Canned goods, snacks, packaged items",
    },
    {
      value: "beverages",
      label: "Beverages",
      emoji: "🥤",
      desc: "Drinks, juices, coffee, etc.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.location) {
        throw new Error("Please fill in all required fields");
      }

      // Format data for Backend API
      const apiPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: formData.quantity,
        expiryTime: new Date(formData.expiryTime).toISOString(),
        allergens: formData.allergens,
        pickupInstructions: formData.pickupInstructions,
        location: {
          // Backend expects [lng, lat]
          coordinates: formData.location.coordinates || [
            formData.location.lng,
            formData.location.lat,
          ],
          address: formData.location.address,
        },
      };

      await onAddListing(apiPayload); // This calls the function in Dashboard which calls api.createListing

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "prepared_food",
        quantity: "",
        expiryTime: "",
        allergens: [],
        pickupInstructions: "",
        donor: user?.name || user?.organization || "",
        location: null,
      });

      setCurrentStep(1);
      alert("🎉 Your food donation has been posted successfully!");
      // onBack(); // Dashboard handles view switch on success now, but keeping it is fine
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                step <= currentStep
                  ? "bg-primary-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            {step < 4 && (
              <div
                className={`w-20 h-1 mx-2 transition-all duration-200 ${
                  step < currentStep ? "bg-primary-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-600">
        Step {currentStep} of {totalSteps}:{" "}
        {currentStep === 1
          ? "Basic Information"
          : currentStep === 2
          ? "Food Details"
          : currentStep === 3
          ? "Location & Pickup"
          : "Review & Publish"}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Basic Information
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Food Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="e.g., Fresh Sandwiches & Salads"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Describe the food items, their condition, and any special notes..."
          rows="4"
          className="input-field resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Restaurant/Organization Name *
        </label>
        <input
          type="text"
          value={formData.donor}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, donor: e.target.value }))
          }
          placeholder="Your business or organization name"
          className="input-field"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Food Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Food Category *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categoryOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary-300 ${
                formData.category === option.value
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <input
                type="radio"
                value={option.value}
                checked={formData.category === option.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </div>
              {formData.category === option.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="text"
            value={formData.quantity}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, quantity: e.target.value }))
            }
            placeholder="e.g., 20 portions, 5 lbs, 30 items"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ClockIcon className="inline h-4 w-4 mr-1" />
            Best Before (Date & Time) *
          </label>
          <input
            type="datetime-local"
            value={formData.expiryTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, expiryTime: e.target.value }))
            }
            min={getCurrentDateTime()}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <ExclamationTriangleIcon className="inline h-4 w-4 mr-1" />
          Allergen Information
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select all allergens present in the food
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableAllergens.map((allergen) => (
            <label
              key={allergen}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.allergens.includes(allergen)
                  ? "border-orange-300 bg-orange-50 text-orange-800"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.allergens.includes(allergen)}
                onChange={() => handleAllergenToggle(allergen)}
                className="mr-2"
              />
              <span className="text-sm font-medium capitalize">{allergen}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Location & Pickup
      </h2>

      <LocationPicker
        onLocationSelect={handleLocationSelect}
        initialLocation={formData.location}
        label="Pickup Location"
        required={true}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Instructions
        </label>
        <textarea
          value={formData.pickupInstructions}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              pickupInstructions: e.target.value,
            }))
          }
          placeholder="e.g., Ask for manager at front desk, Use back entrance after 6 PM, Ring doorbell twice..."
          rows="3"
          className="input-field resize-none"
        />
        <p className="text-sm text-gray-500 mt-1">
          Help people find you! Include specific instructions for pickup.
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Review & Publish
      </h2>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{formData.title}</h3>
          <p className="text-gray-700 mb-3">{formData.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
              {
                categoryOptions.find((c) => c.value === formData.category)
                  ?.label
              }
            </span>
            {formData.quantity && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {formData.quantity}
              </span>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Pickup Information</h4>
          <p className="text-sm text-gray-600 mb-1">
            <strong>From:</strong> {formData.donor}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Location:</strong> {formData.location?.address || "Not set"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Best Before:</strong>{" "}
            {formData.expiryTime
              ? new Date(formData.expiryTime).toLocaleString()
              : "Not set"}
          </p>
          {formData.pickupInstructions && (
            <p className="text-sm text-gray-600">
              <strong>Instructions:</strong> {formData.pickupInstructions}
            </p>
          )}
        </div>

        {formData.allergens.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Allergen Warning</h4>
            <div className="flex flex-wrap gap-2">
              {formData.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Food
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help reduce food waste by sharing what you can't use with those
              who need it most. Every donation makes a difference in your
              community.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Multi-step Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>

            {/* Navigation */}
            <div className="bg-gray-50 px-8 py-6 flex justify-between items-center">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    ← Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 &&
                        (!formData.title ||
                          !formData.description ||
                          !formData.donor)) ||
                      (currentStep === 2 && !formData.expiryTime) ||
                      (currentStep === 3 && !formData.location)
                    }
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publishing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>🚀</span>
                        <span>Publish Food Donation</span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddListing;
