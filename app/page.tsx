"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import Video from "@/components/Video";

gsap.registerPlugin(useGSAP, MotionPathPlugin, ScrollTrigger);

export default function Home() {
  return (
    <section className="w-full max-w-screen overflow-x-hidden">
      <Hero />
      <Video />
    </section>
  );
}
