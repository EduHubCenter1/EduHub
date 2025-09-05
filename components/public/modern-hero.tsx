"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRef, useEffect } from 'react';

export function ModernHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Play when 50% of the video is visible
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <section className="w-full h-screen flex items-center bg-background">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start text-left animate-fade-in-up px-8 sm:px-12 md:px-0 md:pl-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            Welcome 
          </h1>
          <p className="mt-6 max-w-xl text-lg md:text-xl text-muted-foreground"> The hub where students discover, share, connect, collaborate, and access all the resources they need to succeed and achieve. </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/fields">Start Exploring</Link>
          </Button>
        </div>

        {/* Right Side: Image */}
        <div className="relative w-[80%] md:w-full h-[50vh] mx-auto md:h-[60vh] rounded-xl shadow-2xl animate-fade-in-up fill-mode-backwards [animation-delay:0.2s] overflow-hidden">
          <video
            src="/eduhubanimation.mp4"
            muted
            playsInline
            className="w-full h-full object-cover"
            ref={videoRef}
          />
           <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl" />
           <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full filter blur-2xl" />
        </div>
      </div>
    </section>
  );
}
