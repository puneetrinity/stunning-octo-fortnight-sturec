import { EditorialCard, MarketingCTA, MarketingHero, MetricStrip, SectionHeading } from '@/components/marketing/sections'
import { PublicSiteChrome } from '@/components/marketing/public-site'

const metrics = [
  { value: '13', label: 'Stages tracked from first enquiry to arrival', note: 'Real student workflow' },
  { value: '120+', label: 'Universities and schools in the active catalog', note: 'Live data' },
  { value: '24/7', label: 'AI advisor coverage for questions and triage', note: 'Portal + public entrypoints' },
  { value: '1', label: 'Country focus: France only', note: 'Specialist guidance' },
]

const pillars = [
  {
    title: 'Grounded admissions planning',
    description:
      'We start with academic fit, budget, language level, and timing. Students get a realistic plan instead of generic study-abroad hype.',
  },
  {
    title: 'Operational support, not just discovery',
    description:
      'Campus France, visa readiness, document tracking, bookings, and follow-up all sit in one system instead of scattered chats and spreadsheets.',
  },
  {
    title: 'AI when it helps, counsellors when it matters',
    description:
      'The AI advisor handles exploration and repetitive questions. Counsellors step in for judgement, strategy, and high-stakes decisions.',
  },
]

const roadmap = [
  {
    title: 'Profile and eligibility',
    description: 'Capture background, qualification signals, and preferred intakes before wasting time on the wrong shortlist.',
  },
  {
    title: 'Program discovery',
    description: 'Match programs by degree, city, language, tuition, and progression goals using the live catalog.',
  },
  {
    title: 'Application build',
    description: 'Track required documents, strengthen gaps, and move from draft to submitted with counsellor review.',
  },
  {
    title: 'Campus France and visa',
    description: 'Keep the dossier, interview preparation, visa readiness, and booking milestones visible in one place.',
  },
  {
    title: 'Arrival preparation',
    description: 'Continue into accommodation, pre-departure support, and student portal workflows after the offer stage.',
  },
]

const franceAngles = [
  {
    title: 'Programs across public and private institutions',
    description:
      'France gives students access to public universities, specialized schools, Grandes Ecoles, and English-taught postgraduate programs without forcing a single path.',
  },
  {
    title: 'Better cost-to-outcome maths',
    description:
      'Students often compare tuition, accommodation, and post-study mobility as one decision. France stays competitive when all three are considered together.',
  },
  {
    title: 'A process that rewards preparation',
    description:
      'The hardest part is not finding desire to study abroad. It is sequencing requirements correctly. That is exactly what Learn in France is built around.',
  },
]

const proofPoints = [
  'Live public program and university discovery',
  'Student self-service portal with progress, documents, chat, and bookings',
  'Internal admissions workspace for leads, students, analytics, and catalog',
  'Ops console for queues, integrations, webhook history, alerts, and audit trail',
]

export default function HomePage() {
  return (
    <PublicSiteChrome>
      <MarketingHero
        label="Learn in France"
        title={
          <>
            A calmer way to plan your
            <span className="block text-[var(--color-public-teal)]">move to France.</span>
          </>
        }
        description="Learn in France is built for students who need more than a pretty brochure. We combine live program discovery, practical admissions guidance, and a structured support system that carries through applications, Campus France, visas, and arrival."
        actions={[
          { href: '/apply', label: 'Start your student profile' },
          { href: '/programs', label: 'Explore programs', variant: 'secondary' },
        ]}
        caption="Designed around the real sequence of decisions international students face when choosing France."
        aside={
          <div className="grid gap-4">
            <EditorialCard title="What students actually need" tone="tinted">
              <div className="space-y-3">
                {proofPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-public-teal)]" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </EditorialCard>
            <EditorialCard title="The operating principle" tone="dark">
              <p>
                France is the niche. The workflow is the product. Every surface is designed to
                reduce ambiguity for the student and create clarity for the counselling team.
              </p>
            </EditorialCard>
          </div>
        }
      />

      <MetricStrip items={metrics} />

      <section className="py-12 sm:py-18">
        <div className="public-shell">
          <SectionHeading
            label="Why this feels different"
            title="More editorial, less brochureware."
            description="The public site should feel like a credible guide, not a generic funnel. We speak plainly about process, tradeoffs, and what the student journey really involves."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <EditorialCard
                key={pillar.title}
                title={pillar.title}
                tone={index === 1 ? 'dark' : 'light'}
              >
                <p>{pillar.description}</p>
              </EditorialCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-18">
        <div className="public-shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_1.1fr] lg:items-start">
          <SectionHeading
            label="Roadmap"
            title="Built around a real student timeline."
            description="Behind the scenes, the platform tracks a 13-stage lifecycle. On the public side, we surface the journey in the order students actually experience it."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {roadmap.map((item, index) => (
              <div key={item.title} className="public-panel p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-public-burgundy)]">
                  Phase {index + 1}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-public-navy)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--color-public-slate)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-18">
        <div className="public-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-5 md:grid-cols-3">
            {franceAngles.map((angle) => (
              <EditorialCard key={angle.title} title={angle.title} tone="tinted">
                <p>{angle.description}</p>
              </EditorialCard>
            ))}
          </div>
          <EditorialCard title="For students choosing France on purpose" tone="dark">
            <p>
              This is not a global marketplace trying to cover every country badly. The content,
              support flows, and product architecture all assume one destination and go deeper
              because of it.
            </p>
          </EditorialCard>
        </div>
      </section>

      <MarketingCTA
        label="Next step"
        title="Start with your profile, not guesswork."
        description="Create a free account to get program guidance, save your progress, talk to the AI advisor, and move into a structured application flow when you are ready."
        primary={{ href: '/auth/register', label: 'Create a free account' }}
        secondary={{ href: '/chat', label: 'Talk to the AI advisor first' }}
      />
    </PublicSiteChrome>
  )
}
