'use client'

import * as React from "react"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PlusCircle, XCircle } from "lucide-react"

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
  { value: "user", label: "User" },
]

export function EditUserForm({ user, onSubmitSuccess }: EditUserFormProps) {
  const router = useRouter()
  const [email, setEmail] = React.useState(user.email || "")
  const [firstName, setFirstName] = React.useState(user.user_metadata?.firstName || "")
  const [lastName, setLastName] = React.useState(user.user_metadata?.lastName || "")
  const [role, setRole] = React.useState(user.user_metadata?.role || "user")
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // State for Admin Scopes management
  const [adminScopes, setAdminScopes] = React.useState<AdminScope[]>([])
  const [allFields, setAllFields] = React.useState<Field[]>([])
  const [allSemesters, setAllSemesters] = React.useState<Semester[]>([])
  const [selectedField, setSelectedField] = React.useState<string>("")
  const [selectedSemester, setSelectedSemester] = React.useState<string>("")

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Run all requests in parallel
        const [scopesResult, fieldsRes, semestersRes] = await Promise.all([
          getAdminScopesByUserId(user.id),
          fetch("/api/fields"),
          fetch("/api/semesters"),
        ])

        // Process server action result
        if (scopesResult.error) {
          toast.error(scopesResult.error)
        } else if (scopesResult.data) {
          setAdminScopes(
            scopesResult.data.map((s: any) => ({
              fieldId: s.fieldId,
              semesterNumber: s.semesterNumber,
            }))
          )
        }

        // Process fields fetch result
        if (fieldsRes.ok) {
          const fields = await fieldsRes.json()
          setAllFields(fields)
        } else {
          toast.error("Failed to fetch fields.")
        }

        // Process semesters fetch result
        if (semestersRes.ok) {
          const semesters = await semestersRes.json()
          setAllSemesters(semesters)
        } else {
          toast.error("Failed to fetch semesters.")
        }
      } catch (err: any) {
        console.error("Error fetching data for edit form:", err)
        setError(err.message || "Failed to load initial form data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user.id])

  const handleAddScope = () => {
    if (!selectedField || !selectedSemester) {
      toast.error("Please select both a field and a semester.")
      return
    }

    const semester = allSemesters.find((s) => s.id === selectedSemester)
    if (!semester) {
      toast.error("Invalid semester selected.")
      return
    }

    const newScope: AdminScope = {
      fieldId: selectedField,
      semesterNumber: semester.number,
    }

    const isDuplicate = adminScopes.some(
      (scope) =>
        scope.fieldId === newScope.fieldId &&
        scope.semesterNumber === newScope.semesterNumber
    )

    if (isDuplicate) {
      toast.error("This admin scope already exists.")
      return
    }

    setAdminScopes((prev) => [...prev, newScope])
    setSelectedField("")
    setSelectedSemester("")
  }

  const handleRemoveScope = (scopeToRemove: AdminScope) => {
    setAdminScopes((prev) =>
      prev.filter(
        (scope) =>
          !(
            scope.fieldId === scopeToRemove.fieldId &&
            scope.semesterNumber === scopeToRemove.semesterNumber
          )
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (role === "classAdmin" && adminScopes.length === 0) {
      setError("A Class Admin must have at least one administrative scope.")
      setIsLoading(false)
      return
    }

    try {
      const result = await updateUser(user.id, {
        email: email || "",
        firstName,
        lastName,
        role,
        adminScopes: role === "classAdmin" ? adminScopes : [],
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(result.success || "User updated successfully!");
      onSubmitSuccess(); // Call the callback to close dialog and refresh
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
        <div className="grid gap-3 border p-4 rounded-md">
          <Label>Admin Scopes</Label>
          <p className="text-sm text-muted-foreground">
            Assign the fields and semesters this Class Admin will manage.
          </p>
          <div className="flex flex-col gap-2">
            {adminScopes.map((scope, index) => {
              const fieldName =
                allFields.find((f) => f.id === scope.fieldId)?.name ||
                "Unknown Field"
              return (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span>
                    {fieldName} (S{scope.semesterNumber})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveScope(scope)}
                    disabled={isLoading}
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            <Select
              onValueChange={setSelectedField}
              value={selectedField}
              disabled={isLoading}
            >
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
            <Select
              onValueChange={setSelectedSemester}
              value={selectedSemester}
              disabled={isLoading || !selectedField}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {allSemesters
                  .filter((s) => s.fieldId === selectedField)
                  .sort((a, b) => a.number - b.number)
                  .map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      S{semester.number}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddScope}
              disabled={isLoading || !selectedField || !selectedSemester}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Scope
            </Button>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? "Updating User..." : "Update User"}
      </Button>
    </form>
  )
}