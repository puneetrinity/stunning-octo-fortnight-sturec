import { fireEvent, screen, waitFor } from '@testing-library/react'

import api from '@/lib/api/client'
import { renderWithProviders, setMockAuth, makeUser } from '../../../test/helpers'
import { Topbar } from './topbar'

describe('Topbar notifications', () => {
  beforeEach(() => {
    setMockAuth({ user: makeUser({ firstName: 'Awa', role: 'admin' }) })
  })

  afterEach(() => {
    setMockAuth({})
    vi.clearAllMocks()
  })

  it('shows unread badge and recent notification items', async () => {
    vi.mocked(api.get).mockResolvedValue({
      unreadCount: 2,
      items: [
        {
          id: 'notif-1',
          templateKey: 'lead_assigned',
          channel: 'email',
          status: 'sent',
          readAt: null,
          sentAt: null,
          createdAt: new Date().toISOString(),
          data: null,
        },
      ],
    } as never)

    renderWithProviders(<Topbar />)

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByRole('button')[0])

    expect(await screen.findByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('New lead assigned to you')).toBeInTheDocument()
    expect(screen.getByText('Mark all read')).toBeInTheDocument()
  })

  it('marks a single unread notification as read when clicked', async () => {
    vi.mocked(api.get).mockResolvedValue({
      unreadCount: 1,
      items: [
        {
          id: 'notif-1',
          templateKey: 'student_assigned',
          channel: 'email',
          status: 'sent',
          readAt: null,
          sentAt: null,
          createdAt: new Date().toISOString(),
          data: null,
        },
      ],
    } as never)
    vi.mocked(api.patch).mockResolvedValue({ ok: true } as never)

    renderWithProviders(<Topbar />)

    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(await screen.findByText('New student assigned to you'))

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith('/users/me/notifications/notif-1/read')
    })
  })

  it('marks all notifications as read from the dropdown action', async () => {
    vi.mocked(api.get).mockResolvedValue({
      unreadCount: 3,
      items: [
        {
          id: 'notif-1',
          templateKey: 'booking_created',
          channel: 'email',
          status: 'sent',
          readAt: null,
          sentAt: null,
          createdAt: new Date().toISOString(),
          data: null,
        },
      ],
    } as never)
    vi.mocked(api.patch).mockResolvedValue({ ok: true } as never)

    renderWithProviders(<Topbar />)

    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(await screen.findByText('Mark all read'))

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith('/users/me/notifications/read-all')
    })
  })
})
