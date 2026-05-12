import { useState } from 'react'
import { useStore } from '../store/useStore'
import { getUserRepos, getRepoContents, getFileContent, getLanguageFromPath, getFileIcon } from '../utils/github'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const { files, openFile, activeFileId, user, accessToken, githubRepo, setGithubRepo, repoFiles, setRepoFiles } = useStore()
  const [repos, setRepos]           = useState([])
  const [showRepos, setShowRepos]   = useState(false)
  const [loadingRepo, setLoadingRepo] = useState(false)
  const [expandedDirs, setExpandedDirs] = useState({})

  const loadRepos = async () => {
    if (!accessToken) return
    try {
      const data = await getUserRepos(accessToken)
      setRepos(data)
      setShowRepos(true)
    } catch {
      toast.error('Failed to load repositories')
    }
  }

  const selectRepo = async (repo) => {
    setLoadingRepo(true)
    setShowRepos(false)
    try {
      setGithubRepo(repo)
      const contents = await getRepoContents(accessToken, repo.owner.login, repo.name)
      setRepoFiles(contents)
      toast.success(`Opened ${repo.name}`)
    } catch {
      toast.error('Failed to load repo contents')
    }
    setLoadingRepo(false)
  }

  const openRepoFile = async (file) => {
    if (file.type === 'dir') {
      setExpandedDirs(d => ({ ...d, [file.path]: !d[file.path] }))
      if (!expandedDirs[file.path]) {
        const sub = await getRepoContents(accessToken, githubRepo.owner.login, githubRepo.name, file.path)
        setRepoFiles(prev => [...prev, ...sub])
      }
      return
    }
    try {
      const { content } = await getFileContent(accessToken, githubRepo.owner.login, githubRepo.name, file.path)
      const { addFile, openFile: of } = useStore.getState()
      const id = 'gh-' + file.sha
      addFile({ id, name: file.name, path: file.path, language: getLanguageFromPath(file.path), content, sha: file.sha })
      of(id)
    } catch {
      toast.error('Failed to open file')
    }
  }

  return (
    <div className="h-full bg-vscode-sidebar flex flex-col overflow-hidden text-xs text-vscode-text">
      {/* GitHub repo section */}
      <div className="p-2 border-b border-vscode-border shrink-0">
        <div className="text-vscode-muted uppercase tracking-wider text-[10px] px-1 mb-2">GitHub</div>
        {githubRepo ? (
          <div className="flex items-center gap-2 px-2 py-1.5 bg-vscode-active rounded">
            <span className="text-vscode-success">⎇</span>
            <span className="text-vscode-text truncate flex-1">{githubRepo.name}</span>
            <button onClick={() => { setGithubRepo(null); setRepoFiles([]) }} className="text-vscode-muted hover:text-vscode-error text-xs">✕</button>
          </div>
        ) : (
          <button
            onClick={loadRepos}
            className="w-full text-left px-2 py-1.5 rounded text-vscode-muted hover:bg-vscode-active hover:text-vscode-text transition-colors flex items-center gap-2"
          >
            <span>⎇</span> Open GitHub Repo
          </button>
        )}

        {showRepos && (
          <div className="mt-1 max-h-48 overflow-y-auto bg-vscode-bg border border-vscode-border rounded">
            {repos.map(r => (
              <button
                key={r.id}
                onClick={() => selectRepo(r)}
                className="w-full text-left px-3 py-1.5 hover:bg-vscode-active transition-colors flex items-center gap-2 truncate"
              >
                <span className="text-vscode-muted">📁</span>
                <span className="truncate">{r.name}</span>
                <span className="ml-auto text-vscode-muted shrink-0">{r.private ? '🔒' : '🌐'}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* File explorer */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-vscode-muted uppercase tracking-wider text-[10px] px-3 py-2">
          {githubRepo ? githubRepo.name : 'Explorer'}
        </div>

        {loadingRepo && (
          <div className="px-3 py-2 text-vscode-muted flex items-center gap-2">
            <div className="w-3 h-3 border border-vscode-accent border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        )}

        {githubRepo && repoFiles.length > 0 ? (
          repoFiles
            .filter(f => !f.path.includes('/') || expandedDirs[f.path.split('/').slice(0, -1).join('/')])
            .sort((a, b) => {
              if (a.type === 'dir' && b.type !== 'dir') return -1
              if (b.type === 'dir' && a.type !== 'dir') return 1
              return a.name.localeCompare(b.name)
            })
            .map(file => {
              const depth = file.path.split('/').length - 1
              return (
                <button
                  key={file.sha || file.path}
                  onClick={() => openRepoFile(file)}
                  className="w-full text-left flex items-center gap-1.5 px-2 py-0.5 hover:bg-vscode-active transition-colors"
                  style={{ paddingLeft: `${8 + depth * 12}px` }}
                >
                  <span className="shrink-0">
                    {file.type === 'dir'
                      ? (expandedDirs[file.path] ? '▾' : '▸')
                      : getFileIcon(file.name)}
                  </span>
                  <span className="truncate">{file.name}</span>
                </button>
              )
            })
        ) : !githubRepo ? (
          files.map(f => (
            <button
              key={f.id}
              onClick={() => openFile(f.id)}
              className={`w-full text-left flex items-center gap-1.5 px-4 py-0.5 transition-colors
                ${activeFileId === f.id ? 'bg-vscode-active text-white' : 'hover:bg-vscode-active/50'}`}
            >
              <span className="shrink-0 text-[11px]">{getFileIcon(f.name)}</span>
              <span className="truncate">{f.name}</span>
              {f.dirty && <span className="ml-auto text-vscode-warning text-[8px]">●</span>}
            </button>
          ))
        ) : null}
      </div>

      {/* User info */}
      {user && (
        <div className="p-2 border-t border-vscode-border shrink-0 flex items-center gap-2">
          <img src={user.avatar_url} alt={user.login} className="w-6 h-6 rounded-full" />
          <span className="text-vscode-muted text-[11px] truncate">{user.login}</span>
        </div>
      )}
    </div>
  )
}
