import { useState, useEffect } from "react";
import {
  ChevronRightIcon,
  MapPinIcon,
  UserGroupIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// --- Sub-Components for cleaner structure ---

const FeatureCard = ({ icon, title, description }) => (
  <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl" />
    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors">
      <span className="text-3xl" role="img" aria-label={title}>
        {icon}
      </span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description, color }) => (
  <div className="relative flex flex-col items-center text-center p-6">
    <div
      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg transform transition-transform hover:rotate-6`}
    >
      <span className="text-2xl font-bold text-white">{number}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatItem = ({ number, label, icon }) => (
  <div className="flex flex-col items-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
    <div className="text-4xl mb-3">{icon}</div>
    <div className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">
      {number}
    </div>
    <div className="text-green-100 font-medium uppercase tracking-wider text-sm">
      {label}
    </div>
  </div>
);

// --- Main Component ---

function LandingPage({ onGetStarted, onSignIn }) {
  const [email, setEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = (e) => {
    e.preventDefault();
    onGetStarted(email);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-primary-200 selection:text-primary-900">
      {/* Navigation - Sticky & Glassmorphic */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-green-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <span className="text-xl">🍽️</span>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                LeftoverLink
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {["Features", "How it Works", "Impact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onSignIn}
                className="hidden md:block text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onGetStarted("")}
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-900/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            Now live in your community
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
            Connect Food to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-green-600">
              Those Who Need It
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            The smart way to reduce waste and fight hunger. Instantly connect
            restaurants with surplus food to charities and neighbors.
          </p>

          <form
            onSubmit={handleGetStarted}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-12"
          >
            <input
              type="email"
              placeholder="enter@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl border-gray-200 bg-white shadow-sm focus:border-primary-500 focus:ring-primary-500 text-gray-900 placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Join Now <ArrowRightIcon className="w-5 h-5" />
            </button>
          </form>

          {/* Social Proof */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                    />
                  </div>
                ))}
              </div>
              <span>Join 10,000+ members</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500" /> Free
                forever
              </span>
              <span className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500" /> Secure
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Geo-Location</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Find or donate food within your immediate 5km radius.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Community Verified</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Trust system ensures safety for both donors and recipients.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <HeartIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Zero Waste</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Track your CO2 reduction and meals saved in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-3">
              Features
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Efficiency & Impact
            </h3>
            <p className="text-xl text-gray-500">
              We've stripped away the complexity. LeftoverLink provides exactly
              what you need to share food quickly and safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="📍"
              title="Smart Matching"
              description="Our algorithm instantly notifies the most relevant recipients based on distance and food preferences."
            />
            <FeatureCard
              icon="⏰"
              title="Expiration Alerts"
              description="Dynamic urgency indicators help prioritize food that needs to be consumed quickly."
            />
            <FeatureCard
              icon="🛡️"
              title="Safety First"
              description="Built-in allergen declarations and donor verification systems keep the community safe."
            />
            <FeatureCard
              icon="📱"
              title="Mobile First"
              description="Designed for on-the-go use. Snap a photo, add details, and list an item in under 30 seconds."
            />
            <FeatureCard
              icon="📊"
              title="Impact Analytics"
              description="Businesses get detailed reports on waste reduction for CSR and tax purposes."
            />
            <FeatureCard
              icon="🤝"
              title="Direct Chat"
              description="Coordinate pickup times and details smoothly without sharing personal phone numbers."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h3>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <StepCard
                number="01"
                title="List"
                description="Donors snap a photo and add details. It takes less than a minute."
                color="from-blue-500 to-blue-600"
              />
              <StepCard
                number="02"
                title="Connect"
                description="Nearby recipients get notified and claim the food instantly."
                color="from-green-500 to-green-600"
              />
              <StepCard
                number="03"
                title="Pickup"
                description="Meet at the verified location and save the food from the landfill."
                color="from-purple-500 to-purple-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="impact"
        className="py-24 bg-gray-900 relative overflow-hidden"
      >
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-green-900 to-transparent" />
          <div className="absolute left-0 bottom-0 w-1/2 h-full bg-gradient-to-r from-blue-900 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Collective Impact
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Every meal shared is a victory for the planet and our community.
              Here is what we have achieved together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatItem number="50k+" label="Meals Saved" icon="🍽️" />
            <StatItem number="1.2k" label="Active Donors" icon="🏪" />
            <StatItem number="25t" label="CO₂ Prevented" icon="🌱" />
            <StatItem number="10k+" label="Lives Touched" icon="❤️" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Stop Wasting. Start Sharing.
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join the movement today. Whether you have food to give or need a
            helping hand, LeftoverLink is here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onGetStarted("")}
              className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transform hover:-translate-y-1 transition-all"
            >
              Get Started for Free
            </button>
            <button
              onClick={onSignIn}
              className="px-8 py-4 bg-white text-gray-900 font-bold border-2 border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all"
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🍽️</span>
                <span className="text-xl font-bold text-gray-900">
                  LeftoverLink
                </span>
              </div>
              <p className="text-gray-500 max-w-xs">
                Empowering communities to reduce food waste and end hunger
                through technology.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Find Food
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Donate Food
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Impact Reports
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} LeftoverLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
