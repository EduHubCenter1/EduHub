"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { fields as Field, semester as Semester, module as Module, submodule as Submodule, resource as Resource } from "@prisma/client";

interface SemesterWithField extends Semester {
  field: Pick<Field, "name">
}

interface ModuleWithSemesterAndField extends Module {
  semester: Pick<Semester, "number"> & {
    field: Pick<Field, "name">
  }
}

interface SubmoduleWithModuleSemesterAndField extends Submodule {
  module: Pick<Module, "name"> & {
    semester: Pick<Semester, "number"> & {
      field: Pick<Field, "name">
    }
  }
}

interface ResourceWithSubmoduleModuleSemesterAndField extends Resource {
  module: ModuleWithSemesterAndField;
  submodule: SubmoduleWithModuleSemesterAndandField | null;
}

import { useAuth } from "@/hooks/useAuth";

interface GlobalDataContextType {
  fields: Field[];
  refetchFields: () => Promise<void>;
  semesters: SemesterWithField[];
  refetchSemesters: () => Promise<void>;
  modules: ModuleWithSemesterAndField[];
  refetchModules: () => Promise<void>;
  submodules: SubmoduleWithModuleSemesterAndField[];
  refetchSubmodules: () => Promise<void>;
  resources: ResourceWithSubmoduleModuleSemesterAndField[];
  refetchResources: () => Promise<void>;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

interface GlobalDataProviderProps {
  initialFields: Field[];
  initialSemesters: SemesterWithField[];
  initialModules: ModuleWithSemesterAndField[];
  initialSubmodules: SubmoduleWithModuleSemesterAndField[];
  initialResources: ResourceWithSubmoduleModuleSemesterAndField[];
  children: ReactNode;
}

export const GlobalDataProvider: React.FC<GlobalDataProviderProps> = ({
  initialFields,
  initialSemesters,
  initialModules,
  initialSubmodules,
  initialResources,
  children,
}) => {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [semesters, setSemesters] = useState<SemesterWithField[]>(initialSemesters);
  const [modules, setModules] = useState<ModuleWithSemesterAndField[]>(initialModules);
  const [submodules, setSubmodules] = useState<SubmoduleWithModuleSemesterAndField[]>(initialSubmodules);
  const [resources, setResources] = useState<ResourceWithSubmoduleModuleSemesterAndField[]>(initialResources);
  const { supabase } = useAuth();

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  };

  const refetchFields = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/fields", { cache: "no-store", headers });
      if (!res.ok) {
        throw new Error("Failed to refetch fields");
      }
      const data: Field[] = await res.json();
      setFields(data);
    } catch (error) {
      console.error("Error refetching fields:", error);
    }
  }, [supabase]);

  const refetchSemesters = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/semesters", { cache: "no-store", headers });
      if (!res.ok) {
        throw new Error("Failed to refetch semesters");
      }
      const data: SemesterWithField[] = await res.json();
      setSemesters(data);
    } catch (error) {
      console.error("Error refetching semesters:", error);
    }
  }, [supabase]);

  const refetchModules = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/modules", { cache: "no-store", headers });
      if (!res.ok) {
        throw new Error("Failed to refetch modules");
      }
      const data: ModuleWithSemesterAndField[] = await res.json();
      setModules(data);
    } catch (error) {
      console.error("Error refetching modules:", error);
    }
  }, [supabase]);

  const refetchSubmodules = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/submodules", { cache: "no-store", headers });
      if (!res.ok) {
        throw new Error("Failed to refetch submodules");
      }
      const data: SubmoduleWithModuleSemesterAndField[] = await res.json();
      setSubmodules(data);
    } catch (error) {
      console.error("Error refetching submodules:", error);
    }
  }, [supabase]);

  const refetchResources = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/resources", { cache: "no-store", headers });
      if (!res.ok) {
        throw new Error("Failed to refetch resources");
      }
      const data: ResourceWithSubmoduleModuleSemesterAndField[] = await res.json();
      setResources(data);
    } catch (error) {
      console.error("Error refetching resources:", error);
    }
  }, [supabase]);

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  useEffect(() => {
    setSemesters(initialSemesters);
  }, [initialSemesters]);

  useEffect(() => {
    setModules(initialModules);
  }, [initialModules]);

  useEffect(() => {
    setSubmodules(initialSubmodules);
  }, [initialSubmodules]);

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  return (
    <GlobalDataContext.Provider value={{
      fields,
      refetchFields,
      semesters,
      refetchSemesters,
      modules,
      refetchModules,
      submodules,
      refetchSubmodules,
      resources,
      refetchResources,
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
