import { fireEvent, screen, waitFor } from '@testing-library/react'

import {
  getMockSignOut,
  renderWithProviders,
  setMockAuth,
} from '../../../../test/helpers'
import api from '@/lib/api/client'
import { signInWithGoogle, signUpWithEmail } from '@/lib/auth/firebase'
import RegisterPage from './page'
import { pushMock } from '../../../../test/setup'

describe('RegisterPage', () => {
  afterEach(() => {
    setMockAuth({})
    vi.clearAllMocks()
  })

  it('registers a new student with email/password', async () => {
    setMockAuth({})
    vi.mocked(signUpWithEmail).mockResolvedValue({} as never)
    vi.mocked(api.post).mockResolvedValue({} as never)

    renderWithProviders(<RegisterPage />)

    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Awa' } })
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Diallo' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'awa@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })

    fireEvent.click(screen.getByText('Create account'))

    await waitFor(() => {
      expect(signUpWithEmail).toHaveBeenCalledWith('awa@example.com', 'password123')
    })
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      firstName: 'Awa',
      lastName: 'Diallo',
    })
    expect(pushMock).toHaveBeenCalledWith('/portal')
  })

  it('registers a new student with Google', async () => {
    setMockAuth({})
    vi.mocked(signInWithGoogle).mockResolvedValue({
      user: { displayName: 'Awa Diallo' },
    } as never)
    vi.mocked(api.post).mockResolvedValue({} as never)

    renderWithProviders(<RegisterPage />)

    fireEvent.click(screen.getByText('Continue with Google'))

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalled()
    })
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      firstName: 'Awa',
      lastName: 'Diallo',
    })
    expect(pushMock).toHaveBeenCalledWith('/portal')
  })

  it('shows a cancellation message if Google popup is closed', async () => {
    setMockAuth({})
    getMockSignOut().mockResolvedValue(undefined)
    vi.mocked(signInWithGoogle).mockRejectedValue({ code: 'auth/popup-closed-by-user' })

    renderWithProviders(<RegisterPage />)

    fireEvent.click(screen.getByText('Continue with Google'))

    await waitFor(() => {
      expect(screen.getByText('Google sign-up was cancelled.')).toBeInTheDocument()
    })
    expect(getMockSignOut()).toHaveBeenCalled()
  })
})
