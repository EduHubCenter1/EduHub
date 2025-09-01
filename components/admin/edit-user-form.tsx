'use client'

import * as React from "react"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { getAdminScopesByUserId, updateUser } from "@/app/(admin)/dashboard/users/actions"

// Define types
type AdminScope = {
  fieldId: string
  semesterNumber: number
}

type Field = {
  id: string
  name: string
}

type Semester = {
  id: string
  number: number
  fieldId: string
}

interface EditUserFormProps {
  user: User
  onSubmitSuccess: () => void
}

const availableRoles = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "classAdmin", label: "Class Admin" },
]

export function EditUserForm({ user, onSubmitSuccess }: EditUserFormProps) {
  const router = useRouter()
  const [email, setEmail] = React.useState(user.email || "")
  const [firstName, setFirstName] = React.useState(user.user_metadata?.firstName || "")
  const [lastName, setLastName] = React.useState(user.user_metadata?.lastName || "")
  const [role, setRole] = React.useState(user.user_metadata?.role || "user")
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true) // Start with loading true

  // State for the single Admin Scope
  const [assignedScope, setAssignedScope] = React.useState<AdminScope | null>(null)
  const [allFields, setAllFields] = React.useState<Field[]>([])
  const [allSemesters, setAllSemesters] = React.useState<Semester[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [scopesResult, fieldsRes, semestersRes] = await Promise.all([
          getAdminScopesByUserId(user.id),
          fetch("/api/fields"),
          fetch("/api/semesters"),
        ])

        // Process server action result for scopes
        if (scopesResult.error) {
          toast.error(scopesResult.error)
        } else if (scopesResult.data && scopesResult.data.length > 0) {
          // Per new logic, a user can only have one scope. We take the first.
          setAssignedScope({
            fieldId: scopesResult.data[0].fieldId,
            semesterNumber: scopesResult.data[0].semesterNumber,
          })
        }

        // Process fields and semesters
        if (fieldsRes.ok) setAllFields(await fieldsRes.json())
        if (semestersRes.ok) setAllSemesters(await semestersRes.json())

      } catch (err: any) {
        console.error("Error fetching data for edit form:", err)
        setError(err.message || "Failed to load initial form data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user.id])

  const handleScopeChange = (part: 'fieldId' | 'semesterNumber', value: string | number) => {
    setAssignedScope(prev => ({
        fieldId: part === 'fieldId' ? String(value) : prev?.fieldId || '',
        semesterNumber: part === 'semesterNumber' ? Number(value) : prev?.semesterNumber || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (role === "classAdmin" && !assignedScope?.fieldId) {
      setError("A Class Admin must be assigned a Field and Semester.")
      setIsLoading(false)
      return
    }

    try {
      const result = await updateUser(user.id, {
        email: email || "",
        firstName,
        lastName,
        role,
        adminScope: role === "classAdmin" ? assignedScope : null,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(result.success || "User updated successfully!");
      onSubmitSuccess();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      toast.error(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  // Find the full semester object from the assigned scope number and field
  const selectedSemesterObject = allSemesters.find(
    s => s.fieldId === assignedScope?.fieldId && s.number === assignedScope?.semesterNumber
  );

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
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isLoading} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={setRole} value={role} disabled={isLoading}>
          <SelectTrigger id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
          <SelectContent>
            {availableRoles.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {role === "classAdmin" && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t mt-2">
            <div className="grid gap-2">
                <Label>Assigned Field</Label>
                <Select 
                    onValueChange={(fieldId) => handleScopeChange('fieldId', fieldId)}
                    value={assignedScope?.fieldId || ''}
                    disabled={isLoading}
                >
                    <SelectTrigger><SelectValue placeholder="Select Field" /></SelectTrigger>
                    <SelectContent>
                        {allFields.map((field) => <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>Assigned Semester</Label>
                <Select 
                    onValueChange={(semesterNumber) => handleScopeChange('semesterNumber', semesterNumber)}
                    value={String(assignedScope?.semesterNumber || '')}
                    disabled={isLoading || !assignedScope?.fieldId}
                >
                    <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                    <SelectContent>
                        {allSemesters
                            .filter((s) => s.fieldId === assignedScope?.fieldId)
                            .sort((a, b) => a.number - b.number)
                            .map((semester) => (
                                <SelectItem key={semester.id} value={String(semester.number)}>
                                    S{semester.number}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      )}

      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? "Updating User..." : "Update User"}
      </Button>
    </form>
  )
}
