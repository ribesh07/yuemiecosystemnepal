import React from "react";
import Image from "next/image";

function Page() {
  return (
    <div>
      {/* TOP SINGLE BANNER IMAGE */}
      <div className="relative w-full h-64 md:h-[450px]">
        <Image
          src="/banner.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* CONTENT SECTION */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          

          {/* PRODUCT 1 */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-28">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src="/Group_1_1_2.webp"
                alt="Premium Dental Chair"
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                YueMi About Us
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-8">
                Welcome to YueMi Ecosystem, a pioneering brand under Beijing YueMi Technology Co. Ltd., part of the globally renowned Xiaomi Ecological Chain. Known for its cuttingedge innovation and top-notch quality, Xiaomi has consistently revolutionized the tech industry with products that inspire and empower millions across the globe.

From smartphones to smart homes, Xiaomi has become a trusted name, synonymous with excellence and customer satisfaction. Now, Xiaomi's innovative spirit extends into the automotive industry through the YueMi Ecosystem, offering a comprehensive range of high-quality automotive accessories and electronics.
              </p>
              
            </div>
          </div>

          {/* PRODUCT 2 */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-28">
            <div className="relative w-full h-64 md:h-96 md:order-2">
              <Image
                src="/Rectangle_1_1_1.webp"
                alt="Advanced X-Ray Machine"
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>

            <div>
              
              <p className="text-gray-700 leading-relaxed text-lg mb-8">
                Designed to enhance your driving experience with intelligent solutions, YueMi Ecosystem brings the perfect blend of advanced technology, durability, and style. We are committed to reshaping the future of automotive experiences with smart, reliable, and user-friendly products.

In India, Abbtron NextGen Private Limited is the exclusive seller of YueMi Ecosystem, delivering these world-class automotive innovations to the Indian market with a promise of exceptional quality and customer service.
              </p>
              
            </div>
          </div>

          
    
        </div>
      </section>
      <div className="relative w-full h-64 md:h-[450px]">
        <Image
          src="/imag1.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

export default Page;
