"use client";

import Link from "next/link";
import { Library } from "lucide-react";

interface Field {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    semesters: number;
  };
}

interface InspiredByGiProps {
  fields: Field[];
}

const colors = [
  "bg-[#f9b234]",
  "bg-[#3ecd5e]",
  "bg-[#e44002]",
  "bg-[#952aff]",
  "bg-[#cd3e94]",
  "bg-[#4c49ea]",
];

export function InspiredByGi({ fields }: InspiredByGiProps) {
  return (
    <div className="w-full bg-background py-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Fields of Study</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Browse through our diverse range of academic fields. Click on a field to explore its semesters, modules, and resources.
          </p>
        </div>
        <div className="flex flex-wrap -m-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 w-full sm:w-1/2 lg:w-1/3">
              <Link href={`/fields/${field.slug}`} className="block group h-full">
                <div className="block bg-card rounded-3xl overflow-hidden p-8 relative h-full">
                  <div className={`absolute h-32 w-32 ${colors[index % colors.length]} rounded-full -top-20 -right-20 z-0 transition-transform duration-500 ease-in-out transform group-hover:scale-[10]`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Library className="w-8 h-8 text-foreground group-hover:text-white transition-colors duration-300" />
                      <div className="text-lg text-foreground group-hover:text-white transition-colors duration-300">
                        Semesters:
                        <span className="font-bold text-primary group-hover:text-white transition-colors duration-300 ml-2">
                          {field._count.semesters}
                        </span>
                      </div>
                    </div>
                    <div className="min-h-[87px] mb-6 font-bold text-3xl text-foreground group-hover:text-white transition-colors duration-300">
                      {field.name}
                    </div>
                    <p className="text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                      {field.description || "No description available."}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
