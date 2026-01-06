"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeroTitle from "./HeroTitle";
import { toRoman } from "@/utils";

const menuItems = [
  "Sidekick",
  "Agentic",
  "Online",
  "Retail",
  "Marketing",
  "Checkout",
  "Operations",
  "Shop app",
  "B2B",
  "Finance",
  "Shipping",
  "Developer",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "50%", // Animation spans 2 viewport heights of scroll
        scrub: 0.5, // Smooth scrubbing, 1 second lag
        pin: true, // Pin the section while scrolling
      },
    });

    tl.to(containerRef.current, { borderWidth: 0, duration: 0.2 })
      .to(".hero-subtitle", { display: "none" }, ">")
      .to(".hero-title", { opacity: 0 }, ">")
      .to(
        containerRef.current,
        {
          bottom: 0,
          left: 0,
          x: "70%",
          y: "-10%",
          width: "240px",
        },
        ">"
      );
  });

  return (
    <div ref={sectionRef} className="h-screen w-screen bg-black relative">
      <div
        ref={containerRef}
        className="absolute border-2 border-white text-white p-4 bottom-[50%] left-[50%] translate-x-[-50%] translate-y-[50%] w-[340px] h-116 flex flex-col justify-between"
      >
        <HeroTitle />
        <div>
          <p className="hero-subtitle text-white text-[17px] leading-[16.49px] tracking-[-0.68px]">
            A new world of commerce. <br />
            150+ product updates.
          </p>
          <ul className="w-full mt-5">
            {menuItems.map((label, index) => (
              <li
                key={label}
                className="flex justify-between items-center
              text-white font-bold text-[18px] leading-[17.1px] tracking-[-0.36px] antialiased"
              >
                {label}
                <span className="text-white font-bold text-[.6875rem] leading-[17.1px] tracking-[-0.36px] antialiased opacity-70">
                  {toRoman(index + 1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
