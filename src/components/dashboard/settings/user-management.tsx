"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addOrganizationMember, removeMember, updateMemberRole } from "@/actions/settings"

export interface UserMember {
  id: string
  name: string | null
  email: string
  role: string
}

interface UserManagementProps {
  organizationId: string
  members: UserMember[]
  isAdmin: boolean
}

export function UserManagement({ organizationId, members, isAdmin }: UserManagementProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("DATA_ENTRY")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAddUser = async () => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      const res = await addOrganizationMember(organizationId, newEmail, newName, newRole)
      if (res.success) {
        setSuccess(res.message || "User added.")
        setTimeout(() => setIsOpen(false), 2000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to add user.")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateMemberRole(userId, organizationId, role)
    } catch (err: any) {
      alert(err.message || "Failed to update role.")
    }
  }

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user from the organization?")) return
    try {
      await removeMember(userId, organizationId)
    } catch (err: any) {
      alert(err.message || "Failed to remove user.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage who has access to this organization.
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* @ts-expect-error - asChild type issue */}
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Invite a new user to your organization. They will be assigned a default password of "password123".
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {error && <p className="text-sm text-destructive">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="jane@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newRole} onValueChange={(val) => setNewRole(val || "DATA_ENTRY")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Admin</SelectItem>
                      <SelectItem value="DATA_ENTRY">Data Entry (Read-Only/Basic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button disabled={loading || !newEmail || !newName} onClick={handleAddUser}>
                  {loading ? "Adding..." : "Add User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name || "N/A"}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  {isAdmin ? (
                    <Select defaultValue={member.role} onValueChange={(val) => handleRoleChange(member.id, val || "")}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">Admin</SelectItem>
                        <SelectItem value="DATA_ENTRY">Data Entry</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm text-muted-foreground">{member.role === 'SUPER_ADMIN' ? 'Admin' : 'Data Entry'}</span>
                  )}
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleRemove(member.id)}>
                      Remove
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
