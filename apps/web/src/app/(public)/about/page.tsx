import { EditorialCard, MarketingCTA, MarketingHero, SectionHeading } from '@/components/marketing/sections'

const principles = [
  {
    title: 'France only',
    description:
      'We are deliberately narrow. That focus lets us stay useful on requirements, process, deadlines, and expectations that general study-abroad platforms often flatten.',
  },
  {
    title: 'Process over promises',
    description:
      'Students do not need louder claims. They need clearer next actions, honest guidance, and a system that keeps momentum through long application cycles.',
  },
  {
    title: 'Human judgement still matters',
    description:
      'The AI advisor improves speed and accessibility. Counsellors still own nuance, escalation, and the judgement calls that affect admissions outcomes.',
  },
]

const operatingModel = [
  'Public discovery for students still comparing cities, degrees, and budget ranges',
  'A registration and guidance path that turns interest into a qualified student profile',
  'Internal workflows for leads, students, documents, bookings, and analytics',
  'Operational tooling for queues, integrations, alerts, and audit history',
]

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        label="About"
        title={<>A specialist platform for students choosing France.</>}
        description="Learn in France exists because the hard part of studying abroad is rarely inspiration. It is translating interest into an executable plan. We built the platform to make that transition explicit, trackable, and supported."
        actions={[
          { href: '/apply', label: 'Start your plan' },
          { href: '/contact', label: 'Talk to us', variant: 'secondary' },
        ]}
        aside={
          <EditorialCard title="What we are building" tone="dark">
            <div className="space-y-3">
              {operatingModel.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white/75" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </EditorialCard>
        }
      />

      <section className="py-12 sm:py-18">
        <div className="public-shell">
          <SectionHeading
            label="Principles"
            title="The product is grounded in admissions reality."
            description="Everything on the site should make a student feel more oriented, not more overwhelmed."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {principles.map((principle) => (
              <EditorialCard key={principle.title} title={principle.title} tone="light">
                <p>{principle.description}</p>
              </EditorialCard>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8 pt-4 sm:pb-14">
        <div className="public-shell">
          <EditorialCard title="How we work" tone="tinted" className="max-w-5xl">
            <p className="text-base leading-8 text-[color:var(--color-public-slate)]">
              Students can begin in whichever mode suits them best: reading guides, exploring the
              catalog, booking a consultation, or starting with the AI advisor. From there, the
              platform moves them into a structured support environment where counsellors and
              automation work together instead of competing for attention.
            </p>
          </EditorialCard>
        </div>
      </section>

      <MarketingCTA
        label="Work with us"
        title="If France is your destination, start in the right system."
        description="Create a profile, explore programs, or speak to the team if you want to understand how the process works before committing."
        primary={{ href: '/auth/register', label: 'Create account' }}
        secondary={{ href: '/contact', label: 'Contact Learn in France' }}
      />
    </>
  )
}
