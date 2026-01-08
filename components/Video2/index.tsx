"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Video2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Setup animations for text elements
  // Add your show/hide animations here at specific times (in seconds)
  const setupAnimations = useCallback(
    (timeline: gsap.core.Timeline, videoDuration: number) => {
      timeline
        .to(
          ".hero-title",
          {
            opacity: 1,
            visibility: "visible",
            duration: 0.2,
          },
          0.65
        )
        .to(
          ".hero-title",
          {
            opacity: 0,
            visibility: "hidden",
            duration: 0.2,
          },
          1.4
        )
        .to(
          ".hero-tyres",
          {
            opacity: 1,
            visibility: "visible",
            duration: 0.2,
          },
          1.5
        )
        .to(
          ".hero-tyres",
          {
            opacity: 0,
            visibility: "hidden",
            duration: 0.2,
          },
          2.5
        )
        .to(
          ".hero-chasis",
          {
            opacity: 1,
            visibility: "visible",
            duration: 0.2,
          },
          2.6
        )
        .to(
          ".hero-chasis",
          {
            opacity: 0,
            visibility: "hidden",
            duration: 0.2,
          },
          4
        )
        .to(
          ".hero-engine",
          {
            opacity: 1,
            visibility: "visible",
            duration: 0.2,
          },
          4.1
        )
        .to(
          ".hero-engine",
          {
            opacity: 0,
            visibility: "hidden",
            duration: 0.2,
          },
          6
        )
        .to(
          ".hero-speed",
          {
            opacity: 1,
            visibility: "visible",
            duration: 0.2,
          },
          6.5
        )
        .to(
          ".hero-speed",
          {
            opacity: 0,
            visibility: "hidden",
            duration: 0.2,
          },
          7.5
        );

      // Add your animations here:
      // Use 'timeline' to add animations and 'videoDuration' to know the total video length
      void timeline;
      void videoDuration;
    },
    []
  );

  const setupScrollTrigger = useCallback(() => {
    if (!videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const duration = video.duration;

    if (!duration) return;

    console.log(duration);

    // Calculate scroll distance: 100vh per second of video
    const scrollDistance = duration * window.innerHeight;

    // Create animation timeline with the same duration as video
    // This timeline will be synced with ScrollTrigger progress
    const animationTimeline = gsap.timeline({
      paused: true, // We'll control it manually based on scroll progress
      duration: duration, // Same duration as video
    });

    // Store timeline reference for adding animations later
    animationTimelineRef.current = animationTimeline;

    // Setup animations - add your show/hide animations here
    setupAnimations(animationTimeline, duration);

    // Create ScrollTrigger that pins until video ends
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${scrollDistance}`, // Pin for scroll distance based on video duration
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Update video currentTime based on scroll progress
        const progress = self.progress;
        video.currentTime = progress * duration;

        // Sync animation timeline with scroll progress
        // Progress (0-1) * duration = time in seconds
        animationTimeline.progress(progress);
      },
    });

    return () => {
      st.kill();
      animationTimeline.kill();
    };
  }, [setupAnimations]);

  useGSAP(
    () => {
      if (!videoRef.current || !containerRef.current) return;

      const video = videoRef.current;

      // Check if video is already loaded
      if (video.readyState >= 2 && video.duration) {
        return setupScrollTrigger();
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} id="video" className="w-screen h-screen relative">
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
        <h2 className="text-black text-[100px] leading-[100px] tracking-[-4px] mb-10 initial-hidden hero-title">
          Carrera
        </h2>
      </div>
      <div className="absolute top-2/4 -translate-y-2/2 left-6/8 flex flex-col gap-4 initial-hidden hero-tyres">
        <p className="text-white text-[67px] uppercase leading-[82px] tracking-[-0.8px] mb-2 text-left ">
          Tyres
        </p>
        <ul className="text-white text-[16px] list-disc list-inside uppercase leading-[24px] tracking-[-0.64px]">
          <li>High-performance summer tires for sporty driving</li>
          <li>Exceptional grip and stability in dry and wet conditions</li>
          <li>Precision handling and responsive cornering</li>
          <li>Optimized tread for enhanced braking performance</li>
          <li>Low rolling resistance for improved efficiency</li>
        </ul>
      </div>
      <div className="absolute bottom-20 left-10 flex flex-col gap-4 initial-hidden hero-chasis max-w-[500px]">
        <p className="text-white text-[67px] uppercase leading-[82px] tracking-[-0.8px] mb-2 text-left ">
          Chasis
        </p>
        <p className="text-white text-[16px] list-disc list-inside uppercase leading-[24px] tracking-[-0.64px]">
          A Porsche Carrera chassis is a sophisticated, rear-*engine/rear-drive
          platform (or AWD) featuring advanced materials and adaptive systems
          like PASM for precise handling, combining motorsport tech with
          everyday usability through lightweight construction, improved
          suspension geometry (like the McPherson struts up front and multi-link
          rear), powerful brakes (often PCCB on higher trims), and electronic
          aids, delivering exceptional grip, feedback, and balance, with chassis
          codes (like 992) denoting generations and specific tuning
        </p>
      </div>
      <div className="absolute top-12 right-10 flex flex-col gap-4 initial-hidden hero-engine max-w-[500px]">
        <p className="text-white text-[67px] uppercase leading-[82px] tracking-[-0.8px] mb-2 text-left ">
          Engine
        </p>
        <p className="text-white text-[16px] list-disc list-inside uppercase leading-[24px] tracking-[-0.64px]">
          The Porsche Carrera engine is a rear-mounted, horizontally opposed
          (Boxer) six-cylinder, typically 3.0-liter, featuring twin
          turbochargers for significant power (around 388 hp in base models,
          more in S/GTS) and torque, paired with an 8-speed PDK (Porsche
          Doppelkupplung) transmission for rapid shifts, known for its
          distinctive sound, compact design, and quick power delivery from low
          RPMs, optimizing performance and handling through a low center of
          gravity. Recent models (992.2 generation) incorporate elements from
          higher-end models, like the Turbo's charge-air cooling, for enhanced
          efficiency and power.
        </p>
      </div>
      <div className="absolute top-7/8 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col hero-speed justify-center items-center initial-hidden">
        <p className="text-white text-[67px] uppercase leading-[82px] tracking-[-0.8px] mb-2 text-center w-full">
          Speed
        </p>
        <div className="text-white text-[20px] inline-flex flex-row justify-center gap-8 uppercase leading-[24px] tracking-[-0.64px] w-full text-center">
          <p>
            Power: <b>~388 hp.</b>
          </p>
          <p>
            Torque: <b>~331 lb-ft.</b>
          </p>
          <p>
            0-60 mph: <b>~3.9s (3.6s with Sport Chrono).</b>
          </p>
          <p>
            Top Speed: <b>~183 mph.</b>
          </p>
        </div>
      </div>
    </div>
  );
}
