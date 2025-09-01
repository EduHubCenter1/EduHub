import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface Module {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    _count: {
        submodules: number;
        resources: number;
    };
}

interface ModulesGridProps {
    fieldSlug: string;
    semesterNumber: number;
    modules: Module[];
}

export function ModulesGrid({ fieldSlug, semesterNumber, modules }: ModulesGridProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold font-heading mb-2">Modules</h2>
                <p className="text-muted-foreground">Select a module to explore submodules and resources</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                    <Link key={module.id} href={`/fields/${fieldSlug}/semesters/${semesterNumber}/modules/${module.slug}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <BookOpen className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
                                    <Badge variant="secondary">{module._count.resources} resources</Badge>
                                </div>
                                <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors">
                                    {module.name}
                                </CardTitle>
                                <CardDescription>{module.description || "Explore resources for this module"}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
