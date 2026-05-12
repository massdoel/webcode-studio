import { useRef, useState, useCallback } from 'react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

const COMPONENTS = [
  { type: 'button',  label: 'Button',  icon: '⬜', defaultProps: { bg: '#569cd6', text: '#ffffff', fontSize: 13, radius: 8, content: 'Click me', w: 120, h: 40 } },
  { type: 'text',    label: 'Text',    icon: 'T',  defaultProps: { bg: 'transparent', text: '#111827', fontSize: 24, radius: 0, content: 'Heading', w: 280, h: 50 } },
  { type: 'input',   label: 'Input',   icon: '▭',  defaultProps: { bg: '#ffffff', text: '#374151', fontSize: 13, radius: 6, content: 'Placeholder...', w: 220, h: 38 } },
  { type: 'card',    label: 'Card',    icon: '▣',  defaultProps: { bg: '#ffffff', text: '#374151', fontSize: 13, radius: 12, w: 280, h: 140 } },
  { type: 'navbar',  label: 'Navbar',  icon: '▬',  defaultProps: { bg: '#1a1a2e', text: '#ffffff', fontSize: 14, radius: 0, w: 800, h: 52 } },
  { type: 'badge',   label: 'Badge',   icon: '◉',  defaultProps: { bg: '#e8f4fd', text: '#0c447c', fontSize: 11, radius: 20, content: 'New', w: 60, h: 24 } },
  { type: 'image',   label: 'Image',   icon: '🖼', defaultProps: { bg: '#e5e7eb', text: '#9ca3af', fontSize: 13, radius: 8, w: 200, h: 120 } },
  { type: 'divider', label: 'Divider', icon: '—',  defaultProps: { bg: '#e5e7eb', text: 'transparent', fontSize: 0, radius: 0, w: 400, h: 1 } },
]

