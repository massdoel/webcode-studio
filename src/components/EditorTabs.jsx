import { useStore } from '../store/useStore'
import { getFileIcon } from '../utils/github'

export default function EditorTabs() {
  const { files, openTabs, activeFileId, openFile, closeTab } = useStore()

  const tabFiles = openTabs.map(id => files.find(f => f.id === id)).filter(Boolean)

  if (tabFiles.length === 0) return (
    <div className="h-9 bg-vscode-panel border-b border-vscode-border flex items-center px-4 text-vscode-muted text-xs">
      No files open
    </div>
  )

  return (
    <div className="flex bg-vscode-panel border-b border-vscode-border overflow-x-auto shrink-0" style={{minHeight: 35}}>
      {tabFiles.map(f => (
        <div
          key={f.id}
          onClick={() => openFile(f.id)}
          className={`tab-item flex items-center gap-1.5 px-3 py-1.5 cursor-pointer border-r border-vscode-border
            text-xs whitespace-nowrap shrink-0 group
            ${activeFileId === f.id ? 'active text-vscode-text bg-vscode-bg border-t-2 border-t-vscode-accent' : 'text-vscode-muted'}`}
        >
          <span className="text-[11px]">{getFileIcon(f.name)}</span>
          <span>{f.name}</span>
          {f.dirty && <span className="text-vscode-warning text-[8px] ml-0.5">●</span>}
          <button
            onClick={(e) => { e.stopPropagation(); closeTab(f.id) }}
            className="ml-1 w-4 h-4 rounded flex items-center justify-center text-vscode-muted
              opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-white transition-all text-[10px]"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
