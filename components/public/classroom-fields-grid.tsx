import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Field {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    semesters: number;
  };
}

interface ClassroomFieldsGridProps {
  fields: Field[];
}

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-green-500 to-teal-600",
  "from-purple-500 to-pink-600",
  "from-yellow-500 to-orange-600",
  "from-red-500 to-rose-600",
  "from-cyan-500 to-sky-600",
];

export function ClassroomFieldsGrid({ fields }: ClassroomFieldsGridProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Fields of Study</h1>
        <p className="text-xl text-muted-foreground mt-2">Select a field to begin exploring.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field, index) => (
          <Link key={field.id} href={`/fields/${field.slug}`} className="block">
            <Card className="h-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <CardHeader className={`bg-gradient-to-br ${gradients[index % gradients.length]} p-6 text-white relative h-32 flex flex-col justify-between`}>
                <CardTitle className="text-2xl font-bold z-10 break-words">
                  {field.name}
                </CardTitle>
                <div className="absolute top-2 right-2 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {field._count.semesters} Semesters
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardDescription className="h-24 overflow-hidden">
                  {field.description || "No description available for this field."}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
