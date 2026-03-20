import { fireEvent, screen, waitFor } from '@testing-library/react'

import {
  getMockRefreshUser,
  getMockSignOut,
  renderWithProviders,
  setMockAuth,
} from '../../../../test/helpers'
import { replaceMock } from '../../../../test/setup'
import api from '@/lib/api/client'
import { signInWithGoogle } from '@/lib/auth/firebase'
import LoginPage from './page'

describe('LoginPage', () => {
  afterEach(() => {
    setMockAuth({})
    vi.clearAllMocks()
  })

  it('shows a one-click student completion action when a Firebase user has no backend account', async () => {
    setMockAuth({
      authError: 'USER_NOT_FOUND',
      firebaseUser: { displayName: 'Awa Diallo' } as never,
    })
    getMockRefreshUser().mockResolvedValue({
      role: 'student',
    })
    vi.mocked(api.post).mockResolvedValue({} as never)

    renderWithProviders(<LoginPage />)

    fireEvent.click(screen.getByText('Complete student registration'))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        firstName: 'Awa',
        lastName: 'Diallo',
      })
    })
    expect(getMockRefreshUser()).toHaveBeenCalled()
    expect(replaceMock).toHaveBeenCalledWith('/portal')
  })

  it('shows the register link when there is no Firebase user to complete from', async () => {
    setMockAuth({
      authError: 'USER_NOT_FOUND',
      firebaseUser: null,
    })

    renderWithProviders(<LoginPage />)

    expect(screen.getByRole('link', { name: 'Create a student account' })).toHaveAttribute(
      'href',
      '/auth/register',
    )
  })

  it('surfaces the invite-specific error if the Firebase user belongs to a team invite', async () => {
    setMockAuth({
      authError: 'USER_NOT_FOUND',
      firebaseUser: { displayName: 'Awa Diallo' } as never,
    })
    vi.mocked(api.post).mockRejectedValue({ code: 'USE_ACCEPT_INVITE' })

    renderWithProviders(<LoginPage />)

    fireEvent.click(screen.getByText('Complete student registration'))

    expect(await screen.findByText('This email belongs to an invited team member. Use your invitation link instead.')).toBeInTheDocument()
  })

  it('continues with Google for normal existing-account login', async () => {
    setMockAuth({})
    vi.mocked(signInWithGoogle).mockResolvedValue({} as never)

    renderWithProviders(<LoginPage />)

    fireEvent.click(screen.getByText('Continue with Google'))

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalled()
    })
  })

  it('signs out and clears the error when retrying with a different account', async () => {
    setMockAuth({
      authError: 'USER_NOT_FOUND',
      firebaseUser: { displayName: 'Awa Diallo' } as never,
    })
    getMockSignOut().mockResolvedValue(undefined)

    renderWithProviders(<LoginPage />)

    fireEvent.click(screen.getByText('Sign out and try a different account'))

    await waitFor(() => {
      expect(getMockSignOut()).toHaveBeenCalled()
    })
  })
})
