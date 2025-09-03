import { Library, Users, Lightbulb } from "lucide-react";

export function AboutSection() {
  const features = [
    {
      icon: <Library className="h-8 w-8 text-primary" />,
      title: "Organized & Accessible",
      description:
        "A central space where students can easily find and share materials to support their studies.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Collaborative Community",
      description:
        "Built with the vision of fostering collaboration, knowledge sharing, and academic growth.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Empowering Students",
      description:
        "A community initiative designed to empower students and enhance the educational experience.",
    },
  ];

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-heading">
              What is <span className="text-primary">EduHub</span>?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              EduHub is a student-driven academic platform that aims to make learning resources more accessible and collaborative. By bringing materials into one place, we help students save time, stay organized, and focus on what truly matters—learning.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}