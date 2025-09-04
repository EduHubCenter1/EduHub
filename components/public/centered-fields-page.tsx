"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

interface CenteredFieldsPageProps {
  fields: Field[];
}

const cardColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-cyan-500",
];

export function CenteredFieldsPage({ fields }: CenteredFieldsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div></div>
      <div className="w-full max-w-4xl px-4 py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tighter">Explore Our Fields</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Dive into our comprehensive collection of academic fields. Use the search below to find your area of interest.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for a field..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {filteredFields.map((field, index) => (
            <Link key={field.id} href={`/fields/${field.slug}`} className="block group">
              <Card 
                className="h-full overflow-hidden rounded-lg shadow-md relative transition-shadow duration-300"
              >
                <div className={`absolute inset-0 ${cardColors[index % cardColors.length]} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <GiOpenBook className="w-6 h-6 text-primary" />
                      <Badge variant="secondary">{field._count.semesters} Semesters</Badge>
                    </div>
                    <CardTitle className="text-xl font-bold pt-4 text-card-foreground group-hover:text-white transition-colors duration-300">
                      {field.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-card-foreground group-hover:text-white/90 transition-colors duration-300">
                      {field.description || "No description available."}
                    </CardDescription>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {filteredFields.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No fields found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
