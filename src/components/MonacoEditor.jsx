import { useRef } from 'react'
import Editor from '@monaco-editor/react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'
import { updateFile } from '../utils/github'

export default function MonacoEditor() {
  const { files, activeFileId, updateFileContent, saveFile, accessToken, githubRepo } = useStore()
  const editorRef = useRef(null)

  const activeFile = files.find(f => f.id === activeFileId)

  const handleSave = async () => {
    if (!activeFile) return
    if (githubRepo && activeFile.sha && accessToken) {
      try {
        await updateFile(
          accessToken,
          githubRepo.owner.login,
          githubRepo.name,
          activeFile.path,
          activeFile.content,
          activeFile.sha
        )
        toast.success(`Saved ${activeFile.name} to GitHub`)
      } catch {
        toast.error('Failed to save to GitHub')
      }
    } else {
      toast.success(`${activeFile.name} saved locally`)
    }
    saveFile(activeFileId)
  }

  if (!activeFile) return (
    <div className="flex-1 bg-vscode-bg flex items-center justify-center">
      <div className="text-center text-vscode-muted">
        <div className="text-4xl mb-3">⌨</div>
        <p className="text-sm">Open a file to start editing</p>
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-hidden relative">
      {/* Save button */}
      <div className="absolute top-2 right-3 z-10 flex gap-1">
        {activeFile.dirty && (
          <button
            onClick={handleSave}
            className="bg-vscode-accent text-white text-xs px-2 py-1 rounded hover:bg-blue-500 transition-colors"
          >
            Save {githubRepo ? '→ GitHub' : ''}
          </button>
        )}
      </div>

      <Editor
        height="100%"
        language={activeFile.language || 'javascript'}
        value={activeFile.content}
        theme="vs-dark"
        onChange={val => updateFileContent(activeFileId, val || '')}
        onMount={(editor) => {
          editorRef.current = editor
          editor.addCommand(
            // Ctrl+S / Cmd+S
            2097 /* KeyMod.CtrlCmd */ | 49 /* KeyCode.KeyS */,
            handleSave
          )
        }}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          lineHeight: 22,
          minimap: { enabled: true, scale: 1 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 2,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          suggest: { showKeywords: true },
          padding: { top: 8 },
        }}
      />
    </div>
  )
}
