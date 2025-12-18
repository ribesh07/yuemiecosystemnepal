'use client';

import { useState } from 'react';

export default function WarrantyPage() {
  const [activeTab, setActiveTab] = useState('register');
  const [showWarrantyResult, setShowWarrantyResult] = useState(false);
  const [warrantyResult, setWarrantyResult] = useState(null);
  
  const [registerSerial, setRegisterSerial] = useState('');
  const [checkSerial, setCheckSerial] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!registerSerial.trim()) {
      alert('Please enter a serial number');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Warranty registered successfully!');
      setRegisterSerial('');
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error registering warranty. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckWarranty = async (e) => {
    e.preventDefault();
    
    if (!checkSerial.trim()) {
      alert('Please enter a serial number');
      return;
    }

    setIsChecking(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isValid = Math.random() > 0.2;
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 12));
      
      setWarrantyResult({
        isValid,
        serialNumber: checkSerial,
        productName: isValid ? 'Premium Warranty Product X-2000' : 'Unknown Product',
        purchaseDate: isValid ? '2024-01-15' : null,
        expiryDate: isValid ? expiryDate.toISOString().split('T')[0] : null,
        warrantyPeriod: isValid ? '2 Years' : null,
        status: isValid ? 'Active' : 'Not Found'
      });
      
      setShowWarrantyResult(true);
    } catch (error) {
      console.error('Error checking warranty:', error);
      alert('Error checking warranty. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Warranty Check Result Modal */}
      {showWarrantyResult && warrantyResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Warranty Status</h2>
              <button
                onClick={() => {
                  setShowWarrantyResult(false);
                  setWarrantyResult(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {warrantyResult.isValid ? (
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Congratulations!</h3>
                <p className="text-gray-600 mb-8 text-lg">Your warranty is active and valid</p>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-left space-y-4 mb-6 shadow-inner">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Product</span>
                    <span className="font-semibold text-gray-800">{warrantyResult.productName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Serial Number</span>
                    <span className="font-mono font-semibold text-gray-800">{warrantyResult.serialNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Purchase Date</span>
                    <span className="font-semibold text-gray-800">{warrantyResult.purchaseDate}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Warranty Period</span>
                    <span className="font-semibold text-gray-800">{warrantyResult.warrantyPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-700 font-bold text-lg">Expires On</span>
                    <span className="font-bold text-orange-600 text-2xl">{warrantyResult.expiryDate}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-sm font-semibold text-green-800">
                      Your warranty is currently active and protected
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Warranty Not Found</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  The serial number could not be found in our system
                </p>
                
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-left mb-6">
                  <p className="text-sm font-semibold text-red-800 mb-3">
                    This could mean:
                  </p>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>The product is not registered in our system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>The serial number "{warrantyResult.serialNumber}" is incorrect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>The warranty may have expired or been voided</span>
                    </li>
                  </ul>
                </div>
                
                <button
                  onClick={() => {
                    setShowWarrantyResult(false);
                    setActiveTab('register');
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg"
                >
                  Register Your Warranty Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Warranty Portal</h2>
              <p className="text-xs text-gray-500">Manage your products</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-6">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('register')}
              className={`w-full text-left px-5 py-4 rounded-xl font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-6 h-6 ${activeTab === 'register' ? 'text-white' : 'text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div className="text-base">Register Warranty</div>
                  <div className={`text-xs ${activeTab === 'register' ? 'text-orange-100' : 'text-gray-500'}`}>
                    Register a new product
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('check')}
              className={`w-full text-left px-5 py-4 rounded-xl font-semibold transition-all ${
                activeTab === 'check'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-6 h-6 ${activeTab === 'check' ? 'text-white' : 'text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <div>
                  <div className="text-base">Check Warranty</div>
                  <div className={`text-xs ${activeTab === 'check' ? 'text-orange-100' : 'text-gray-500'}`}>
                    Verify warranty status
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-auto p-6">
          <div className="bg-gradient-to-br from-orange-50 to-indigo-50 rounded-xl p-5 border border-orange-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  {activeTab === 'register' ? 'Why Register?' : 'Quick Check'}
                </h3>
                {activeTab === 'register' ? (
                  <ul className="text-sm text-gray-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Proof of ownership</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Faster warranty claims</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Product updates</span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Instantly verify your product's warranty status and expiration date.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Register Warranty Content */}
          {activeTab === 'register' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Register Warranty</h1>
                  <p className="text-gray-500">Protect your product with warranty registration</p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Product Serial Number *
                  </label>
                  <input
                    type="text"
                    value={registerSerial}
                    onChange={(e) => setRegisterSerial(e.target.value)}
                    placeholder="Enter your product's serial number"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>The serial number is usually found on the product label or packaging</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !registerSerial.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold text-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Registration
                    </>
                  )}
                </button>

                <div className="bg-gradient-to-br from-orange-50 to-indigo-50 border-2 border-orange-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2">What happens next?</h3>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          <span>Your warranty will be registered in our system</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          <span>You'll receive a confirmation email</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          <span>Access to priority customer support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Check Warranty Content */}
          {activeTab === 'check' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Check Warranty Status</h1>
                  <p className="text-gray-500">Verify your product's warranty information</p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

              <form onSubmit={handleCheckWarranty} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Product Serial Number *
                  </label>
                  <input
                    type="text"
                    value={checkSerial}
                    onChange={(e) => setCheckSerial(e.target.value)}
                    placeholder="Enter serial number to check warranty"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Find your serial number on the product label, manual, or original packaging</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isChecking || !checkSerial.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold text-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {isChecking ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking Warranty...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Check Warranty
                    </>
                  )}
                </button>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2">You'll see:</h3>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>Product name and model information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>Purchase date and warranty period</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>Warranty expiration date</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>Current warranty status</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}