import { useStore } from '../store/useStore'

export default function StatusBar() {
  const { user, githubRepo, files, activeFileId } = useStore()
  const activeFile = files.find(f => f.id === activeFileId)

  return (
    <div className="h-6 bg-vscode-accent flex items-center px-3 gap-4 text-white text-[11px] shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 font-medium">
          ⎇ {githubRepo ? githubRepo.default_branch || 'main' : 'local'}
        </span>
        {githubRepo && (
          <span className="opacity-80">{githubRepo.full_name}</span>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center gap-3 opacity-90">
        <span>⚡ WebCode Studio</span>
        {user && (
          <span className="flex items-center gap-1">
            <img src={user.avatar_url} className="w-4 h-4 rounded-full" alt="" />
            {user.login}
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 opacity-90">
        {activeFile && (
          <>
            <span>{activeFile.language || 'text'}</span>
            <span>UTF-8</span>
            <span>Spaces: 2</span>
          </>
        )}
        <span>▲ Vercel</span>
      </div>
    </div>
  )
}
