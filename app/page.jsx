import Image from "next/image";

import ImageSlider from "@/components/ImageSlider";
//import CarAccessoriesGallery from "@/components/categories";
import FeaturedCollections from "@/components/FeaturedCollection";
import Bestseller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import YoutubeVideoTestimonials from "@/components/YoutubeVideoTestimonials";
import Support from "@/components/Support";
//import YuemiCategories from "@/components/YuemiCategories";
import CategoriesPage from "./categories/page";

// import HeroSlider from "@/components/HeroSlider";


export default function Home() {
  return (
    <main>
       <ImageSlider />
       {/* <HeroSlider /> */}
       {/* <CarAccessoriesGallery /> */}
      <CategoriesPage />
       <FeaturedCollections />
       <ImageSlider />
       <Bestseller /> 
       
       <YoutubeVideoTestimonials />
       <Testimonials />
       <Support />
      
    </main>

  );
}
