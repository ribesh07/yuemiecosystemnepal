import Image from "next/image";

import ImageSlider from "@/components/ImageSlider";
import CarAccessoriesGallery from "@/components/categories";
import FeaturedCollections from "@/components/FeaturedCollection";
import Bestseller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";


export default function Home() {
  return (
    <main>
       <ImageSlider />
       <CarAccessoriesGallery />
       <FeaturedCollections />
       <ImageSlider />
       <Bestseller /> 
       <Testimonials />
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
       
        <>Welcome to Yuemi Ecosystem Nepal</>
      </div>
    </main>

  );
}
