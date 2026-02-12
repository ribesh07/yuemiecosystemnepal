export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Return Policy</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Your satisfaction is our priority. Easy returns within 7 days.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-300 opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">7 Days</h3>
            <p className="text-gray-600">Return Window</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-gray-600">Defective Returns</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">5-7 Days</h3>
            <p className="text-gray-600">Refund Processing</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Returns Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-600 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Return</h3>
                  <p className="text-gray-600">Log into your account and select the item you'd like to return from your order history.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-600 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ship It Back</h3>
                  <p className="text-gray-600">Print your prepaid label, pack the item securely, and drop it off at any shipping location.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-600 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Refunded</h3>
                  <p className="text-gray-600">Once we receive your return, we'll process your refund within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Eligible Returns */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 ml-4">Eligible for Return</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Items in original condition with tags</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Unused products in original packaging</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Defective or damaged items</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Wrong items received</span>
              </li>
            </ul>
          </div>

          {/* Non-Returnable */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-8 border border-red-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 ml-4">Non-Returnable</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Personal care items & cosmetics</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Intimate apparel & swimwear</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Food & perishable goods</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Custom or personalized items</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Digital products & gift cards</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our customer service team is here to assist you with any questions about returns or refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:yuemiecosystemnepal@gmail.com" className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <a href="tel:9802341806" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              9802341806
            </a>
          </div>
          <p className="text-blue-100 mt-6 text-sm">Sunday-Friday, 9AM-6PM </p>
        </div>
      </div>

      
      
    </div>
  );
}