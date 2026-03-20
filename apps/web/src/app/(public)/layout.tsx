import type { ReactNode } from 'react'

import { PublicSiteChrome } from '@/components/marketing/public-site'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicSiteChrome>{children}</PublicSiteChrome>
}
