import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface Field {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    semesters: number;
  };
}

interface FieldsListProps {
  fields: Field[];
}

export function FieldsList({ fields }: FieldsListProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">All Fields of Study</h1>
        <p className="text-xl text-muted-foreground mt-2">Browse through all the available academic fields.</p>
      </div>
      <div className="border-t">
        {fields.map((field) => (
          <Link key={field.id} href={`/fields/${field.slug}`} className="block p-6 border-b hover:bg-muted/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">{field.name}</h2>
                  {field.description && (
                    <p className="text-muted-foreground mt-1 max-w-prose">{field.description}</p>
                  )}
                  <p className="text-sm text-primary font-medium mt-2">{field._count.semesters} Semesters</p>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
