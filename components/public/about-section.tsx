import { Library, Users, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
<div
                    className="max-w-xl mx-auto text-center mb-16"
                >
                    <Badge className="mb-4" variant="default">Who We Are</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About US</h2>
                    <p className="text-xl text-muted-foreground">
Learn more about our mission to connect learners, educators, and resources in one place.                    </p>
                </div>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center mx-auto lg:text-left">
          <h2 className="text-4xl py-4 md:text-5xl text-center font-bold tracking-tight text-foreground sm:text-4xl font-heading">
              What is <span className="text-primary">EduHub</span>?</h2>
          <p className="text-xl text-muted-foreground mb-4">
EduHub is a student-driven platform designed to open the doors of knowledge. By uniting students, educators, and a rich collection of academic resources, we create more than just a study space . <br />We build a culture of shared learning. Accessible, collaborative, and ever-growing, EduHub is where education meets community, and every learner finds the support to thrive.            </p>
            
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