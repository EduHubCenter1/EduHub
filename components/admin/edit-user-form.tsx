'use client'

import * as React from "react"
import { User } from "@supabase/supabase-js"
import { toast } from "sonner"
import { PlusCircle, XCircle } from "lucide-react" // Import icons

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

// Define types for fetched data
type AdminScopeWithField = {
  id: string; // AdminScope ID
  userId: string;
  semesterNumber: number;
  fieldId: string; // Add fieldId for selection
  field: {
    id: string; // Field ID
    name: string;
  };
};

type Field = {
  id: string;
  name: string;
};

type Semester = {
  id: string;
  number: number;
  fieldId: string;
};


interface EditUserFormProps {
  user: User;
  onSubmitSuccess: () => void;
}

const availableRoles = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "classAdmin", label: "Class Admin" },
  { value: "user", label: "User" }, // Assuming 'user' is a possible role
];

export function EditUserForm({ user, onSubmitSuccess }: EditUserFormProps) {
  const [email, setEmail] = React.useState(user.email || "")
  const [firstName, setFirstName] = React.useState(user.user_metadata?.firstName || "")
  const [lastName, setLastName] = React.useState(user.user_metadata?.lastName || "")
  const [role, setRole] = React.useState(user.user_metadata?.role || "user")
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // State for Admin Scopes management
  const [userAdminScopes, setUserAdminScopes] = React.useState<AdminScopeWithField[]>([]);
  const [allFields, setAllFields] = React.useState<Field[]>([]);
  const [allSemesters, setAllSemesters] = React.useState<Semester[]>([]);
  const [selectedField, setSelectedField] = React.useState<string>("");
  const [selectedSemester, setSelectedSemester] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch admin scopes for the current user
        const adminScopesRes = await fetch(`/api/admin-scopes/${user.id}`);
        if (adminScopesRes.ok) {
          const scopes = await adminScopesRes.json();
          setUserAdminScopes(scopes);
        } else {
          console.error("Failed to fetch user admin scopes");
        }

        // Fetch all fields
        const fieldsRes = await fetch("/api/fields");
        if (fieldsRes.ok) {
          const fields = await fieldsRes.json();
          setAllFields(fields);
        }

        // Fetch all semesters
        const semestersRes = await fetch("/api/semesters");
        if (semestersRes.ok) {
          const semesters = await semestersRes.json();
          setAllSemesters(semesters);
        }

      } catch (err) {
        console.error("Error fetching data for edit form:", err);
        setError("Failed to load data for form.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.id]); // Re-fetch if user ID changes

  const handleAddScope = () => {
    if (!selectedField || !selectedSemester) {
      toast.error("Please select both a field and a semester.");
      return;
    }

    const field = allFields.find(f => f.id === selectedField);
    const semester = allSemesters.find(s => s.id === selectedSemester);

    if (!field || !semester) {
      toast.error("Invalid field or semester selected.");
      return;
    }

    // Check for duplicates
    const isDuplicate = userAdminScopes.some(
      (scope) => scope.fieldId === field.id && scope.semesterNumber === semester.number
    );

    if (isDuplicate) {
      toast.error("This admin scope already exists for the user.");
      return;
    }

    const newScope: AdminScopeWithField = {
      id: `new-${Date.now()}`, // Temporary ID for new scopes
      userId: user.id,
      fieldId: field.id,
      semesterNumber: semester.number,
      field: { id: field.id, name: field.name },
    };

    setUserAdminScopes((prev) => [...prev, newScope]);
    setSelectedField("");
    setSelectedSemester("");
  };

  const handleRemoveScope = (scopeToRemoveId: string) => {
    setUserAdminScopes((prev) => prev.filter((scope) => scope.id !== scopeToRemoveId));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Sending adminScopes from frontend:", userAdminScopes.map(scope => ({
        id: scope.id.startsWith('new-') ? undefined : scope.id,
        fieldId: scope.fieldId,
        semesterNumber: scope.semesterNumber,
      })));
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          role,
          adminScopes: userAdminScopes.map(scope => ({
            id: scope.id.startsWith('new-') ? undefined : scope.id, // Don't send temp IDs
            fieldId: scope.fieldId,
            semesterNumber: scope.semesterNumber,
          })),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user.")
      }

      toast.success(result.message || "User updated successfully!")
      onSubmitSuccess() // Call the success callback
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      toast.error(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={setRole} value={role} disabled={isLoading}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {role === "classAdmin" && (
        <div className="grid gap-2 border p-4 rounded-md">
          <Label>Admin Scopes</Label>
          <div className="flex flex-col gap-2">
            {userAdminScopes.map((scope) => (
              <div key={scope.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span>{scope.field.name} (S{scope.semesterNumber})</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveScope(scope.id)}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Select onValueChange={setSelectedField} value={selectedField} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select Field" />
              </SelectTrigger>
              <SelectContent>
                {allFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedSemester} value={selectedSemester} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {allSemesters
                  .filter(s => s.fieldId === selectedField) // Filter semesters by selected field
                  .sort((a, b) => a.number - b.number) // Sort semesters by number
                  .map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      S{semester.number}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddScope} disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Scope
            </Button>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Updating User..." : "Update User"}
      </Button>
    </form>
  )
}