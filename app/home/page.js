
import ImageSlider from "@/components/ImageSlider";
//import CarAccessoriesGallery from "@/components/categories";
import FeaturedCollections from '@/components/FeaturedCollection';
import Bestseller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import Support from "@/components/Support";
import YuemiCategories from "@/components/YuemiCategories";

export default function DashboardPage() {
    return (
        <div>
     <ImageSlider />
       {/* <CarAccessoriesGallery /> */}
       <YuemiCategories />
       <FeaturedCollections />
       <ImageSlider />
       <Bestseller /> 
       <Testimonials />
       <Support />
        </div>
    );
}