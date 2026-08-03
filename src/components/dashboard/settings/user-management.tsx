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
import { Shield, UserPlus } from "lucide-react"

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
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState("REVENUE_OFFICER")
  const [customRoleName, setCustomRoleName] = useState("")
  
  // Granular Privileges
  const [canAddRevenue, setCanAddRevenue] = useState(true)
  const [canEditRevenue, setCanEditRevenue] = useState(true)
  const [canApproveTransactions, setCanApproveTransactions] = useState(false)
  const [canViewReports, setCanViewReports] = useState(true)
  const [canManageSettings, setCanManageSettings] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAddUser = async () => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      
      const finalRoleName = newRole === "OTHER" ? (customRoleName.trim() || "CUSTOM_ROLE") : newRole

      const res = await addOrganizationMember(organizationId, newEmail, newName, finalRoleName, newPassword)
      if (res.success) {
        setSuccess(res.message || "User added successfully with specified permissions.")
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
          <h3 className="text-lg font-medium">Team Members & Privileges</h3>
          <p className="text-sm text-muted-foreground">
            Manage team access, custom roles, and granular privileges.
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="inline-flex">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add Team Member & Assign Privileges</DialogTitle>
                <DialogDescription>
                  Invite a new user, specify their role (or custom title), and configure permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-3 text-sm">
                {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
                {success && <p className="text-xs font-semibold text-emerald-600">{success}</p>}
                
                <div className="grid gap-1.5">
                  <Label htmlFor="name" className="text-xs">Full Name</Label>
                  <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Jane Doe" className="h-9" />
                </div>
                
                <div className="grid gap-1.5">
                  <Label htmlFor="email" className="text-xs">Email Address</Label>
                  <Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="jane@example.com" className="h-9" />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="password" className="text-xs">Initial Password (Optional, default: password123)</Label>
                  <Input id="password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" className="h-9" />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="role" className="text-xs">User Role</Label>
                  <Select value={newRole} onValueChange={(val) => setNewRole(val || "REVENUE_OFFICER")}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Admin (Full Control & Approvals)</SelectItem>
                      <SelectItem value="REVENUE_OFFICER">Revenue Officer (Add & Track Revenue)</SelectItem>
                      <SelectItem value="DATA_ENTRY">Data Entry (Submit Entries)</SelectItem>
                      <SelectItem value="VIEWER">Auditor / Viewer (Read-Only)</SelectItem>
                      <SelectItem value="OTHER">Other (Custom Role Title...)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newRole === "OTHER" && (
                  <div className="grid gap-1.5 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900/50 dark:bg-blue-950/30">
                    <Label htmlFor="customRole" className="text-xs font-semibold text-blue-800 dark:text-blue-300">Custom Role Title</Label>
                    <Input
                      id="customRole"
                      value={customRoleName}
                      onChange={(e) => setCustomRoleName(e.target.value)}
                      placeholder="e.g. Senior Financial Analyst, Regional Director"
                      className="h-9 bg-background text-sm"
                    />
                  </div>
                )}

                {/* Granular User Privileges */}
                <div className="space-y-2 rounded-xl border p-3 bg-muted/20">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground mb-1">
                    <Shield className="h-3.5 w-3.5 text-primary" /> Role Privileges & Permissions
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={canAddRevenue} onChange={(e) => setCanAddRevenue(e.target.checked)} className="h-4 w-4 rounded border-input accent-blue-600" />
                      <span>Add Revenue</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={canEditRevenue} onChange={(e) => setCanEditRevenue(e.target.checked)} className="h-4 w-4 rounded border-input accent-blue-600" />
                      <span>Edit Transactions</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={canApproveTransactions} onChange={(e) => setCanApproveTransactions(e.target.checked)} className="h-4 w-4 rounded border-input accent-blue-600" />
                      <span>Approve Entries</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={canViewReports} onChange={(e) => setCanViewReports(e.target.checked)} className="h-4 w-4 rounded border-input accent-blue-600" />
                      <span>View Reports</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer col-span-2">
                      <input type="checkbox" checked={canManageSettings} onChange={(e) => setCanManageSettings(e.target.checked)} className="h-4 w-4 rounded border-input accent-blue-600" />
                      <span>Manage Team & Settings</span>
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button disabled={loading || !newEmail || !newName} onClick={handleAddUser} className="w-full">
                  {loading ? "Adding Member..." : "Add User"}
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
                      <SelectTrigger className="w-[160px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">Admin</SelectItem>
                        <SelectItem value="REVENUE_OFFICER">Revenue Officer</SelectItem>
                        <SelectItem value="DATA_ENTRY">Data Entry</SelectItem>
                        <SelectItem value="VIEWER">Auditor / Viewer</SelectItem>
                        <SelectItem value="OTHER">Other Custom Role</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {member.role === 'SUPER_ADMIN' ? 'Admin' : member.role === 'REVENUE_OFFICER' ? 'Revenue Officer' : member.role === 'DATA_ENTRY' ? 'Data Entry' : member.role}
                    </span>
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
