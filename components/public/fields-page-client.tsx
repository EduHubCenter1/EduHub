"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FieldsGrid } from "./fields-grid";
import { Search } from "lucide-react";

interface Field {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    semesters: number;
  };
}

interface FieldsPageClientProps {
  fields: Field[];
}

export function FieldsPageClient({ fields }: FieldsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="mb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">All Fields of Study</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Find your field and start learning.
          </p>
        </div>
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
      <FieldsGrid fields={filteredFields} />
    </div>
  );
}
