"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import { useGlobalData } from '@/context/GlobalDataContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

const availableRoles = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "classAdmin", label: "Class Admin" },
]

export function CreateUserForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { register } = useAuthContext()
  const { fields, semesters } = useGlobalData()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('')
  
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [selectedSemesterNumber, setSelectedSemesterNumber] = useState<number | null>(null)
  const [filteredSemesters, setFilteredSemesters] = useState<typeof semesters>([])

  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedFieldId) {
      const fieldSemesters = semesters.filter(s => s.fieldId === selectedFieldId)
      setFilteredSemesters(fieldSemesters)
      setSelectedSemesterNumber(null) // Reset semester selection when field changes
    } else {
      setFilteredSemesters([])
    }
  }, [selectedFieldId, semesters])

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    if (role === 'classAdmin' && (!selectedFieldId || !selectedSemesterNumber)) {
      setError('Please select a field and semester for the Class Admin.')
      setIsLoading(false)
      return
    }

    try {
      const response = await register(email, password, {
        firstName,
        lastName,
        role,
        fieldId: selectedFieldId,
        semesterNumber: selectedSemesterNumber,
      })

      if (!response.success) {
        setError(response.error || 'An unexpected error occurred.')
      } else {
        setMessage(response.message || 'User created successfully!')
        // setTimeout(() => {
        //   router.push('/dashboard')
        // }, 2000)
      }
    } catch (err) {
      setError('Failed to connect to the server.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn(className)} {...props}>
      <Card className="w-full bg-background max-w-lg border-0 shadow-none p-0">
        <CardContent>
          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  required
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
                  required
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={setRole} defaultValue={role} disabled={isLoading}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {role === 'classAdmin' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="field">Field</Label>
                  <Select
                    onValueChange={(fieldId) => setSelectedFieldId(fieldId)}
                    disabled={isLoading || fields.length === 0}
                  >
                    <SelectTrigger id="field">
                      <SelectValue placeholder="Select a field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFieldId && (
                  <div className="grid gap-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      onValueChange={(value) => setSelectedSemesterNumber(Number(value))}
                      disabled={isLoading || filteredSemesters.length === 0}
                    >
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select a semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSemesters.map((semester) => (
                          <SelectItem key={semester.id} value={String(semester.number)}>
                            Semester {semester.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating User...' : 'Create User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
