
import ImageSlider from "@/components/ImageSlider";
import CarAccessoriesGallery from "@/components/categories";
import FeaturedCollections from '@/components/FeaturedCollection';
import Bestseller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import Support from "@/components/Support";

export default function DashboardPage() {
    return (
        <div>
     <ImageSlider />
       <CarAccessoriesGallery />
       <FeaturedCollections />
       <ImageSlider />
       <Bestseller /> 
       <Testimonials />
       <Support />
        </div>
    );
}