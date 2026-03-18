'use client'

import { useState } from 'react'

import type { VisaRequirement } from '@sturec/shared'
import { PageHeader } from '@/components/layout/page-header'
import { FilterBar } from '@/components/shared/filter-bar'
import { Table, type Column } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CatalogNav } from '../_components/catalog-nav'
import { useVisaRequirements, useCreateVisaRequirement, useUpdateVisaRequirement } from '@/features/catalog/hooks/use-catalog'
import { useAuth } from '@/providers/auth-provider'

interface VisaFormState {
  title: string
  description: string
  documentType: string
  required: boolean
  countrySpecific: string
  stageApplicable: string
  sortOrder: string
}

const emptyForm: VisaFormState = {
  title: '',
  description: '',
  documentType: '',
  required: true,
  countrySpecific: '',
  stageApplicable: '',
  sortOrder: '0',
}

export default function VisaRequirementsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<VisaFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading } = useVisaRequirements({
    page, limit: 20, search, sortBy: 'sortOrder', sortOrder: 'asc',
  })

  const createMutation = useCreateVisaRequirement()
  const updateMutation = useUpdateVisaRequirement()

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(row: VisaRequirement) {
    setEditingId(row.id)
    setForm({
      title: row.title,
      description: row.description,
      documentType: row.documentType,
      required: row.required,
      countrySpecific: row.countrySpecific ?? '',
      stageApplicable: row.stageApplicable ?? '',
      sortOrder: String(row.sortOrder),
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

    if (!form.title.trim() || !form.description.trim() || !form.documentType.trim()) {
      setFormError('Title, description, and document type are required.')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      documentType: form.documentType.trim(),
      required: form.required,
      countrySpecific: form.countrySpecific.trim() || undefined,
      stageApplicable: form.stageApplicable.trim() || undefined,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
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

  const columns: Column<VisaRequirement>[] = [
    {
      key: 'title',
      header: 'Requirement',
      render: (row) => (
        <div>
          <p className="font-medium text-text-primary">{row.title}</p>
          <p className="text-xs text-text-muted line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'documentType',
      header: 'Document Type',
      render: (row) => (
        <span className="text-sm text-text-secondary capitalize">
          {row.documentType.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'required',
      header: 'Required',
      render: (row) => (
        <Badge variant={row.required ? 'danger' : 'muted'}>
          {row.required ? 'Required' : 'Optional'}
        </Badge>
      ),
    },
    {
      key: 'countrySpecific',
      header: 'Country',
      render: (row) => row.countrySpecific ? (
        <span className="text-sm text-text-secondary">{row.countrySpecific}</span>
      ) : (
        <span className="text-xs text-text-muted">All</span>
      ),
    },
    {
      key: 'stageApplicable',
      header: 'Stage',
      render: (row) => row.stageApplicable ? (
        <span className="text-xs text-text-secondary capitalize">
          {row.stageApplicable.replace(/_/g, ' ')}
        </span>
      ) : (
        <span className="text-xs text-text-muted">--</span>
      ),
    },
    {
      key: 'sortOrder',
      header: 'Order',
      className: 'w-16',
      render: (row) => (
        <span className="text-xs font-mono text-text-muted">{row.sortOrder}</span>
      ),
    },
    ...(isAdmin ? [{
      key: 'actions' as const,
      header: '',
      className: 'w-20',
      render: (row: VisaRequirement) => (
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
        badge={data ? <Badge variant="muted">{data.total} requirements</Badge> : null}
        actions={isAdmin ? (
          <Button size="sm" onClick={openCreate}>
            Add Requirement
          </Button>
        ) : undefined}
      />
      <CatalogNav />

      <FilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search visa requirements..."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          title="No visa requirements found"
          description={search ? 'Try adjusting your search.' : 'Add visa documentation requirements for the AI advisor to reference.'}
          icon={
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="20" r="6" stroke="currentColor" strokeWidth="2" />
              <path d="M14 34h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 38h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
        title={editingId ? 'Edit Visa Requirement' : 'Add Visa Requirement'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Valid Passport"
          />
          <Textarea
            label="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the requirement..."
          />
          <Input
            label="Document Type"
            required
            value={form.documentType}
            onChange={(e) => setForm({ ...form, documentType: e.target.value })}
            placeholder="e.g. passport, birth_certificate"
          />
          <div className="flex items-center gap-3">
            <input
              id="visa-required"
              type="checkbox"
              checked={form.required}
              onChange={(e) => setForm({ ...form, required: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="visa-required" className="text-sm text-text-secondary">
              Required document
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Country Specific"
              value={form.countrySpecific}
              onChange={(e) => setForm({ ...form, countrySpecific: e.target.value })}
              placeholder="Leave blank for all countries"
            />
            <Input
              label="Stage Applicable"
              value={form.stageApplicable}
              onChange={(e) => setForm({ ...form, stageApplicable: e.target.value })}
              placeholder="e.g. visa_application"
            />
          </div>
          <Input
            label="Sort Order"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            placeholder="0"
          />

          {formError && (
            <p className="text-sm text-red-600">{formError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {editingId ? 'Save Changes' : 'Create Requirement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
