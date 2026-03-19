import React from 'react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Return Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: December 21, 2025</p>

          <div className="prose prose-gray max-w-none">

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We want you to be completely satisfied with your purchase. If you are not satisfied for any reason, you may return most items within 30 days of delivery for a full refund or exchange. Please read the following policy carefully before initiating a return.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Eligibility for Returns</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To be eligible for a return, the following conditions must be met:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Item must be returned within 30 days of the delivery date</li>
                <li>Item must be unused and in the same condition as received</li>
                <li>Item must be in its original packaging with all tags attached</li>
                <li>Proof of purchase (order number or receipt) must be provided</li>
                <li>Item must not be listed under non-returnable categories below</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Non-Returnable Items</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following items cannot be returned or exchanged:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Final sale or clearance items marked as non-returnable</li>
                <li>Custom-made, personalized, or engraved products</li>
                <li>Perishable goods such as food or flowers</li>
                <li>Downloadable software or digital products</li>
                <li>Intimate or sanitary goods for hygiene reasons</li>
                <li>Gift cards or store credit vouchers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Initiate a Return</h2>
              <h3 className="text-xl font-medium text-gray-800 mb-3">Step 1 — Request a Return</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Log in to your account, navigate to your order history, and select the item you wish to return. Click "Start a Return" and follow the on-screen instructions. You will receive a confirmation email with further steps within 2 business hours.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Step 2 — Pack Your Item</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Securely repack the item in its original packaging. Include the printed return slip provided in your confirmation email inside the package. Items that arrive damaged due to improper packing may not qualify for a full refund.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Step 3 — Ship It Back</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Use the prepaid return shipping label attached to your confirmation email and drop the package at any authorized carrier location. We cover return shipping costs for all domestic orders. International customers are responsible for return shipping fees.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Step 4 — Receive Your Refund</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once we receive and inspect your returned item (typically 2–3 business days), we will notify you by email. If approved, your refund will be processed to your original payment method within 5–7 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchanges</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We gladly accept exchanges for a different size, color, or variant of the same item. To request an exchange, select "Exchange" instead of "Return" when initiating your request. Replacement items are shipped as soon as your original return is received and inspected. Exchanges are subject to product availability.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged or Defective Items</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If your item arrived damaged, defective, or incorrect, please contact us within 48 hours of delivery. Email us at returns@example.com with your order number and clear photos of the damage or defect. We will arrange a replacement or issue a full refund at no cost to you — no return shipment required in most cases.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Details</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All approved refunds are issued to the original payment method used at checkout. Please note the following:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Credit / debit card refunds may take 5–7 business days to appear on your statement</li>
                <li>Original shipping fees are non-refundable unless the return is due to our error</li>
                <li>Refunds are processed in your original payment currency</li>
                <li>Store credit is available as an alternative and is issued instantly upon approval</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Late or Missing Refunds</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have not received your refund within the expected timeframe, please take the following steps before contacting us:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Check your bank account or payment app once more</li>
                <li>Contact your credit card provider — it may take additional processing time</li>
                <li>Contact your bank, as there is often some processing time before a refund is posted</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                If you have completed all of the above steps and still have not received your refund, please reach out to us using the contact details below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to update or modify this Return Policy at any time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically. Continued use of our services after changes are posted constitutes your acceptance of the revised policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about our Return Policy or need assistance with a return, please contact our support team:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Email:</span> returns@example.com
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Phone:</span> +1 (555) 123-4567
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span> 123 Commerce Street, Suite 100, City, State 12345
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}