import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../utils/github'
import { useStore } from '../store/useStore'

export default function AuthCallback() {
  const navigate = useNavigate()
  const setUser  = useStore(s => s.setUser)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')

    if (!token) { navigate('/login'); return }

    getUser(token)
      .then(user => {
        localStorage.setItem('wcs_token', token)
        localStorage.setItem('wcs_user',  JSON.stringify(user))
        setUser(user, token)
        navigate('/')
      })
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div className="min-h-screen bg-vscode-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-vscode-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-vscode-muted text-sm">Signing in with GitHub...</p>
      </div>
    </div>
  )
}
