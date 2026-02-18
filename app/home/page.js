
import ImageSlider from "@/components/ImageSlider";
//import CarAccessoriesGallery from "@/components/categories";
import FeaturedCollections from '@/components/FeaturedCollection';
import Bestseller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import Support from "@/components/Support";
import CategoriesPage from "../categories/page.tsx";

export default function DashboardPage() {
    return (
    <main>
       <ImageSlider />
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