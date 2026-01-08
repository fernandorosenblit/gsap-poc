"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Keyframe animation configuration
// Define animations as percentages (0-100) of video duration
type KeyframeAnimation = {
  selector: string;
  keyframes: Array<{
    at: number; // Percentage of video (0-100)
    props: gsap.TweenVars;
  }>;
};

const KEYFRAME_ANIMATIONS: KeyframeAnimation[] = [
  {
    selector: ".hero-title",
    keyframes: [
      {
        at: 8.5, // 8.5% of video
        props: {
          opacity: 1,
          visibility: "visible",
          duration: 0.2,
        },
      },
      {
        at: 18.5, // 18.5% of video
        props: {
          opacity: 0,
          visibility: "hidden",
          duration: 0.2,
        },
      },
    ],
  },
  {
    selector: ".hero-tyres",
    keyframes: [
      {
        at: 20, // 20% of video
        props: {
          opacity: 1,
          visibility: "visible",
          duration: 0.2,
        },
      },
      {
        at: 33, // 33% of video
        props: {
          opacity: 0,
          visibility: "hidden",
          duration: 0.2,
        },
      },
    ],
  },
  {
    selector: ".hero-chasis",
    keyframes: [
      {
        at: 34, // 34% of video
        props: {
          opacity: 1,
          visibility: "visible",
          duration: 0.2,
        },
      },
      {
        at: 53, // 53% of video
        props: {
          opacity: 0,
          visibility: "hidden",
          duration: 0.2,
        },
      },
    ],
  },
  {
    selector: ".hero-engine",
    keyframes: [
      {
        at: 54, // 54% of video
        props: {
          opacity: 1,
          visibility: "visible",
          duration: 0.2,
        },
      },
      {
        at: 79, // 79% of video
        props: {
          opacity: 0,
          visibility: "hidden",
          duration: 0.2,
        },
      },
    ],
  },
  {
    selector: ".hero-speed",
    keyframes: [
      {
        at: 86, // 86% of video
        props: {
          opacity: 1,
          visibility: "visible",
          duration: 0.2,
        },
      },
      {
        at: 99, // 99% of video
        props: {
          opacity: 0,
          visibility: "hidden",
          duration: 0.2,
        },
      },
    ],
  },
  {
    selector: ".hero-video",
    keyframes: [
      {
        at: 92, // 95% of video
        props: {
          maskSize: "5000%",
        },
      },
      {
        at: 95, // 100% of video
        props: {
          maskSize: "20%",
        },
      },
    ],
  },
];

export default function Video2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Setup animations using keyframes (percentages)
  const setupAnimations = useCallback(
    (timeline: gsap.core.Timeline, videoDuration: number) => {
      KEYFRAME_ANIMATIONS.forEach((animation) => {
        animation.keyframes.forEach((keyframe) => {
          // Convert percentage to timeline position (in seconds)
          const position = (keyframe.at / 100) * videoDuration;
          timeline.to(animation.selector, keyframe.props, position);
        });
      });
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
    // Add 20% of viewport height after video ends
    const extraScrollDistance = 1.2 * window.innerHeight;
    const totalScrollDistance = scrollDistance + extraScrollDistance;

    // Calculate the progress point where video reaches 100%
    // This is the ratio of video scroll to total scroll
    const videoEndProgress = scrollDistance / totalScrollDistance;

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

    // Create ScrollTrigger that pins until video ends + 20% extra
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${totalScrollDistance}`, // Pin for video duration + 20% extra
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Calculate progress: 0-1 over total scroll distance
        const totalProgress = self.progress;

        // Calculate video progress: 0-1 based on when video should end
        // When totalProgress reaches videoEndProgress, videoProgress should be 1
        const videoProgress = Math.min(totalProgress / videoEndProgress, 1);

        // Update video currentTime based on video progress (only up to 100%)
        video.currentTime = videoProgress * duration;

        // Sync animation timeline with video progress (clamped to 1)
        animationTimeline.progress(videoProgress);
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
        className="w-full h-full object-cover hero-video"
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
          higher-end models, like the Turbo&apos;s charge-air cooling, for
          enhanced efficiency and power.
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
