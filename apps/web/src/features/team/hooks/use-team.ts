import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type { TeamMemberItem } from '@sturec/shared'
import { fetchTeamMembers } from '@/features/team/lib/team-cache'
import api from '@/lib/api/client'

// ─── View models ─────────────────────────────────────────────────

/** Team member for list display */
export type TeamMemberView = TeamMemberItem

// ─── Hooks ───────────────────────────────────────────────────────

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team', 'members'],
    queryFn: () => fetchTeamMembers(),
  })
}

export function useInviteTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { email: string; firstName: string; lastName: string; role: 'counsellor' | 'admin' }) =>
      api.post('/team/invite', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['team', 'members'] })
    },
  })
}
