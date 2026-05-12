import { useStore } from '../store/useStore'

const ICONS = [
  { id: 'files',    icon: '⊞',  label: 'Explorer' },
  { id: 'search',   icon: '🔍', label: 'Search' },
  { id: 'git',      icon: '⎇',  label: 'Source Control' },
  { id: 'debug',    icon: '🐞', label: 'Run & Debug' },
  { id: 'extensions', icon: '⊡', label: 'Extensions' },
]

export default function ActivityBar() {
  const { activePanel, setActivePanel } = useStore()

  return (
    <div className="w-10 bg-vscode-sidebar flex flex-col items-center py-1 border-r border-vscode-border shrink-0">
      <div className="flex flex-col gap-0.5 flex-1">
        {ICONS.map(({ id, icon, label }) => (
          <button
            key={id}
            title={label}
            onClick={() => setActivePanel(id)}
            className={`w-9 h-9 flex items-center justify-center rounded text-base transition-all
              ${activePanel === id
                ? 'text-white bg-vscode-active border-l-2 border-vscode-accent'
                : 'text-vscode-muted hover:text-vscode-text'
              }`}
          >
            {icon}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <button
          title="User"
          className="w-9 h-9 flex items-center justify-center rounded text-vscode-muted hover:text-white transition-colors text-sm"
        >
          👤
        </button>
        <button
          title="Settings"
          className="w-9 h-9 flex items-center justify-center rounded text-vscode-muted hover:text-white transition-colors text-sm"
        >
          ⚙
        </button>
      </div>
    </div>
  )
}
