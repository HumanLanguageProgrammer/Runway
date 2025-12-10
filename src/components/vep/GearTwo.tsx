import { useState } from "react"
import { Panel } from "@/components/panels/Panel"
import { FullscreenPanel } from "@/components/panels/FullscreenPanel"
import { AutoTextarea } from "@/components/ui/auto-textarea"
import { Mic, ArrowUp, ChevronRight } from "lucide-react"
import type { PhaseConfiguration } from "@/config/supabase"

interface GearTwoProps {
  config: PhaseConfiguration
  onSwitchToVoice?: () => void
}

export function GearTwo({ config: _config, onSwitchToVoice }: GearTwoProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev)
  }

  return (
    <div className="h-full w-full bg-background p-4 flex flex-col gap-3 overflow-hidden">
      {/* Main Content - Horizontal Split */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Image on left - hides when response expands */}
        {!isFullScreen && (
          <FullscreenPanel className="flex-1 min-w-0">
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <p className="text-sm">Image Display Area</p>
              </div>
            </div>
          </FullscreenPanel>
        )}

        {/* Response on right - expands to full width */}
        <Panel
          className={isFullScreen ? "flex-1 min-h-0" : "w-80 min-h-0"}
          title="LLM Generated Response"
          onClick={toggleFullScreen}
          interactive
        >
          <div className="flex-1 overflow-auto">
            <p className="text-foreground leading-relaxed">
              Welcome to the Learning Lab. I'm here to guide your journey through cognitive systems and AI. Feel free to ask anything or type your question below.
            </p>
          </div>
        </Panel>
      </div>

      {/* Text Input Panel - with activation effect */}
      <Panel className="shrink-0 py-2 px-3" interactive>
        <div className="flex items-end gap-2">
          <AutoTextarea
            placeholder="Type your message..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0 py-2"
          />
          <button
            onClick={onSwitchToVoice}
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors shrink-0"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0">
            <ArrowUp className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors shrink-0">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Panel>

      {/* Status Bar - expandable to fullscreen */}
      <FullscreenPanel className="shrink-0 py-2 px-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Librarian: <span className="text-foreground">Sage</span></span>
            <span>Powered by Claude Sonnet 4.5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Fuel:</span>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-primary rounded-full" />
            </div>
            <span className="text-xs">80%</span>
          </div>
        </div>
      </FullscreenPanel>
    </div>
  )
}
