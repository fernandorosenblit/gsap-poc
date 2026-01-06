"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const aiSpanRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!titleRef.current) return;

      const hoverEnter = () => {
        const tl = gsap.timeline();

        // Hide the title-hide elements (animate width and opacity)
        tl.to(".title-hide", {
          opacity: 0,
          width: 0,
          marginRight: 0,
          marginLeft: 0,
          duration: 0.3,
          ease: "power2.inOut",
        })
          // Animate the "ai" span to left align by removing any spacing
          .to(
            aiSpanRef.current,
            {
              x: 0,
              marginLeft: 0,
              duration: 0.3,
              ease: "power2.inOut",
            },
            "<" // Start at the same time as the hide animation
          );
      };

      const hoverLeave = () => {
        const tl = gsap.timeline();

        // First: Move the "ai" span back to its original position
        tl.to(aiSpanRef.current, {
          x: 0,
          marginLeft: "auto",
          duration: 0.3,
          ease: "power2.inOut",
        })
          // Then: Show the title-hide elements again
          .to(
            ".title-hide",
            {
              opacity: 1,
              width: "auto",
              marginRight: "auto",
              marginLeft: "auto",
              duration: 0.3,
              ease: "power2.inOut",
            },
            ">" // Start after the previous animation completes
          );
      };

      const element = titleRef.current;
      element.addEventListener("mouseenter", hoverEnter);
      element.addEventListener("mouseleave", hoverLeave);

      // Cleanup function
      return () => {
        element.removeEventListener("mouseenter", hoverEnter);
        element.removeEventListener("mouseleave", hoverLeave);
      };
    },
    { scope: titleRef }
  );

  return (
    <h1
      ref={titleRef}
      className="hero-title text-white text-[32px] font-bold leading-[30.72px] tracking-[-1.28px] cursor-pointer"
    >
      <span className="block">The</span>
      <span className="block">
        <span className="inline-block title-hide">Ren</span>
        <span ref={aiSpanRef} className="text-red-500 inline-block">
          ai
        </span>
        <span className="inline-block title-hide">ssance</span>
      </span>
      <span className="block">Edition</span>
    </h1>
  );
}
