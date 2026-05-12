import { useStore } from '../store/useStore'

function PropRow({ label, children }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 gap-2">
      <span className="text-vscode-muted text-[11px] min-w-[40px] shrink-0">{label}</span>
      {children}
    </div>
  )
}

export default function PropertiesPanel() {
  const { designElements, selectedElementId, updateElement, removeElement } = useStore()
  const el = designElements.find(e => e.id === selectedElementId)

  const upd = (patch) => updateElement(el.id, patch)
  const updProp = (key, val) => updateElement(el.id, { props: { [key]: val } })

  return (
    <div className="h-full bg-vscode-sidebar flex flex-col overflow-y-auto text-xs text-vscode-text border-l border-vscode-border">
      <div className="px-3 py-2 border-b border-vscode-border text-[10px] uppercase tracking-wider text-vscode-muted flex items-center justify-between shrink-0">
        <span>Properties</span>
        {el && (
          <button onClick={() => removeElement(el.id)} className="text-vscode-error hover:text-red-400 transition-colors" title="Delete element">✕</button>
        )}
      </div>

      {!el ? (
        <div className="flex-1 flex items-center justify-center text-vscode-muted text-[11px] p-4 text-center">
          Select an element to edit its properties
        </div>
      ) : (
        <>
          {/* Element name */}
          <div className="px-3 py-2 border-b border-vscode-border">
            <div className="text-vscode-accent text-xs font-medium">{el.label}</div>
            <div className="text-vscode-muted text-[10px]">{el.type}</div>
          </div>

          {/* Position & Size */}
          <div className="py-1 border-b border-vscode-border">
            <div className="text-[10px] uppercase tracking-wider text-vscode-muted px-3 pt-2 pb-1">Layout</div>
            <div className="grid grid-cols-2 gap-0">
              <PropRow label="X">
                <input className="prop-input" type="number" value={el.x} onChange={e => upd({ x: +e.target.value })} />
              </PropRow>
              <PropRow label="Y">
                <input className="prop-input" type="number" value={el.y} onChange={e => upd({ y: +e.target.value })} />
              </PropRow>
              <PropRow label="W">
                <input className="prop-input" type="number" value={el.w} onChange={e => upd({ w: +e.target.value })} />
              </PropRow>
              <PropRow label="H">
                <input className="prop-input" type="number" value={el.h} onChange={e => upd({ h: +e.target.value })} />
              </PropRow>
            </div>
          </div>

          {/* Fill */}
          <div className="py-1 border-b border-vscode-border">
            <div className="text-[10px] uppercase tracking-wider text-vscode-muted px-3 pt-2 pb-1">Fill</div>
            <PropRow label="Color">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="color"
                  value={el.props.bg === 'transparent' ? '#ffffff' : el.props.bg}
                  onChange={e => updProp('bg', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-vscode-border bg-transparent"
                />
                <input
                  className="prop-input flex-1"
                  value={el.props.bg}
                  onChange={e => updProp('bg', e.target.value)}
                />
              </div>
            </PropRow>
          </div>

          {/* Typography */}
          <div className="py-1 border-b border-vscode-border">
            <div className="text-[10px] uppercase tracking-wider text-vscode-muted px-3 pt-2 pb-1">Typography</div>
            <PropRow label="Color">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="color"
                  value={el.props.text}
                  onChange={e => updProp('text', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-vscode-border bg-transparent"
                />
                <input
                  className="prop-input flex-1"
                  value={el.props.text}
                  onChange={e => updProp('text', e.target.value)}
                />
              </div>
            </PropRow>
            <PropRow label="Size">
              <input className="prop-input" type="number" value={el.props.fontSize} onChange={e => updProp('fontSize', +e.target.value)} />
            </PropRow>
            {el.props.content !== undefined && (
              <PropRow label="Text">
                <input className="prop-input" value={el.props.content} onChange={e => updProp('content', e.target.value)} />
              </PropRow>
            )}
          </div>

          {/* Border */}
          <div className="py-1 border-b border-vscode-border">
            <div className="text-[10px] uppercase tracking-wider text-vscode-muted px-3 pt-2 pb-1">Border</div>
            <PropRow label="Radius">
              <div className="flex items-center gap-2 flex-1">
                <input type="range" min="0" max="50" step="1" value={el.props.radius}
                  onChange={e => updProp('radius', +e.target.value)}
                  className="flex-1 accent-vscode-accent"
                />
                <span className="text-vscode-muted text-[11px] w-7 text-right">{el.props.radius}</span>
              </div>
            </PropRow>
          </div>

          {/* Tailwind code preview */}
          <div className="p-3">
            <div className="text-[10px] uppercase tracking-wider text-vscode-muted mb-2">Tailwind Preview</div>
            <div className="bg-vscode-bg border border-vscode-border rounded p-2 font-mono text-[10px] text-vscode-muted leading-5">
              <span className="text-vscode-keyword">&lt;div</span><br />
              <span className="ml-2 text-vscode-warning">className</span>
              <span className="text-vscode-muted">&#61;</span>
              <span className="text-vscode-string">&#34;w-[{el.w}px] h-[{el.h}px]</span><br />
              <span className="text-vscode-string ml-4">rounded-[{el.props.radius}px]&#34;</span><br />
              <span className="text-vscode-keyword">&gt;</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
