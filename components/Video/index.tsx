"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setupScrollTrigger = useCallback(() => {
    if (!videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const duration = video.duration;

    if (!duration) return;

    // Create ScrollTrigger that pins until video ends
    // Calculate scroll distance: 100vh per second of video
    const scrollDistance = duration * window.innerHeight;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${scrollDistance}`, // Pin for scroll distance based on video duration
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Update video currentTime based on scroll progress
        const progress = self.progress;
        video.currentTime = progress * duration;
      },
    });
  }, []);

  useGSAP(
    () => {
      if (!videoRef.current || !containerRef.current) return;

      const video = videoRef.current;

      // Check if video is already loaded
      if (video.readyState >= 2 && video.duration) {
        setupScrollTrigger();
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-screen h-screen">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        src="/videos/hero.mp4"
        onLoadedMetadata={setupScrollTrigger}
      />
    </div>
  );
}
