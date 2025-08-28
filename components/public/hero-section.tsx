export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
          Welcome to <span className="text-primary">EduHub</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your student-run academic hub for organizing and sharing educational resources. Browse through courses, find
          study materials, and grab the files you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="text-sm text-muted-foreground">Explore resources by field and semester below</div>
        </div>
      </div>
    </section>
  )
}
