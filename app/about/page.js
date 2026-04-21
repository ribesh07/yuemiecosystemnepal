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
                src="/camera.jpeg"
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
                YueMi Ecosystem, a pioneering brand under Beijing YueMi Technology Co. Ltd., is part of the globally renowned Xiaomi Ecological Chain. The company was established on May 5, 2015, Invest in the Xiaomi ecological chain company founded by internal employees for Xiaomi. In 2021, Yuemi brand officially entered the field of automotive electronics, and developed a lot of fine products in the fields of Android navigation, driving recorder, LED lights, car fragrance, audio speakers, body film, etc. Yuemi adheres to the core business philosophy of Xiaomi ecological chain enterprises: the pursuit of the ultimate, the pursuit of cost-effective. As a result, once the series of automotive electronic products of Yuemi brand are listed, they have received consistent praise from the world. Users around the world are also constantly providing more consumer demands to Yuemi, hoping that through the in-depth customization of Yuemi, they can use more perfect vehicle products and enjoy more intelligent cabin space. 
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
                We respect the concept of "design a good life", and hope that every product we launch can bring you a more pleasant and good life. 

In Nepal, AutoZone Traders is the Exclusive seller of Yuemi Ecosystem, delivering these world class Automotive innovations to the Nepali Automotive Market with a promise of exceptional quality and customer service. 
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
