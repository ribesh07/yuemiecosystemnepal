"use client";

export default function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="h-10 w-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

