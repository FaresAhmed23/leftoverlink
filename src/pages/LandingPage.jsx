import { useState } from 'react'
import { ChevronRightIcon, MapPinIcon, UserGroupIcon, HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

function LandingPage({ onGetStarted, onSignIn }) {
  const [email, setEmail] = useState('')

  const handleGetStarted = (e) => {
    e.preventDefault()
    onGetStarted(email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🍽️</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">LeftoverLink</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#impact" className="text-gray-600 hover:text-gray-900 transition-colors">Impact</a>
              <button 
                onClick={onSignIn}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => onGetStarted('')}
                className="btn-primary"
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connect Food to 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-green-600"> Those in Need</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Reduce food waste and fight hunger. LeftoverLink connects restaurants with leftover food 
              to individuals, charities, and organizations who can put it to good use.
            </p>

            <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field flex-1"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Get Started
                <ChevronRightIcon className="w-5 h-5 ml-2 inline" />
              </button>
            </form>

            <p className="text-sm text-gray-500">
              Join thousands making a difference. No spam, unsubscribe anytime.
            </p>
          </div>

          {/* Hero Image/Animation */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPinIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Find Nearby Food</h3>
                  <p className="text-sm text-gray-600">Discover available food within walking distance</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Connect Communities</h3>
                  <p className="text-sm text-gray-600">Link donors with those who need food most</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Make Impact</h3>
                  <p className="text-sm text-gray-600">Track your environmental and social impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Make a Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools needed to efficiently connect surplus food with those who need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📍',
                title: 'Location-Based Matching',
                description: 'Automatically find the nearest available food using GPS technology.'
              },
              {
                icon: '⏰',
                title: 'Real-Time Updates',
                description: 'Live inventory updates with expiration timers and urgency indicators.'
              },
              {
                icon: '🔒',
                title: 'Secure & Verified',
                description: 'All users are verified for safety and trust in our community.'
              },
              {
                icon: '📱',
                title: 'Mobile Optimized',
                description: 'Perfect experience on any device with offline capabilities.'
              },
              {
                icon: '🌱',
                title: 'Impact Tracking',
                description: 'See your environmental impact with detailed analytics and reports.'
              },
              {
                icon: '🤝',
                title: 'Community First',
                description: 'Built for communities, charities, and individuals working together.'
              }
            ].map((feature, index) => (
              <div key={index} className="card p-8 text-center hover:transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How LeftoverLink Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to reduce waste and help your community in just minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Post or Find Food',
                description: 'Restaurants post available leftover food, or individuals search for nearby options.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                title: 'Connect & Coordinate',
                description: 'Our platform matches food donors with recipients based on location and preferences.',
                color: 'from-green-500 to-green-600'
              },
              {
                step: '03',
                title: 'Collect & Impact',
                description: 'Pick up the food and track your positive impact on the environment and community.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Impact, Real Numbers
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Together, our community is making a measurable difference in fighting food waste and hunger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '50,000+', label: 'Meals Saved', icon: '🍽️' },
              { number: '1,200+', label: 'Restaurants', icon: '🏪' },
              { number: '25 tons', label: 'CO₂ Reduced', icon: '🌱' },
              { number: '10,000+', label: 'People Helped', icon: '❤️' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community today and start connecting food to those who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onGetStarted('')}
              className="bg-gradient-to-r from-primary-500 to-green-500 hover:from-primary-600 hover:to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Sharing Food
            </button>
            <button 
              onClick={onSignIn}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🍽️</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LeftoverLink</span>
            </div>
            
            <div className="flex space-x-6 text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; 2024 LeftoverLink. All rights reserved. Made with ❤️ for the community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage