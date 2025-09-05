import { Suspense } from "react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { FieldsGrid } from "@/components/public/fields-grid"
import { AboutSection } from "@/components/public/about-section"
import { ContactSection } from "@/app/contact/Contactsection"
import { Footer } from "@/components/public/footer"
import { Button } from "@/components/ui/button"
import { ModernHero } from "@/components/public/modern-hero"

async function getFields() {
  try {
    return await prisma.fields.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            semesters: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Failed to fetch fields during build:", error);
    return [];
  }
}

export default async function HomePage() {
  const fields = await getFields()

  return (
    <div className="min-h-screen bg-background">
      <main className="flex flex-col">
        
        <ModernHero />

        {/* 2. Fields Preview Section */}
        <section className="py-10 md:py-20 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Explore Our Fields</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse through the different fields of study available on EduHub.
              </p>
            </div>
            <div className="relative">
              <div className="max-h-[600px] overflow-hidden">
                <FieldsGrid fields={fields.slice(0, 6)} />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-72 bg-gradient-to-t from-background via-background/80 to-transparent" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <Button asChild size="lg" variant="default">
                  <Link href="/fields">Explore All Fields</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. About Section */}
        <section className="py-10 md:py-20 bg-secondary/5">
          <AboutSection />
        </section>

        {/* 4. Contact Section */}
        <section className="py-10 md:py-20 bg-background">
          <ContactSection />
        </section>

        {/* 5. Footer */}
        <Footer />
      </main>
    </div>
  )
}