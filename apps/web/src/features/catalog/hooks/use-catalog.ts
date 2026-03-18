import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type {
  PaginatedResponse,
  PaginationParams,
  UniversityItem,
  ProgramItem,
  ProgramIntakeItem,
  VisaRequirement,
  EligibilityRule,
  CampusFrancePrep,
} from '@sturec/shared'
import api from '@/lib/api/client'

// ─── Universities ───────────────────────────────────────────

interface UseUniversitiesParams extends PaginationParams {
  search?: string
}

export function useUniversities(params: UseUniversitiesParams = {}) {
  return useQuery({
    queryKey: ['catalog', 'universities', params],
    queryFn: () =>
      api.get('/catalog/universities', { params }) as unknown as PaginatedResponse<UniversityItem>,
  })
}

export interface CreateUniversityPayload {
  name: string
  city: string
  country: string
  websiteUrl?: string
  partnerStatus?: string
  notes?: string
}

export function useCreateUniversity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUniversityPayload) =>
      api.post('/catalog/universities', data) as unknown as Promise<UniversityItem>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalog', 'universities'] })
    },
  })
}

export function useUpdateUniversity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: CreateUniversityPayload & { id: string }) =>
      api.patch(`/catalog/universities/${id}`, data) as unknown as Promise<UniversityItem>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalog', 'universities'] })
    },
  })
}

// ─── Programs ───────────────────────────────────────────────

interface UseProgramsParams extends PaginationParams {
  search?: string
  universityId?: string
  degreeLevel?: string
}

export function usePrograms(params: UseProgramsParams = {}) {
  return useQuery({
    queryKey: ['catalog', 'programs', params],
    queryFn: () =>
      api.get('/catalog/programs', { params }) as unknown as PaginatedResponse<ProgramItem>,
  })
}

export interface CreateProgramPayload {
  universityId: string
  name: string
  degreeLevel: string
  fieldOfStudy: string
  language?: string
  durationMonths: number
  tuitionAmount?: number
  tuitionCurrency?: string
  description?: string
}

export function useCreateProgram() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProgramPayload) =>
      api.post('/catalog/programs', data) as unknown as Promise<ProgramItem>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalog', 'programs'] })
    },
  })
}

export function useUpdateProgram() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CreateProgramPayload> & { id: string }) =>
      api.patch(`/catalog/programs/${id}`, data) as unknown as Promise<ProgramItem>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalog', 'programs'] })
    },
  })
}

// ─── Intakes (program-scoped) ───────────────────────────────

interface UseIntakesParams extends PaginationParams {
  programId: string
}

export function useIntakes(params: UseIntakesParams) {
  const { programId, ...rest } = params
  return useQuery({
    queryKey: ['catalog', 'intakes', params],
    queryFn: () =>
      api.get(`/catalog/programs/${programId}/intakes`, { params: rest }) as unknown as PaginatedResponse<ProgramIntakeItem>,
    enabled: !!programId,
  })
}

// ─── Visa Requirements ──────────────────────────────────────

interface UseVisaRequirementsParams extends PaginationParams {
  search?: string
}

export function useVisaRequirements(params: UseVisaRequirementsParams = {}) {
  return useQuery({
    queryKey: ['catalog', 'visa-requirements', params],
    queryFn: () =>
      api.get('/catalog/visa-requirements', { params }) as unknown as PaginatedResponse<VisaRequirement>,
  })
}

export interface CreateVisaRequirementPayload {
  title: string
  description: string
  documentType: string
  required?: boolean
  countrySpecific?: string
  stageApplicable?: string
  sortOrder?: number
}

export function useCreateVisaRequirement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVisaRequirementPayload) =>
      api.post('/catalog/visa-requirements', data) as unknown as Promise<VisaRequirement>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalog', 'visa-requirements'] })
    },
  })
}

export function useUpdateVisaRequirement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CreateVisaRequirementPayload> & { id: string }) =>
      api.patch(`/catalog/visa-requirements/${id}`, data) as unknown as Promise<VisaRequirement>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalog', 'visa-requirements'] })
    },
  })
}

// ─── Eligibility Rules ──────────────────────────────────────

interface UseEligibilityRulesParams extends PaginationParams {
  search?: string
  programId?: string
}

export function useEligibilityRules(params: UseEligibilityRulesParams = {}) {
  return useQuery({
    queryKey: ['catalog', 'eligibility-rules', params],
    queryFn: () =>
      api.get('/catalog/eligibility-rules', { params }) as unknown as PaginatedResponse<EligibilityRule>,
  })
}

// ─── Campus France Prep ─────────────────────────────────────

interface UseCampusFrancePrepsParams extends PaginationParams {
  search?: string
  category?: string
}

export function useCampusFrancePreps(params: UseCampusFrancePrepsParams = {}) {
  return useQuery({
    queryKey: ['catalog', 'campus-france-prep', params],
    queryFn: () =>
      api.get('/catalog/campus-france-prep', { params }) as unknown as PaginatedResponse<CampusFrancePrep>,
  })
}
