import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'

const COMMANDS = {
  help: () => [
    { type: 'output', text: 'Available commands:' },
    { type: 'output', text: '  npm run dev       — Start dev server' },
    { type: 'output', text: '  npm run build     — Build for production' },
    { type: 'output', text: '  git status        — Show git status' },
    { type: 'output', text: '  git commit -m ""  — Commit changes' },
    { type: 'output', text: '  clear             — Clear terminal' },
    { type: 'output', text: '  whoami            — Show current user' },
  ],
  'npm run dev': () => [
    { type: 'output', text: '' },
    { type: 'output', text: '  VITE v5.1.0  ready in 312 ms' },
    { type: 'success', text: '  ➜  Local:   http://localhost:5173/' },
    { type: 'success', text: '  ➜  Network: http://192.168.1.1:5173/' },
  ],
  'npm run build': () => [
    { type: 'output', text: 'vite v5.1.0 building for production...' },
    { type: 'output', text: '✓ 42 modules transformed.' },
    { type: 'success', text: 'dist/index.html        1.23 kB' },
    { type: 'success', text: 'dist/assets/index.js   245.10 kB' },
    { type: 'success', text: 'dist/assets/index.css  18.40 kB' },
    { type: 'success', text: '✓ built in 1.34s' },
  ],
  'git status': () => [
    { type: 'success', text: 'On branch main' },
    { type: 'output', text: 'Changes not staged for commit:' },
    { type: 'warning', text: '  modified:   src/App.jsx' },
    { type: 'warning', text: '  modified:   src/components/DesignPanel.jsx' },
  ],
  whoami: (user) => [
    { type: 'success', text: user?.login || 'anonymous' },
  ],
  ls: () => [
    { type: 'output', text: 'api/  node_modules/  public/  src/  dist/' },
    { type: 'output', text: '.env  index.html  package.json  vite.config.js  vercel.json' },
  ],
  pwd: () => [{ type: 'output', text: '/home/user/webcode-studio' }],
  clear: () => null,
}

export default function TerminalPanel() {
  const { terminalLogs, addTerminalLog, user } = useStore()
  const [input, setInput]    = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [activeTab, setTab]  = useState('terminal')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLogs])

  const runCommand = (cmd) => {
    const trimmed = cmd.trim()
    addTerminalLog({ type: 'command', text: trimmed })
    setHistory(h => [trimmed, ...h])
    setHistIdx(-1)

    if (trimmed === 'clear') {
      useStore.setState({ terminalLogs: [{ type: 'system', text: 'Terminal cleared.' }] })
      return
    }

    const handler = COMMANDS[trimmed]
    if (handler) {
      const results = handler(user)
      if (results) results.forEach(r => addTerminalLog(r))
    } else if (trimmed) {
      addTerminalLog({ type: 'error', text: `command not found: ${trimmed}` })
      addTerminalLog({ type: 'output', text: "Type 'help' for available commands." })
    }
    addTerminalLog({ type: 'prompt', text: '' })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  const colorMap = {
    system:  '#858585',
    output:  '#d4d4d4',
    success: '#4ec9b0',
    warning: '#dcdcaa',
    error:   '#f44747',
    command: '#569cd6',
    prompt:  '#858585',
  }

  const TABS = ['terminal', 'output', 'problems', 'ports']

  return (
    <div className="h-full flex flex-col bg-vscode-bg border-t border-vscode-border">
      {/* Tab bar */}
      <div className="flex items-center bg-vscode-panel border-b border-vscode-border px-2 shrink-0" style={{minHeight:30}}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs capitalize transition-colors ${activeTab === t ? 'text-vscode-text border-b border-vscode-accent' : 'text-vscode-muted hover:text-vscode-text'}`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => useStore.setState({ terminalLogs: [{ type: 'system', text: 'Terminal cleared.' }, { type: 'prompt', text: '' }] })}
            className="text-vscode-muted hover:text-vscode-text text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors"
            title="Clear"
          >⊘</button>
        </div>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-xs" style={{ lineHeight: 1.8 }}>
        {terminalLogs.map((log, i) => (
          <div key={i} style={{ color: colorMap[log.type] || '#d4d4d4', display: 'flex', alignItems: 'baseline', gap: 6 }}>
            {log.type === 'command' && <span style={{ color: '#4ec9b0' }}>$ </span>}
            {log.type === 'prompt'  && <span style={{ color: '#4ec9b0' }}>user@webcode-studio:~$ </span>}
            <span>{log.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-t border-vscode-border shrink-0">
        <span className="font-mono text-xs text-vscode-success">$</span>
        <input
          className="flex-1 bg-transparent font-mono text-xs text-vscode-text outline-none placeholder-vscode-muted"
          placeholder="Enter command..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
