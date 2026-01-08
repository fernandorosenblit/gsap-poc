"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Configurable timing for hero-title appearance
// Values are between 0 and 1 (0% to 100% of scroll progress)
const HERO_TITLE_CONFIG = {
  appearAt: 0.06, // Title appears at 6% of scroll progress
  disappearAt: 0.2, // Title disappears at 20% of scroll progress
};

export default function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  const setupScrollTrigger = useCallback(() => {
    if (!videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const duration = video.duration;

    if (!duration) return;

    // Create ScrollTrigger that pins until video ends
    // Calculate scroll distance: 100vh per second of video
    const scrollDistance = duration * window.innerHeight;

    // Set initial state: hidden (only if heroTitleRef is available)
    if (heroTitleRef.current) {
      gsap.set(heroTitleRef.current, {
        opacity: 0,
        visibility: "hidden",
      });
    }

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

        // Control hero-title visibility based on progress (only if element exists)
        if (heroTitleRef.current) {
          const { appearAt, disappearAt } = HERO_TITLE_CONFIG;

          if (progress >= appearAt && progress <= disappearAt) {
            // Fade in/out with smooth transitions
            let opacity = 1;

            // Fade in at the start
            if (progress < appearAt + 0.1) {
              opacity = (progress - appearAt) / 0.1;
            }
            // Fade out at the end
            else if (progress > disappearAt - 0.1) {
              opacity = (disappearAt - progress) / 0.1;
            }

            gsap.to(heroTitleRef.current, {
              opacity: opacity,
              visibility: "visible",
              duration: 0,
            });
          } else {
            // Hide when outside the range
            gsap.to(heroTitleRef.current, {
              opacity: 0,
              visibility: "hidden",
              duration: 0,
            });
          }
        }
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
    <div ref={containerRef} className="w-screen h-screen relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        src="/videos/hero.mp4"
        onLoadedMetadata={setupScrollTrigger}
      />
      <div className="max-w-[500px] mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center justify-center">
        <h2
          ref={heroTitleRef}
          className="text-black text-[100px] leading-[100px] tracking-[-4px] hero-title"
        >
          Carrera
        </h2>
        {/* <p className="text-white text-[17px] leading-[16.49px] tracking-[-0.68px] text-center">
          The Porsche Carrera is a high-performance sports car produced by
          Porsche. It is known for its powerful engine, sleek design, and
          advanced technology.
        </p> */}
      </div>
    </div>
  );
}
