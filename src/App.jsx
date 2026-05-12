import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import EditorPage from './pages/EditorPage'
import AuthCallback from './pages/AuthCallback'
import { useStore } from './store/useStore'

export default function App() {
  const user = useStore(s => s.user)

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#2d2d2d', color: '#d4d4d4', border: '1px solid #3c3c3c', fontSize: 13 },
        }}
      />
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/*" element={user ? <EditorPage /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}
