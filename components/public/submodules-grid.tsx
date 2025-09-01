import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";

interface Submodule {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    _count: {
        resources: number;
    };
}

interface SubmodulesGridProps {
    fieldSlug: string;
    semesterNumber: number;
    moduleSlug: string;
    submodules: Submodule[];
}

export function SubmodulesGrid({ fieldSlug, semesterNumber, moduleSlug, submodules }: SubmodulesGridProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold font-heading mb-2">Submodules</h2>
                <p className="text-muted-foreground">Select a submodule to explore its resources</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {submodules.map((submodule) => (
                    <Link key={submodule.id} href={`/fields/${fieldSlug}/semesters/${semesterNumber}/modules/${moduleSlug}/submodules/${submodule.slug}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <Folder className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
                                    <Badge variant="secondary">{submodule._count.resources} resources</Badge>
                                </div>
                                <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors">
                                    {submodule.name}
                                </CardTitle>
                                <CardDescription>{submodule.description || "Explore resources for this submodule"}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
