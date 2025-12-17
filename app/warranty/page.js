'use client';

import { useState } from 'react';

export default function WarrantyPage() {
  const [formData, setFormData] = useState({
    serialNumber: '',
    purchaseDate: '',
    purchaseLocation: '',
    productCategory: '',
    productModel: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    receiptNumber: '',
    dealerName: '',
    warrantyPeriod: '',
    productCondition: 'new',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGenuineCheck, setShowGenuineCheck] = useState(false);
  const [checkSerialNumber, setCheckSerialNumber] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [genuineResult, setGenuineResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    if (!formData.productCategory) {
      newErrors.productCategory = 'Product category is required';
    }

    if (!formData.productModel.trim()) {
      newErrors.productModel = 'Product model is required';
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email is invalid';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      alert('Warranty registered successfully!');
      
      // Reset form
      setFormData({
        serialNumber: '',
        purchaseDate: '',
        purchaseLocation: '',
        productCategory: '',
        productModel: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        receiptNumber: '',
        dealerName: '',
        warrantyPeriod: '',
        productCondition: 'new',
        additionalNotes: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error registering warranty. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkGenuine = () => {
    setShowGenuineCheck(true);
    setGenuineResult(null);
    setCheckSerialNumber('');
  };

  const handleCheckProduct = async () => {
    if (!checkSerialNumber.trim()) {
      alert('Please enter a serial number');
      return;
    }

    setIsChecking(true);
    setGenuineResult(null);

    try {
      // Simulate API call to check product authenticity
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random result (in real app, this would be an API call)
      const isGenuine = Math.random() > 0.3; // 70% chance of being genuine
      
      setGenuineResult({
        isGenuine,
        serialNumber: checkSerialNumber,
        productName: isGenuine ? 'Premium Warranty Product X-2000' : 'Unknown Product',
        manufacturedDate: isGenuine ? '2024-06-15' : null,
        warrantyStatus: isGenuine ? 'Active - 2 Years' : null
      });

      // If genuine, auto-fill the serial number in main form
      if (isGenuine) {
        setFormData(prev => ({
          ...prev,
          serialNumber: checkSerialNumber
        }));
      }
    } catch (error) {
      console.error('Error checking product:', error);
      alert('Error checking product. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const closeGenuineCheck = () => {
    setShowGenuineCheck(false);
    setCheckSerialNumber('');
    setGenuineResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Genuine Product Check Modal */}
      {showGenuineCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Check Genuine Product</h2>
              <button
                onClick={closeGenuineCheck}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Enter the serial number to verify if your product is genuine.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                value={checkSerialNumber}
                onChange={(e) => setCheckSerialNumber(e.target.value)}
                placeholder="Enter serial number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isChecking}
              />
            </div>

            <button
              onClick={handleCheckProduct}
              disabled={isChecking || !checkSerialNumber.trim()}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:bg-orange-300 mb-4"
            >
              {isChecking ? 'Checking...' : 'Check Product'}
            </button>

            {genuineResult && (
              <div className={`p-4 rounded-lg ${genuineResult.isGenuine ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-3">
                  {genuineResult.isGenuine ? (
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${genuineResult.isGenuine ? 'text-green-800' : 'text-red-800'}`}>
                      {genuineResult.isGenuine ? 'Genuine Product Verified!' : 'Product Not Found'}
                    </h3>
                    {genuineResult.isGenuine ? (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><strong>Product:</strong> {genuineResult.productName}</p>
                        <p><strong>Serial:</strong> {genuineResult.serialNumber}</p>
                        <p><strong>Manufactured:</strong> {genuineResult.manufacturedDate}</p>
                        <p><strong>Warranty:</strong> {genuineResult.warrantyStatus}</p>
                        <p className="mt-3 text-green-700">
                          ✓ This serial number has been added to your warranty form.
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-700">
                        The serial number "{genuineResult.serialNumber}" could not be verified. 
                        Please check the number and try again, or contact customer support.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Warranty Registration</h2>
        
        <button
          type="submit"
          form='warranty-check'
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium disabled:bg-orange-300 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          CHECK FOR GENUINE PRODUCT
        </button>

        <button
          type="submit"
          form="warranty-form"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium disabled:bg-orange-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {isSubmitting ? 'REGISTERING...' : 'REGISTER WARRANTY'}
        </button>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Why Register?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Proof of ownership</li>
            <li>• Faster warranty claims</li>
            <li>• Product updates & recalls</li>
            <li>• Extended support</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Register for Warranty</h1>

          <form id="warranty-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Product Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Product Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="Serial Number of item"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.serialNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.serialNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.serialNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category *
                  </label>
                  <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.productCategory ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="appliances">Home Appliances</option>
                    <option value="tools">Tools & Equipment</option>
                    <option value="automotive">Automotive</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.productCategory && (
                    <p className="text-red-500 text-xs mt-1">{errors.productCategory}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Model *
                  </label>
                  <input
                    type="text"
                    name="productModel"
                    value={formData.productModel}
                    onChange={handleChange}
                    placeholder="Model number"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.productModel ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.productModel && (
                    <p className="text-red-500 text-xs mt-1">{errors.productModel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Condition *
                  </label>
                  <select
                    name="productCondition"
                    value={formData.productCondition}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="used">Used</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Purchase Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Purchase Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Purchase *
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.purchaseDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.purchaseDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchased Place
                  </label>
                  <input
                    type="text"
                    name="purchaseLocation"
                    value={formData.purchaseLocation}
                    onChange={handleChange}
                    placeholder="Store or online platform"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receipt/Invoice Number
                  </label>
                  <input
                    type="text"
                    name="receiptNumber"
                    value={formData.receiptNumber}
                    onChange={handleChange}
                    placeholder="Receipt or invoice number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dealer/Retailer Name
                  </label>
                  <input
                    type="text"
                    name="dealerName"
                    value={formData.dealerName}
                    onChange={handleChange}
                    placeholder="Authorized dealer name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Period
                  </label>
                  <select
                    name="warrantyPeriod"
                    value={formData.warrantyPeriod}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select warranty period</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="2years">2 Years</option>
                    <option value="3years">3 Years</option>
                    <option value="5years">5 Years</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customer Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.customerPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    placeholder="Street address"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.customerAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.customerAddress && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State or Province"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP or Postal code"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="NP">Nepal</option>
                    <option value="IN">India</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Additional Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any additional information or special circumstances..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                By submitting this form, you agree to our warranty terms and conditions. 
                All information provided must be accurate and complete. Fields marked with * are required.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}