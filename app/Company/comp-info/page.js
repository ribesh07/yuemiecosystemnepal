import React from 'react';

export default function CompanyInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: December 21, 2025</p>

          <div className="prose prose-gray max-w-none">

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Who We Are</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to our company. We are a passionate team of creators, builders, and problem-solvers dedicated to delivering high-quality products and exceptional customer experiences. Founded in 2011, we have grown from a small local shop into a trusted brand serving customers across 38 countries worldwide.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Everything we do is guided by a single belief: the things you bring into your life should be intentional, durable, and beautiful. We curate, design, and deliver goods that meet that standard — no exceptions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our mission is to make thoughtfully crafted products accessible to everyone. We partner with independent makers, ethical manufacturers, and sustainable suppliers to bring you goods that are designed to last. We are not interested in fast fashion or disposable culture — we believe in quality without compromise.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <h3 className="text-xl font-medium text-gray-800 mb-3">How It Started</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                It began with a folding table at a local weekend market in 2011. Our founder, Elena Marsh, showed up with 24 handpicked items — a ceramic mug, a leather wallet, a hand-poured candle — and sold out by noon. By the end of the day, she had a waiting list.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Where We Are Today</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Today we work with over 80 makers across 14 countries, ship to every continent, and personally review every product before it earns a place in our collection. We have served more than 140,000 customers and maintain a 4.9-star average rating — numbers we are proud of, but not complacent about.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our values are not a marketing statement — they are the standard we hold ourselves to every day:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><span className="font-medium">Craftsmanship</span> — We choose products for their materials, their makers, and their longevity</li>
                <li><span className="font-medium">Transparency</span> — We tell you where things come from, who made them, and what they cost us to produce</li>
                <li><span className="font-medium">Sustainability</span> — Carbon-offset shipping, recycled packaging, and partnerships only with ethical suppliers</li>
                <li><span className="font-medium">Community</span> — 1% of every sale goes to artisan communities and small-scale makers worldwide</li>
                <li><span className="font-medium">Accountability</span> — If something goes wrong, we fix it — no scripts, no runarounds</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Team</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Behind every product and every order is a team that genuinely cares. Our core team is made up of people with backgrounds in product design, supply chain, customer experience, and sustainability. Key members include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><span className="font-medium">Elena Marsh</span> — Founder &amp; Creative Director</li>
                <li><span className="font-medium">James Okafor</span> — Head of Product</li>
                <li><span className="font-medium">Sora Tanaka</span> — Chief Experience Officer</li>
                <li><span className="font-medium">Mia Laurent</span> — Head of Sustainability</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We are a fully remote team spread across North America, Europe, and Asia — working across time zones to serve customers wherever they are.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sustainability Commitment</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take our environmental responsibility seriously. Our current sustainability commitments include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>100% carbon-offset shipping on all domestic orders</li>
                <li>Packaging made from recycled and biodegradable materials</li>
                <li>Supplier audits to verify fair labor and environmental standards</li>
                <li>Annual sustainability report published openly on our website</li>
                <li>Partnership with One Tree Planted — one tree planted per order</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Press &amp; Media</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We welcome press inquiries, collaboration requests, and media partnerships. For press kits, product samples, or interviews, please reach out to our communications team directly at the contact details below. We aim to respond to all media inquiries within 2 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Careers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We are always on the lookout for curious, driven people who care about quality and doing things the right way. We offer flexible remote work, competitive compensation, and a culture built on trust. Open roles are posted on our website. Even if no roles are currently listed, we welcome speculative applications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Have a question, a partnership proposal, or just want to say hello? We would love to hear from you.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">General Inquiries:</span> hello@example.com
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Press &amp; Media:</span> press@example.com
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Careers:</span> careers@example.com
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Phone:</span> +1 (555) 123-4567
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span> 214 Makers Lane, Suite 400, Portland, OR 97201
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}