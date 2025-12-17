import Image from "next/image";

import ImageSlider from "@/components/ImageSlider";
import CarAccessoriesGallery from "@/components/categories";
import FeaturedCollections from "@/components/FeaturedCollection";
import Bestseller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import Support from "@/components/Support";


export default function Home() {
  return (
    <main>
       <ImageSlider />
       <CarAccessoriesGallery />
       <FeaturedCollections />
       <ImageSlider />
       <Bestseller /> 
       <Testimonials />
       <Support />
      
    </main>

  );
}
