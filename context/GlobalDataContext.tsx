"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { fields as Field } from "@prisma/client";

interface GlobalDataContextType {
  fields: Field[];
  refetchFields: () => Promise<void>;
  // Add more data types and their refetch functions here as needed
  // semesters: Semester[];
  // refetchSemesters: () => Promise<void>;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

interface GlobalDataProviderProps {
  initialFields: Field[];
  // Add more initial data props here as needed
  children: ReactNode;
}

export const GlobalDataProvider: React.FC<GlobalDataProviderProps> = ({
  initialFields,
  children,
}) => {
  const [fields, setFields] = useState<Field[]>(initialFields);
  // Add more state for other data types here

  const refetchFields = useCallback(async () => {
    try {
      const res = await fetch("/api/fields", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to refetch fields");
      }
      const data: Field[] = await res.json();
      setFields(data);
    } catch (error) {
      console.error("Error refetching fields:", error);
      // Optionally, show a toast or error message to the user
    }
  }, []);

  // Add more refetch functions for other data types here

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  return (
    <GlobalDataContext.Provider value={{
      fields,
      refetchFields,
      // Add more data and refetch functions here
    }}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error("useGlobalData must be used within a GlobalDataProvider");
  }
  return context;
};
