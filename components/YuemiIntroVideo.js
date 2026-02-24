"use client";

import { useEffect, useRef } from "react";

export default function YuemiIntroVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 4) {
        video.currentTime = 0;
        video.play();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div className="w-full max-w-md rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        src="/yuemi.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-auto object-cover"
      />
    </div>
  );
}