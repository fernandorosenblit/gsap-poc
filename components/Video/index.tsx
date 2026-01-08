"use client";

import { useRef, useCallback, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Animation configuration
// Each entry defines when a component should appear/disappear
// Values are between 0 and 1 (0% to 100% of scroll progress)
type AnimationConfig = {
  selector: string | RefObject<HTMLElement>;
  appearAt: number; // When to start appearing (0-1)
  disappearAt: number; // When to start disappearing (0-1)
  fadeDuration?: number; // Duration of fade in/out (default: 0.1)
};

const ANIMATION_CONFIG: AnimationConfig[] = [
  {
    selector: ".hero-title",
    appearAt: 0.06, // 6% of scroll progress
    disappearAt: 0.2, // 20% of scroll progress
    fadeDuration: 0.1, // 10% fade transition
  },
  // Add more animations here:
  // {
  //   selector: ".another-element",
  //   appearAt: 0.3,
  //   disappearAt: 0.7,
  //   fadeDuration: 0.15,
  // },
];

export default function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setupScrollTrigger = useCallback(() => {
    if (!videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const duration = video.duration;

    if (!duration) return;

    // Calculate scroll distance: 100vh per second of video
    const scrollDistance = duration * window.innerHeight;

    // Create timeline for all animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Update video currentTime based on scroll progress
          const progress = self.progress;
          video.currentTime = progress * duration;
        },
      },
    });

    // Set initial states and add animations to timeline
    ANIMATION_CONFIG.forEach((config) => {
      const element =
        typeof config.selector === "string"
          ? containerRef.current?.querySelector(config.selector)
          : config.selector.current;

      if (!element) return;

      const fadeDuration = config.fadeDuration || 0.1;

      // Set initial state: hidden
      gsap.set(element, {
        opacity: 0,
        visibility: "hidden",
      });

      // Fade in at appearAt
      tl.to(
        element,
        {
          opacity: 1,
          visibility: "visible",
          duration: fadeDuration,
          ease: "power2.out",
        },
        config.appearAt
      );

      // Fade out at disappearAt
      tl.to(
        element,
        {
          opacity: 0,
          visibility: "hidden",
          duration: fadeDuration,
          ease: "power2.in",
        },
        config.disappearAt - fadeDuration
      );
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
        <h2 className="text-black text-[100px] leading-[100px] tracking-[-4px] hero-title">
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
