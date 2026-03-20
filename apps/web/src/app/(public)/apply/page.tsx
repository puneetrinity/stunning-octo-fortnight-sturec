'use client'

import Link from 'next/link'

import { EditorialCard, MarketingHero } from '@/components/marketing/sections'
import { useAuth } from '@/providers/auth-provider'

const benefits = [
  'Get a structured profile instead of scattered notes',
  'Receive guidance on program fit and admissions timing',
  'Track documents, requirements, bookings, and next actions',
  'Move from public exploration into a real student workflow',
]

export default function ApplyPage() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return (
      <div className="public-shell py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <EditorialCard title={`Welcome back, ${user.firstName}.`} tone="dark">
            <p className="text-base leading-8 text-white/78">
              You already have an account. Continue in your portal to manage progress, speak with
              the AI advisor, or move your application forward.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/portal" className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--color-public-navy)]">
                Open my portal
              </Link>
              <Link href="/portal/chat" className="rounded-full border border-white/18 px-6 py-3 text-center text-sm font-semibold text-white">
                Open AI advisor
              </Link>
            </div>
          </EditorialCard>
        </div>
      </div>
    )
  }

  return (
    <>
      <MarketingHero
        label="Apply"
        title={<>Start with a student account that can actually carry the process.</>}
        description="Registration is where curiosity turns into structure. Once you create an account, Learn in France can save your context, guide your next steps, and keep the process visible over time."
        actions={[
          { href: '/auth/register', label: 'Create free account' },
          { href: '/auth/login', label: 'I already have one', variant: 'secondary' },
        ]}
        aside={
          <EditorialCard title="Why register early" tone="tinted">
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-public-teal)]" />
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
          </EditorialCard>
        }
      />

      <div className="public-shell pb-20">
        <div className="public-panel max-w-3xl p-8 sm:p-10">
          <p className="text-sm leading-7 text-[color:var(--color-public-slate)]">
            Students can register with email and password or Google. Internal team members do not
            self-register here; they use the invite flow provided by an admin.
          </p>
        </div>
      </div>
    </>
  )
}
