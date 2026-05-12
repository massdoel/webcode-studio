export default function LoginPage() {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
  const appUrl   = import.meta.env.VITE_APP_URL || window.location.origin

  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${appUrl}/api/github-oauth`,
      scope: 'repo user read:user',
    })
    window.location.href = `https://github.com/login/oauth/authorize?${params}`
  }

  return (
    <div className="min-h-screen bg-vscode-bg flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-vscode-accent rounded-lg flex items-center justify-center text-white text-xl font-bold">
            W
          </div>
          <span className="text-white text-2xl font-semibold tracking-tight">WebCode Studio</span>
        </div>

        <p className="text-vscode-muted text-sm mb-2">
          VS Code + Figma in your browser
        </p>
        <p className="text-vscode-muted text-xs mb-10">
          Code, design, and deploy — powered by GitHub &amp; Vercel
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['Monaco Editor', 'Design Panel', 'GitHub Sync', 'Vercel Deploy', 'Terminal'].map(f => (
            <span key={f} className="bg-vscode-panel text-vscode-muted text-xs px-3 py-1 rounded-full border border-vscode-border">
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-150 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <p className="text-vscode-muted text-xs mt-6">
          Access to your repositories is required to save and deploy your projects.
        </p>
      </div>
    </div>
  )
}
