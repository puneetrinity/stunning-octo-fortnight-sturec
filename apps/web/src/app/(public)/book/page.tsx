import { EditorialCard, MarketingCTA, MarketingHero } from '@/components/marketing/sections'

const consultationAgenda = [
  'Academic background and goals',
  'Program fit and realistic options',
  'Budget, city, and timing constraints',
  'Campus France, visa, and document questions',
]

export default function BookPage() {
  return (
    <>
      <MarketingHero
        label="Book a consultation"
        title={<>Speak with a counsellor before you commit to a route.</>}
        description="Some students already know they need a human conversation. The consultation is the right place to pressure-test goals, shortlist logic, and the operational shape of the move to France."
        actions={[
          { href: '/apply', label: 'Create account to book' },
          { href: '/auth/login', label: 'Sign in to schedule', variant: 'secondary' },
        ]}
        aside={
          <EditorialCard title="What a good consultation covers" tone="dark">
            <div className="space-y-3">
              {consultationAgenda.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white/75" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </EditorialCard>
        }
      />

      <MarketingCTA
        label="Before booking"
        title="Create your account first so the consultation has context."
        description="Scheduling is connected to the product workflow. Once you are inside, the team can align the conversation with your profile and next actions."
        primary={{ href: '/auth/register', label: 'Create account' }}
        secondary={{ href: '/contact', label: 'General contact' }}
      />
    </>
  )
}
