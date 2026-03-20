import Link from 'next/link'
import type { ReactNode } from 'react'

interface HeroAction {
  href: string
  label: string
  variant?: 'primary' | 'secondary'
}

interface MarketingHeroProps {
  label: string
  title: ReactNode
  description: string
  actions?: HeroAction[]
  aside?: ReactNode
  footer?: ReactNode
  caption?: string
}

export function MarketingHero({
  label,
  title,
  description,
  actions = [],
  aside,
  footer,
  caption,
}: MarketingHeroProps) {
  return (
    <section className="relative overflow-hidden py-8 sm:py-10">
      <div className="public-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start">
          <div className="relative z-10">
            <span className="public-label">{label}</span>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-[var(--color-public-navy)] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--color-public-slate)] sm:text-lg sm:leading-8">
              {description}
            </p>
            {actions.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={action.variant === 'secondary' ? 'public-button-secondary' : 'public-button-primary'}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            )}
            {caption && (
              <p className="mt-4 text-sm leading-7 text-[color:var(--color-public-muted)]">{caption}</p>
            )}
          </div>

          <div className="relative z-10">{aside}</div>
        </div>

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </section>
  )
}

export function MetricStrip({
  items,
}: {
  items: Array<{ value: string; label: string; note?: string }>
}) {
  return (
    <section className="py-6 sm:py-8">
      <div className="public-shell">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="public-panel p-5">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--color-public-navy)]">
                {item.value}
              </p>
              <p className="mt-1.5 text-sm font-medium text-[color:var(--color-public-slate)]">{item.label}</p>
              {item.note && (
                <p className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[color:var(--color-public-muted)]">
                  {item.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SectionHeading({
  label,
  title,
  description,
  align = 'left',
}: {
  label: string
  title: string
  description: string
  align?: 'left' | 'center'
}) {
  const alignment = align === 'center' ? 'mx-auto text-center' : ''

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <span className="public-label">{label}</span>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-public-navy)] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-[color:var(--color-public-slate)] sm:text-lg sm:leading-8">
        {description}
      </p>
    </div>
  )
}

export function EditorialCard({
  title,
  children,
  tone = 'light',
  className = '',
}: {
  title: string
  children: ReactNode
  tone?: 'light' | 'dark' | 'tinted'
  className?: string
}) {
  const toneClasses =
    tone === 'dark'
      ? 'bg-[linear-gradient(140deg,rgba(10,22,41,1),rgba(24,39,64,0.96))] text-white shadow-[0_28px_80px_rgba(10,22,41,0.24)]'
      : tone === 'tinted'
        ? 'bg-[linear-gradient(140deg,rgba(255,255,255,0.9),rgba(228,238,235,0.88))] text-[var(--color-public-navy)] shadow-[0_20px_60px_rgba(10,22,41,0.08)]'
        : 'bg-white/88 text-[var(--color-public-navy)] shadow-[0_20px_60px_rgba(10,22,41,0.08)]'

  return (
    <div className={`rounded-[24px] p-5 sm:p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(10,22,41,0.12)] ${toneClasses} ${className}`}>
      <h3 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">{title}</h3>
      <div className="mt-2.5 text-sm leading-7 text-inherit/80">{children}</div>
    </div>
  )
}

export function MarketingCTA({
  label,
  title,
  description,
  primary,
  secondary,
}: {
  label: string
  title: string
  description: string
  primary: HeroAction
  secondary?: HeroAction
}) {
  return (
    <section className="py-10 sm:py-14">
      <div className="public-shell">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(140deg,rgba(10,22,41,1),rgba(0,106,98,0.92),rgba(91,30,38,0.92))] px-7 py-8 text-white shadow-[0_28px_90px_rgba(10,22,41,0.28)] sm:px-10 sm:py-10">
          <span className="inline-flex rounded-full bg-white/12 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/78">
            {label}
          </span>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h2>
              <p className="mt-3 text-base leading-7 text-white/78 sm:text-lg sm:leading-8">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href={primary.href} className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--color-public-navy)] transition-transform hover:-translate-y-0.5">
                {primary.label}
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className="rounded-full border border-white/22 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
