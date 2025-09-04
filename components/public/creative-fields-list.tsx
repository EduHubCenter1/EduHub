import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GiOpenBook } from "react-icons/gi";

interface Field {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    semesters: number;
  };
}

interface CreativeFieldsListProps {
  fields: Field[];
}

export function CreativeFieldsList({ fields }: CreativeFieldsListProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <aside className="lg:col-span-1 lg:sticky top-24 h-full">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">All Fields of Study</h1>
            <p className="text-xl text-muted-foreground">Browse through all the available academic fields. Each field contains a collection of semesters, modules, and resources to help you with your studies.</p>
          </div>
        </aside>

        <main className="lg:col-span-2">
          <div className="space-y-6">
            {fields.map((field) => (
              <Link key={field.id} href={`/fields/${field.slug}`} className="block">
                <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group border-l-4 hover:border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <GiOpenBook className="w-8 h-8 text-primary/80 group-hover:text-primary transition-colors" />
                      <Badge variant="default">{field._count.semesters} semesters</Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold pt-4 group-hover:text-primary transition-colors">
                      {field.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {field.description && <CardDescription>{field.description}</CardDescription>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
