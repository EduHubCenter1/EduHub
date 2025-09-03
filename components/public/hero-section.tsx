import Image from "next/image";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/newlogo.png" alt="EduHub Logo" width={300} height={300} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
        </h1>
      </div>
    </section>
  )
}
