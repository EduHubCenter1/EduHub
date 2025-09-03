"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function ModernHero() {
  return (
    <section className="w-full h-screen flex items-center bg-background">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start text-left animate-[fade-in-up_1s_ease-out]">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            Welcome to ENSIAS Hub
          </h1>
          <p className="mt-6 max-w-xl text-lg md:text-xl text-muted-foreground">
            Your centralized platform for all academic resources and materials at ENSIAS.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/fields">Start Exploring</Link>
          </Button>
        </div>

        {/* Right Side: Image */}
        <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl animate-[fade-in-up_1s_ease-out_0.2s_backwards]">
          <Image
            src="/placeholder.jpg"
            alt="Students collaborating in a modern study space"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out hover:scale-105"
          />
           <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl" />
           <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full filter blur-2xl" />
        </div>
      </div>
    </section>
  );
}
