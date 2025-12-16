import Image from "next/image";

import ImageSlider from "@/components/ImageSlider";
import CarAccessoriesGallery from "@/components/categories";


export default function Home() {
  return (
    <main>
       <ImageSlider />
       <CarAccessoriesGallery />
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
       
        <>Welcome to Yuemi Ecosystem Nepal</>
      </div>
    </main>

  );
}
