import { useState } from "react";
import {
  ArrowLeftIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setFormData((prev) => ({ ...prev, location: locationData }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const categoryOptions = [
    {
      value: "prepared_food",
      label: "Prepared Food",
      emoji: "🍽️",
      desc: "Meals, sandwiches",
    },
    {
      value: "baked_goods",
      label: "Baked Goods",
      emoji: "🥖",
      desc: "Bread, pastries",
    },
    {
      value: "produce",
      label: "Fresh Produce",
      emoji: "🥬",
      desc: "Fruits, veggies",
    },
    {
      value: "packaged_food",
      label: "Packaged",
      emoji: "📦",
      desc: "Canned, snacks",
    },
    {
      value: "beverages",
      label: "Beverages",
      emoji: "🥤",
      desc: "Drinks, juices",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Basic Client-Side Validation
      if (!formData.title || !formData.description || !formData.location) {
        throw new Error(
          "Please fill in all required fields (Title, Description, Location)."
        );
      }

      // 2. Format Coordinates Safely
      // We handle both {lng, lat} object and [lng, lat] array formats
      let lng, lat;

      if (
        formData.location.coordinates &&
        Array.isArray(formData.location.coordinates)
      ) {
        lng = Number(formData.location.coordinates[0]);
        lat = Number(formData.location.coordinates[1]);
      } else {
        lng = Number(formData.location.lng);
        lat = Number(formData.location.lat);
      }

      if (isNaN(lng) || isNaN(lat)) {
        throw new Error(
          "Invalid location coordinates. Please re-select the location on the map."
        );
      }

      // 3. Construct Payload
      const apiPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        quantity: formData.quantity.toString(),
        expiryTime: new Date(formData.expiryTime).toISOString(),
        allergens: formData.allergens,
        pickupInstructions: formData.pickupInstructions || "",
        location: {
          type: "Point", // Essential for Mongoose GeoJSON
          coordinates: [lng, lat],
          address: formData.location.address || "Selected Location",
        },
      };

      // 4. Send to API
      console.log("Sending Payload:", apiPayload); // Debug log
      await onAddListing(apiPayload);

      // 5. Success State
      setFormData({
        title: "",
        description: "",
        category: "prepared_food",
        quantity: "",
        expiryTime: "",
        allergens: [],
        pickupInstructions: "",
        donor: user?.name || "",
        location: null,
      });
      setCurrentStep(1);
      alert("🎉 Listing published successfully!");
    } catch (error) {
      console.error("Submission Error Details:", error);

      // If the error comes from the API (express-validator), it usually has an 'errors' array
      let errorMessage = error.message;
      if (error.errors && Array.isArray(error.errors)) {
        // Create a readable string from the validation array
        errorMessage = error.errors.map((err) => `• ${err.msg}`).join("\n");
      }

      alert("Failed to create listing:\n" + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Sub Components ---

  const Stepper = () => (
    <div className="flex justify-between items-center mb-10 px-4 max-w-2xl mx-auto relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-300"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />

      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ${
              step <= currentStep
                ? "bg-primary-500 text-white ring-white shadow-lg scale-110"
                : "bg-white text-gray-400 ring-transparent border-2 border-gray-200"
            }`}
          >
            {step < currentStep ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : (
              step
            )}
          </div>
          <span
            className={`mt-2 text-xs font-semibold hidden sm:block ${
              step <= currentStep ? "text-primary-700" : "text-gray-400"
            }`}
          >
            {step === 1
              ? "Details"
              : step === 2
              ? "Specifics"
              : step === 3
              ? "Location"
              : "Review"}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 lg:py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Cancel</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            New Donation
          </h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>

        <Stepper />

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col min-h-[500px]">
            <div className="p-8 lg:p-10 flex-grow">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      What are you donating?
                    </h2>
                    <p className="text-gray-500">
                      Provide a clear title and description to help recipients.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="e.g., Assorted Bagels & Muffins"
                        className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-lg font-medium placeholder-gray-300 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe contents, condition, and packaging..."
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none placeholder-gray-300 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Donor Name
                      </label>
                      <input
                        type="text"
                        value={formData.donor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            donor: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      The Specifics
                    </h2>
                    <p className="text-gray-500">
                      Categorize your food for better discovery.
                    </p>
                  </div>

                  {/* Category Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            category: option.value,
                          }))
                        }
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center hover:shadow-md ${
                          formData.category === option.value
                            ? "border-primary-500 bg-primary-50 ring-2 ring-primary-200"
                            : "border-gray-100 bg-white hover:border-primary-200"
                        }`}
                      >
                        <span className="text-3xl mb-2">{option.emoji}</span>
                        <span
                          className={`font-bold text-sm ${
                            formData.category === option.value
                              ? "text-primary-800"
                              : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="text"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            quantity: e.target.value,
                          }))
                        }
                        placeholder="e.g., 5 boxes"
                        className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Best Before
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={formData.expiryTime}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              expiryTime: e.target.value,
                            }))
                          }
                          min={getCurrentDateTime()}
                          className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                          required
                        />
                        <CalendarDaysIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Allergens Chips */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1 text-amber-500" />
                      Does it contain any allergens?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableAllergens.map((allergen) => (
                        <button
                          type="button"
                          key={allergen}
                          onClick={() => handleAllergenToggle(allergen)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.allergens.includes(allergen)
                              ? "bg-amber-100 text-amber-800 border-2 border-amber-200 shadow-sm"
                              : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                          }`}
                        >
                          {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in h-full flex flex-col">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Where is it?
                    </h2>
                    <p className="text-gray-500">
                      Pinpoint the exact pickup location.
                    </p>
                  </div>

                  <div className="flex-grow">
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      initialLocation={formData.location}
                      required={true}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={formData.pickupInstructions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pickupInstructions: e.target.value,
                        }))
                      }
                      placeholder="e.g., Use back door, code 1234"
                      rows="2"
                      className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="animate-fade-in max-w-lg mx-auto w-full">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Ready to Publish?
                    </h2>
                    <p className="text-gray-500">
                      Review your listing card below.
                    </p>
                  </div>

                  {/* Card Preview */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative">
                    <div className="h-2 w-full bg-gradient-to-r from-primary-500 to-green-500"></div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-primary-100">
                          {
                            categoryOptions.find(
                              (c) => c.value === formData.category
                            )?.label
                          }
                        </span>
                        {formData.expiryTime && (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                            Expires:{" "}
                            {new Date(formData.expiryTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {formData.title}
                      </h3>
                      <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed">
                        {formData.description}
                      </p>

                      <div className="space-y-3 border-t border-gray-100 pt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span className="truncate">
                            {formData.location?.address}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                          <span>
                            {formData.quantity || "Quantity not specified"}
                          </span>
                        </div>
                      </div>

                      {formData.allergens.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                            Contains Allergens:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {formData.allergens.map((a) => (
                              <span
                                key={a}
                                className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md font-medium border border-amber-100"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  currentStep === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 &&
                      (!formData.title || !formData.description)) ||
                    (currentStep === 2 && !formData.expiryTime) ||
                    (currentStep === 3 && !formData.location)
                  }
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Next Step <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary-600 to-green-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Publishing...
                    </>
                  ) : (
                    <>Publish Listing 🚀</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddListing;
