
import ImageSlider from "@/components/ImageSlider";
//import CarAccessoriesGallery from "@/components/categories";
import FeaturedCollections from '@/components/FeaturedCollection';
import Bestseller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import Support from "@/components/Support";
import CategoriesPage from "../categories/page.tsx";
import HeroSlider from "@/components/HeroSlider";

export default function DashboardPage() {
    return (
    <main>
       <HeroSlider />
       {/* <CarAccessoriesGallery /> */}
      <CategoriesPage />
       <FeaturedCollections />
       <ImageSlider />
       <Bestseller /> 
       <Testimonials />
       <Support />
      
    </main>

  );
}