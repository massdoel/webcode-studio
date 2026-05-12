import { useEffect } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { useStore } from '../store/useStore'
import TitleBar from '../components/TitleBar'
import ActivityBar from '../components/ActivityBar'
import Sidebar from '../components/Sidebar'
import EditorTabs from '../components/EditorTabs'
import MonacoEditor from '../components/MonacoEditor'
import DesignPanel from '../components/DesignPanel'
import PropertiesPanel from '../components/PropertiesPanel'
import TerminalPanel from '../components/TerminalPanel'
import StatusBar from '../components/StatusBar'

export default function EditorPage() {
  const { mode, setUser } = useStore()

  useEffect(() => {
    const token = localStorage.getItem('wcs_token')
    const user  = localStorage.getItem('wcs_user')
    if (token && user) setUser(JSON.parse(user), token)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-vscode-bg select-none overflow-hidden">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />

        <PanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          <Panel defaultSize={16} minSize={12} maxSize={28}>
            <Sidebar />
          </Panel>

          <PanelResizeHandle className="resize-handle w-[2px] bg-vscode-border hover:bg-vscode-accent transition-colors" />

          {/* Main area */}
          <Panel defaultSize={mode === 'split' ? 52 : mode === 'code' ? 84 : 0} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={72} minSize={40}>
                <div className="flex flex-col h-full">
                  <EditorTabs />
                  <MonacoEditor />
                </div>
              </Panel>
              <PanelResizeHandle className="resize-handle h-[2px] bg-vscode-border hover:bg-vscode-accent transition-colors" />
              <Panel defaultSize={28} minSize={15} maxSize={45}>
                <TerminalPanel />
              </Panel>
            </PanelGroup>
          </Panel>

          {/* Design panel */}
          {mode !== 'code' && (
            <>
              <PanelResizeHandle className="resize-handle w-[2px] bg-vscode-border hover:bg-vscode-accent transition-colors" />
              <Panel defaultSize={mode === 'design' ? 84 : 32} minSize={24}>
                <PanelGroup direction="horizontal">
                  <Panel defaultSize={78} minSize={60}>
                    <DesignPanel />
                  </Panel>
                  <PanelResizeHandle className="resize-handle w-[2px] bg-vscode-border hover:bg-vscode-accent transition-colors" />
                  <Panel defaultSize={22} minSize={18} maxSize={32}>
                    <PropertiesPanel />
                  </Panel>
                </PanelGroup>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      <StatusBar />
    </div>
  )
}
