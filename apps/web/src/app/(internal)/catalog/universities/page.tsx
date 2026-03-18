'use client'

import { useState } from 'react'

import type { UniversityItem } from '@sturec/shared'
import { PageHeader } from '@/components/layout/page-header'
import { FilterBar } from '@/components/shared/filter-bar'
import { Table, type Column } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CatalogNav } from '../_components/catalog-nav'
import { useUniversities, useCreateUniversity, useUpdateUniversity } from '@/features/catalog/hooks/use-catalog'
import { useAuth } from '@/providers/auth-provider'

interface UniversityFormState {
  name: string
  city: string
  country: string
  websiteUrl: string
  partnerStatus: string
  notes: string
}

const emptyForm: UniversityFormState = {
  name: '',
  city: '',
  country: 'France',
  websiteUrl: '',
  partnerStatus: 'active',
  notes: '',
}

export default function UniversitiesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UniversityFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading } = useUniversities({
    page, limit: 20, search, sortBy, sortOrder,
  })

  const createMutation = useCreateUniversity()
  const updateMutation = useUpdateUniversity()

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(row: UniversityItem) {
    setEditingId(row.id)
    setForm({
      name: row.name,
      city: row.city,
      country: row.country,
      websiteUrl: row.websiteUrl ?? '',
      partnerStatus: row.partnerStatus ?? 'active',
      notes: '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setFormError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!form.name.trim() || !form.city.trim()) {
      setFormError('Name and city are required.')
      return
    }

    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      country: form.country.trim() || 'France',
      websiteUrl: form.websiteUrl.trim() || undefined,
      partnerStatus: form.partnerStatus || undefined,
      notes: form.notes.trim() || undefined,
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      closeModal()
    } catch (err: unknown) {
      const error = err as { error?: string; message?: string }
      setFormError(error?.error ?? error?.message ?? 'Something went wrong.')
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  const columns: Column<UniversityItem>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          {row.websiteUrl && (
            <p className="text-xs text-text-muted truncate max-w-[200px]">{row.websiteUrl}</p>
          )}
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.city}</span>
      ),
    },
    {
      key: 'country',
      header: 'Country',
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.country}</span>
      ),
    },
    {
      key: 'partnerStatus',
      header: 'Partner',
      render: (row) => row.partnerStatus ? (
        <Badge variant="info">{row.partnerStatus}</Badge>
      ) : (
        <span className="text-xs text-text-muted">--</span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'muted'} dot>
          {row.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-text-muted font-mono">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    ...(isAdmin ? [{
      key: 'actions' as const,
      header: '',
      className: 'w-20',
      render: (row: UniversityItem) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
          Edit
        </Button>
      ),
    }] : []),
  ]

  return (
    <div>
      <PageHeader
        title="Catalog"
        description="Manage universities, programs, intakes, visa requirements, and eligibility rules."
        badge={data ? <Badge variant="muted">{data.total} universities</Badge> : null}
        actions={isAdmin ? (
          <Button size="sm" onClick={openCreate}>
            Add University
          </Button>
        ) : undefined}
      />
      <CatalogNav />

      <FilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search universities by name or city..."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          title="No universities found"
          description={search ? 'Try adjusting your search.' : 'Add your first university to get started.'}
          icon={
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 6L6 16v4h36v-4L24 6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M10 20v16M18 20v16M30 20v16M38 20v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <rect x="6" y="36" width="36" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          }
        />
      ) : (
        <>
          <div className="bg-surface-raised rounded-xl border border-border overflow-hidden">
            <Table
              columns={columns}
              data={data.items}
              rowKey={(row) => row.id}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>
          <Pagination
            page={data.page}
            limit={data.limit}
            total={data.total}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit University' : 'Add University'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="University name"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="City"
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="France"
            />
          </div>
          <Input
            label="Website URL"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
            placeholder="https://..."
          />
          <Select
            label="Partner Status"
            value={form.partnerStatus}
            onChange={(e) => setForm({ ...form, partnerStatus: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Internal notes..."
          />

          {formError && (
            <p className="text-sm text-red-600">{formError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {editingId ? 'Save Changes' : 'Create University'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
