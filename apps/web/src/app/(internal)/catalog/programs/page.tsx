'use client'

import { useState } from 'react'

import type { ProgramItem } from '@sturec/shared'
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
import { usePrograms, useUniversities, useCreateProgram, useUpdateProgram } from '@/features/catalog/hooks/use-catalog'
import { useAuth } from '@/providers/auth-provider'

interface ProgramFormState {
  universityId: string
  name: string
  degreeLevel: string
  fieldOfStudy: string
  language: string
  durationMonths: string
  tuitionAmount: string
  tuitionCurrency: string
  description: string
}

const emptyForm: ProgramFormState = {
  universityId: '',
  name: '',
  degreeLevel: 'bachelor',
  fieldOfStudy: '',
  language: 'English',
  durationMonths: '',
  tuitionAmount: '',
  tuitionCurrency: 'EUR',
  description: '',
}

export default function ProgramsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProgramFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading } = usePrograms({
    page, limit: 20, search, sortBy, sortOrder,
  })

  // Fetch universities for the dropdown (all, no pagination limit needed for a select)
  const { data: uniData } = useUniversities({ limit: 200 })

  const createMutation = useCreateProgram()
  const updateMutation = useUpdateProgram()

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

  function openEdit(row: ProgramItem) {
    setEditingId(row.id)
    setForm({
      universityId: row.universityId,
      name: row.name,
      degreeLevel: row.degreeLevel,
      fieldOfStudy: row.fieldOfStudy,
      language: row.language,
      durationMonths: String(row.durationMonths),
      tuitionAmount: String(row.tuitionAmount),
      tuitionCurrency: row.tuitionCurrency,
      description: row.description ?? '',
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

    if (!form.universityId || !form.name.trim() || !form.fieldOfStudy.trim() || !form.durationMonths) {
      setFormError('University, name, field of study, and duration are required.')
      return
    }

    const payload = {
      universityId: form.universityId,
      name: form.name.trim(),
      degreeLevel: form.degreeLevel,
      fieldOfStudy: form.fieldOfStudy.trim(),
      language: form.language.trim() || 'English',
      durationMonths: parseInt(form.durationMonths, 10),
      tuitionAmount: form.tuitionAmount ? parseFloat(form.tuitionAmount) : undefined,
      tuitionCurrency: form.tuitionCurrency.trim() || 'EUR',
      description: form.description.trim() || undefined,
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

  const columns: Column<ProgramItem>[] = [
    {
      key: 'name',
      header: 'Program',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          <p className="text-xs text-text-muted">{row.universityName}</p>
        </div>
      ),
    },
    {
      key: 'degreeLevel',
      header: 'Degree',
      render: (row) => (
        <span className="text-sm text-text-secondary capitalize">{row.degreeLevel}</span>
      ),
    },
    {
      key: 'fieldOfStudy',
      header: 'Field',
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.fieldOfStudy}</span>
      ),
    },
    {
      key: 'language',
      header: 'Language',
      render: (row) => (
        <Badge variant="info">{row.language}</Badge>
      ),
    },
    {
      key: 'tuitionAmount',
      header: 'Tuition',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-mono text-text-primary">
          {new Intl.NumberFormat('en-GB', { style: 'currency', currency: row.tuitionCurrency, maximumFractionDigits: 0 }).format(row.tuitionAmount)}
        </span>
      ),
    },
    {
      key: 'durationMonths',
      header: 'Duration',
      render: (row) => (
        <span className="text-xs text-text-secondary">
          {row.durationMonths} mo
        </span>
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
    ...(isAdmin ? [{
      key: 'actions' as const,
      header: '',
      className: 'w-20',
      render: (row: ProgramItem) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
          Edit
        </Button>
      ),
    }] : []),
  ]

  const universityOptions = (uniData?.items ?? []).map((u) => ({
    value: u.id,
    label: u.name,
  }))

  return (
    <div>
      <PageHeader
        title="Catalog"
        description="Manage universities, programs, intakes, visa requirements, and eligibility rules."
        badge={data ? <Badge variant="muted">{data.total} programs</Badge> : null}
        actions={isAdmin ? (
          <Button size="sm" onClick={openCreate}>
            Add Program
          </Button>
        ) : undefined}
      />
      <CatalogNav />

      <FilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search programs by name, field, or university..."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          title="No programs found"
          description={search ? 'Try adjusting your search.' : 'Add your first program to get started.'}
          icon={
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="8" width="36" height="32" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M14 18h20M14 24h20M14 30h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
        title={editingId ? 'Edit Program' : 'Add Program'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="University"
            required
            value={form.universityId}
            onChange={(e) => setForm({ ...form, universityId: e.target.value })}
            options={universityOptions}
            placeholder="Select a university..."
          />
          <Input
            label="Program Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. MSc Computer Science"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Degree Level"
              value={form.degreeLevel}
              onChange={(e) => setForm({ ...form, degreeLevel: e.target.value })}
              options={[
                { value: 'bachelor', label: 'Bachelor' },
                { value: 'master', label: 'Master' },
                { value: 'doctorate', label: 'Doctorate' },
                { value: 'diploma', label: 'Diploma' },
              ]}
            />
            <Input
              label="Field of Study"
              required
              value={form.fieldOfStudy}
              onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
              placeholder="e.g. Computer Science"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Language"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              placeholder="English"
            />
            <Input
              label="Duration (months)"
              type="number"
              required
              min={1}
              value={form.durationMonths}
              onChange={(e) => setForm({ ...form, durationMonths: e.target.value })}
              placeholder="24"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tuition Amount"
              type="number"
              min={0}
              value={form.tuitionAmount}
              onChange={(e) => setForm({ ...form, tuitionAmount: e.target.value })}
              placeholder="10000"
            />
            <Input
              label="Tuition Currency"
              value={form.tuitionCurrency}
              onChange={(e) => setForm({ ...form, tuitionCurrency: e.target.value })}
              placeholder="EUR"
            />
          </div>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Program description..."
          />

          {formError && (
            <p className="text-sm text-red-600">{formError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {editingId ? 'Save Changes' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