export default function DesignPanel() {
  const { designElements, selectedElementId, selectElement, updateElement, addElement, removeElement, generateCodeFromDesign, addFile, openFile, files } = useStore()
  const canvasRef  = useRef(null)
  const dragRef    = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan]   = useState({ x: 60, y: 40 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart    = useRef(null)

  const startDrag = useCallback((e, id) => {
    e.stopPropagation()
    const el = designElements.find(el => el.id === id)
    if (!el) return
    selectElement(id)
    const startX = e.clientX - el.x * zoom - pan.x
    const startY = e.clientY - el.y * zoom - pan.y
    dragRef.current = { id, startX, startY }

    const onMove = (ev) => {
      if (!dragRef.current) return
      const nx = Math.round((ev.clientX - dragRef.current.startX - pan.x) / zoom)
      const ny = Math.round((ev.clientY - dragRef.current.startY - pan.y) / zoom)
      updateElement(id, { x: Math.max(0, nx), y: Math.max(0, ny) })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [designElements, zoom, pan, selectElement, updateElement])

  const onCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('design-canvas-grid')) {
      selectElement(null)
      setIsPanning(true)
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    }
  }
  const onCanvasMouseMove = (e) => {
    if (!isPanning || !panStart.current) return
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y })
  }
  const onCanvasMouseUp = () => { setIsPanning(false); panStart.current = null }

  const addComponent = (comp) => {
    const id = 'el-' + Date.now()
    addElement({
      id,
      type: comp.type,
      label: comp.label,
      x: Math.round(120 / zoom - pan.x / zoom),
      y: Math.round(80  / zoom - pan.y / zoom),
      w: comp.defaultProps.w,
      h: comp.defaultProps.h,
      props: { ...comp.defaultProps },
    })
  }

  const exportToCode = () => {
    const code = generateCodeFromDesign()
    const existing = files.find(f => f.name === 'DesignedPage.jsx')
    if (existing) {
      const { updateFileContent, openFile: of } = useStore.getState()
      updateFileContent(existing.id, code)
      of(existing.id)
    } else {
      const id = 'design-export-' + Date.now()
      addFile({ id, name: 'DesignedPage.jsx', path: 'src/DesignedPage.jsx', language: 'javascript', content: code })
    }
    toast.success('Exported to DesignedPage.jsx')
  }

  const renderElement = (el) => {
    const { props: p } = el
    const isSelected = selectedElementId === el.id
    const style = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.w,
      height: el.h,
      background: p.bg,
      color: p.text,
      fontSize: p.fontSize,
      borderRadius: p.radius,
      border: isSelected ? '1.5px solid #569cd6' : '1px solid transparent',
      cursor: 'move',
      display: 'flex',
      alignItems: 'center',
      justifyContent: el.type === 'text' ? 'flex-start' : 'center',
      overflow: 'hidden',
      userSelect: 'none',
      outline: isSelected ? '1px solid rgba(86,156,214,0.3)' : 'none',
      outlineOffset: 2,
      transition: 'border-color .1s, outline .1s',
    }

    const inner = (() => {
      switch (el.type) {
        case 'navbar':
          return (
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 20px', width:'100%', height:'100%' }}>
              <span style={{ fontWeight:600, color:p.text, fontSize:15 }}>{el.label}</span>
              {['Home','About','Docs'].map(m => (
                <span key={m} style={{ color: 'rgba(255,255,255,.65)', fontSize:12, marginLeft: m==='Home'?'auto':0 }}>{m}</span>
              ))}
              <span style={{ background:'#569cd6', color:'#fff', fontSize:11, padding:'4px 12px', borderRadius:20 }}>Sign in</span>
            </div>
          )
        case 'card':
          return (
            <div style={{ padding:16, width:'100%', height:'100%', border: '1px solid #e5e7eb', borderRadius: p.radius }}>
              <div style={{ fontWeight:500, fontSize:14, marginBottom:6 }}>{el.label}</div>
              <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.5 }}>Card content goes here. Double-click to edit.</div>
            </div>
          )
        case 'image':
          return (
            <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:4 }}>
              <div style={{ fontSize:24 }}>🖼</div>
              <div style={{ fontSize:11, color:'#9ca3af' }}>Image Placeholder</div>
            </div>
          )
        case 'divider':
          return <div style={{ width:'100%', height:1, background:p.bg }} />
        default:
          return <span style={{ fontWeight: el.type === 'button' ? 500 : 400, padding: el.type !== 'text' ? '0 12px' : '0 4px' }}>{p.content || el.label}</span>
      }
    })()

    return (
      <div key={el.id} style={style} onMouseDown={e => startDrag(e, el.id)}>
        {inner}
        {/* Resize handle */}
        {isSelected && (
          <>
            {[{t:-4,l:-4},{t:-4,r:-4},{b:-4,l:-4},{b:-4,r:-4}].map((pos, i) => (
              <div key={i} style={{ position:'absolute', width:7, height:7, background:'#569cd6', borderRadius:1, ...Object.fromEntries(Object.entries(pos).map(([k,v]) => [k,v])) }} />
            ))}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#181818]">
      {/* Design toolbar */}
      <div className="h-9 bg-vscode-panel border-b border-vscode-border flex items-center px-3 gap-2 shrink-0">
        <span className="text-vscode-muted text-xs">Design Panel</span>
        <div className="flex gap-1 ml-2">
          {['↖ Select','▭ Frame','T Text','✏ Pen'].map(t => (
            <button key={t} className="text-[11px] text-vscode-muted hover:text-vscode-text px-2 py-0.5 rounded hover:bg-white/5 transition-colors">{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setZoom(z => Math.min(z + .1, 3))} className="text-vscode-muted hover:text-white w-6 h-6 flex items-center justify-center hover:bg-white/5 rounded text-sm">+</button>
          <span className="text-vscode-muted text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.max(z - .1, .3))} className="text-vscode-muted hover:text-white w-6 h-6 flex items-center justify-center hover:bg-white/5 rounded text-sm">−</button>
          <button onClick={() => { setZoom(1); setPan({ x: 60, y: 40 }) }} className="text-vscode-muted hover:text-white text-xs px-2 py-0.5 border border-vscode-border rounded hover:bg-white/5 ml-1">Reset</button>
        </div>
        <button onClick={exportToCode} className="text-xs bg-vscode-accent text-white px-3 py-1 rounded hover:bg-blue-500 transition-colors ml-2 flex items-center gap-1">
          ⌥ Export Code
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Component panel */}
        <div className="w-28 bg-vscode-sidebar border-r border-vscode-border overflow-y-auto shrink-0 py-2">
          <div className="text-vscode-muted text-[10px] uppercase tracking-wider px-2 mb-2">Components</div>
          <div className="flex flex-col gap-1 px-1.5">
            {COMPONENTS.map(c => (
              <button
                key={c.type}
                onClick={() => addComponent(c)}
                className="comp-card flex items-center gap-2 p-1.5 rounded border border-vscode-border text-vscode-muted text-xs text-left"
              >
                <span className="text-base w-5 text-center shrink-0">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
          <div className="text-vscode-muted text-[10px] uppercase tracking-wider px-2 mt-4 mb-2">Layers</div>
          <div className="px-1">
            {designElements.map(el => (
              <button
                key={el.id}
                onClick={() => selectElement(el.id)}
                className={`layer-item w-full text-left flex items-center gap-1.5 px-2 py-1 rounded text-[11px] ${selectedElementId === el.id ? 'selected text-white' : 'text-vscode-muted'}`}
              >
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: el.props.bg === 'transparent' ? '#888' : el.props.bg }} />
                <span className="truncate">{el.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden relative"
          style={{ cursor: isPanning ? 'grabbing' : 'default' }}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          onMouseLeave={onCanvasMouseUp}
          onWheel={e => {
            e.preventDefault()
            if (e.ctrlKey) setZoom(z => Math.max(.3, Math.min(3, z - e.deltaY * .01)))
          }}
        >
          <div className="design-canvas-grid absolute inset-0 pointer-events-none" />

          {/* Frame */}
          <div style={{
            position: 'absolute',
            left: pan.x,
            top: pan.y,
            width: 800 * zoom,
            height: 620 * zoom,
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
            background: '#ffffff',
            border: '1px solid #444',
            borderRadius: 4,
          }}>
            <div style={{ position:'absolute', top:-18, left:0, fontSize:10, color:'#569cd6', whiteSpace:'nowrap', fontFamily:'monospace' }}>
              Landing Page — 1440px
            </div>
            {designElements.map(renderElement)}
          </div>
        </div>
      </div>
    </div>
  )
}
