import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function TitleBar() {
  const { user, githubRepo, mode, setMode } = useStore()

  const menus = ['File', 'Edit', 'View', 'Git', 'Run', 'Terminal', 'Help']

  return (
    <div className="h-8 bg-vscode-panel flex items-center px-3 gap-1 border-b border-vscode-border shrink-0 text-xs text-vscode-muted">
      {/* App icon */}
      <div className="w-5 h-5 bg-vscode-accent rounded flex items-center justify-center text-white text-xs font-bold mr-2">W</div>

      {/* Menu items */}
      <div className="flex gap-0.5">
        {menus.map(m => (
          <button
            key={m}
            className="px-2.5 py-1 rounded hover:bg-white/10 hover:text-vscode-text transition-colors"
            onClick={() => toast(`${m} menu — coming soon`, { icon: '🔧' })}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="flex-1 text-center text-vscode-muted">
        {githubRepo ? `${githubRepo.full_name}` : 'WebCode Studio'} — {user?.login || ''}
      </div>

      {/* Mode switcher */}
      <div className="flex bg-vscode-bg rounded overflow-hidden border border-vscode-border">
        {[['code','Code'],['split','Split'],['design','Design']].map(([v,l]) => (
          <button
            key={v}
            onClick={() => setMode(v)}
            className={`px-3 py-1 text-xs transition-colors ${mode === v ? 'bg-vscode-accent text-white' : 'text-vscode-muted hover:text-vscode-text'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Deploy button */}
      <button
        className="ml-2 flex items-center gap-1.5 bg-black text-white text-xs px-3 py-1 rounded hover:bg-gray-800 transition-colors"
        onClick={() => toast('Connect Vercel in Settings to deploy', { icon: '▲' })}
      >
        ▲ Deploy
      </button>
    </div>
  )
}
