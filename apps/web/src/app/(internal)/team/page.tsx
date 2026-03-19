'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, type Column } from '@/components/ui/table'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { useTeamMembers, useInviteTeamMember, type TeamMemberView } from '@/features/team/hooks/use-team'

export default function TeamPage() {
  const { data: members, isLoading } = useTeamMembers()
  const inviteMutation = useInviteTeamMember()
  const [showInvite, setShowInvite] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<'counsellor' | 'admin'>('counsellor')
  const [error, setError] = useState('')

  function resetForm() {
    setEmail('')
    setFirstName('')
    setLastName('')
    setRole('counsellor')
    setError('')
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await inviteMutation.mutateAsync({ email, firstName, lastName, role })
      setShowInvite(false)
      resetForm()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Failed to send invite'
      setError(msg)
    }
  }

  const columns: Column<TeamMemberView>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
            {row.firstName[0]}{row.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-text-primary">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Badge variant={row.role === 'admin' ? 'primary' : 'info'}>
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'invited' ? 'warning' : 'muted'} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (row) => (
        <span className="text-xs text-text-secondary">{row.phone ?? '—'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (row) => (
        <span className="text-xs text-text-muted font-mono">
          {new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage counsellors and admin accounts."
        actions={
          <Button size="sm" onClick={() => setShowInvite(true)} icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }>
            Invite Member
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-surface-raised rounded-xl border border-border overflow-hidden">
          <Table
            columns={columns}
            data={members ?? []}
            rowKey={(row) => row.id}
          />
        </div>
      )}

      <Modal open={showInvite} onClose={() => { setShowInvite(false); resetForm() }} title="Invite Team Member" size="sm">
        <form onSubmit={handleInvite} className="space-y-3">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
            />
            <Input
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'counsellor' | 'admin')}
              className="block w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-raised text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="counsellor">Counsellor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => { setShowInvite(false); resetForm() }}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={inviteMutation.isPending}>
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
