
import ImageSlider from "@/components/ImageSlider";


export default function DashboardPage() {
    return (
        <div>
        <ImageSlider />
        <CarAccessoriesGallery />
        
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-lg text-gray-600">
                
                Welcome to your dashboard! Here you can manage your settings and view your activity.
            </p>
        </div>
        </div>
    );
}