import { create } from 'zustand'

const DEFAULT_FILES = [
  {
    id: 'f1',
    name: 'App.jsx',
    path: 'src/App.jsx',
    language: 'javascript',
    content: `import { useState } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to WebCode Studio
        </h1>
        <p className="text-gray-600 mb-8">
          Edit this file and see changes live
        </p>
        <button
          onClick={() => setCount(c => c + 1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Count: {count}
        </button>
      </div>
    </div>
  )
}`,
  },
  {
    id: 'f2',
    name: 'index.css',
    path: 'src/index.css',
    language: 'css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}`,
  },
  {
    id: 'f3',
    name: 'package.json',
    path: 'package.json',
    language: 'json',
    content: `{
  "name": "my-app",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
  },
  {
    id: 'f4',
    name: 'vercel.json',
    path: 'vercel.json',
    language: 'json',
    content: `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`,
  },
]

const DESIGN_ELEMENTS_DEFAULT = [
  {
    id: 'el-nav',
    type: 'navbar',
    label: 'Navbar',
    x: 0, y: 0, w: 800, h: 52,
    props: { bg: '#1a1a2e', text: '#ffffff', fontSize: 14, radius: 0 },
  },
  {
    id: 'el-hero',
    type: 'text',
    label: 'Hero Title',
    x: 60, y: 100, w: 500, h: 70,
    props: { bg: 'transparent', text: '#111827', fontSize: 36, radius: 0, content: 'Build something amazing' },
  },
  {
    id: 'el-btn',
    type: 'button',
    label: 'CTA Button',
    x: 60, y: 192, w: 148, h: 42,
    props: { bg: '#569cd6', text: '#ffffff', fontSize: 13, radius: 8, content: 'Get Started' },
  },
  {
    id: 'el-card',
    type: 'card',
    label: 'Feature Card',
    x: 60, y: 264, w: 680, h: 130,
    props: { bg: '#f9fafb', text: '#374151', fontSize: 13, radius: 10 },
  },
]

export const useStore = create((set, get) => ({
  // Auth
  user: null,
  accessToken: null,
  setUser: (user, token) => set({ user, accessToken: token }),
  logout: () => set({ user: null, accessToken: null }),

  // Panel mode: 'code' | 'design' | 'split'
  mode: 'split',
  setMode: (mode) => set({ mode }),

  // Active tab: 'code' | 'design' | 'terminal' | 'git'
  activePanel: 'code',
  setActivePanel: (p) => set({ activePanel: p }),

  // Files
  files: DEFAULT_FILES,
  openTabs: ['f1'],
  activeFileId: 'f1',

  openFile: (id) => {
    const { openTabs } = get()
    if (!openTabs.includes(id)) set({ openTabs: [...openTabs, id] })
    set({ activeFileId: id })
  },
  closeTab: (id) => {
    const { openTabs, activeFileId } = get()
    const next = openTabs.filter(t => t !== id)
    set({
      openTabs: next,
      activeFileId: activeFileId === id ? (next[next.length - 1] || null) : activeFileId,
    })
  },
  updateFileContent: (id, content) => {
    set(s => ({ files: s.files.map(f => f.id === id ? { ...f, content, dirty: true } : f) }))
  },
  saveFile: (id) => {
    set(s => ({ files: s.files.map(f => f.id === id ? { ...f, dirty: false } : f) }))
  },
  addFile: (file) => {
    set(s => ({ files: [...s.files, file], openTabs: [...s.openTabs, file.id], activeFileId: file.id }))
  },

  // GitHub
  githubRepo: null,
  setGithubRepo: (repo) => set({ githubRepo: repo }),
  repoFiles: [],
  setRepoFiles: (files) => set({ repoFiles: files }),

  // Design
  designElements: DESIGN_ELEMENTS_DEFAULT,
  selectedElementId: null,
  selectElement: (id) => set({ selectedElementId: id }),
  updateElement: (id, patch) => {
    set(s => ({
      designElements: s.designElements.map(el =>
        el.id === id ? { ...el, ...patch, props: patch.props ? { ...el.props, ...patch.props } : el.props } : el
      ),
    }))
  },
  addElement: (el) => set(s => ({ designElements: [...s.designElements, el], selectedElementId: el.id })),
  removeElement: (id) => set(s => ({
    designElements: s.designElements.filter(e => e.id !== id),
    selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
  })),
  generateCodeFromDesign: () => {
    const els = get().designElements
    const lines = ["import React from 'react'", '', 'export default function DesignedPage() {', '  return (', '    <div className="relative w-full min-h-screen bg-white">']
    els.forEach(el => {
      const { props: p, label } = el
      const style = `style={{ position:'absolute', left:${el.x}, top:${el.y}, width:${el.w}, height:${el.h}, background:'${p.bg}', color:'${p.text}', fontSize:${p.fontSize}, borderRadius:${p.radius} }}`
      lines.push(`      {/* ${label} */}`)
      if (el.type === 'button')
        lines.push(`      <button ${style} className="cursor-pointer">${p.content || label}</button>`)
      else if (el.type === 'text')
        lines.push(`      <h1 ${style}>${p.content || label}</h1>`)
      else
        lines.push(`      <div ${style}></div>`)
    })
    lines.push('    </div>', '  )', '}')
    return lines.join('\n')
  },

  // Terminal logs
  terminalLogs: [
    { type: 'system', text: 'WebCode Studio Terminal v1.0' },
    { type: 'system', text: 'Type "help" for available commands.' },
    { type: 'prompt', text: '' },
  ],
  addTerminalLog: (log) => set(s => ({ terminalLogs: [...s.terminalLogs, log] })),
}))
