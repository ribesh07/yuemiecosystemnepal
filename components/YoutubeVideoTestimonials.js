"use client";

import { useEffect, useState } from "react";

const YoutubeVideoTestimonials = () => {
  const [videoTestimonials, setVideoTestimonials] = useState([]);

  const toEmbedUrl = (url) => {
    const value = String(url || "").trim();
    if (!value) return "";
    const watchMatch = value.match(/[?&]v=([^&]+)/);
    if (watchMatch?.[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    const shortMatch = value.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    const embedMatch = value.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch?.[1]) {
      return `https://www.youtube.com/embed/${embedMatch[1]}`;
    }
    return "";
  };

  useEffect(() => {
    const fetchVideoTestimonials = async () => {
      try {
        const res = await fetch("/api/youtube-testimonials?active=1", {
          cache: "no-store",
        });
        const payload = await res.json();
        if (!res.ok) return;
        setVideoTestimonials(Array.isArray(payload?.data) ? payload.data : []);
      } catch (error) {
        console.error("YOUTUBE_TESTIMONIALS_FETCH_ERROR", error);
      }
    };

    fetchVideoTestimonials();
  }, []);

  if (videoTestimonials.length === 0) return null;

  return (
    <section className="py-10 md:py-16 px-3 sm:px-4" style={{ backgroundColor: "#F5EFE0" }}>
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-900">
          Video Testimonials
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {videoTestimonials.map((item) => {
            const embedUrl = toEmbedUrl(item.youtubeLink);
            if (!embedUrl) return null;
            const hasDescription = Boolean(String(item.description || "").trim());
            const hasReviewerBlock = Boolean(
              String(item.profileImage || "").trim() ||
              String(item.name || "").trim() ||
              String(item.designation || "").trim() ||
              String(item.review || "").trim()
            );
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    title={item.title || "YouTube testimonial"}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 line-clamp-2">
                    {item.title}
                  </h4>
                  {hasDescription && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  {hasReviewerBlock && (
                    <>
                      <div className="mt-3 flex items-center gap-3">
                        {String(item.profileImage || "").trim() ? (
                          <img
                            src={item.profileImage}
                            alt={item.name || "Reviewer"}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            loading="lazy"
                          />
                        ) : null}
                        <div className="min-w-0">
                          {String(item.name || "").trim() ? (
                            <div className="text-sm font-semibold text-gray-800 truncate">
                              {item.name}
                            </div>
                          ) : null}
                          {String(item.designation || "").trim() ? (
                            <div className="text-xs text-gray-500 truncate">
                              {item.designation}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {String(item.review || "").trim() ? (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                          {item.review}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default YoutubeVideoTestimonials;
