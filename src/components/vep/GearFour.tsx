import { Panel } from "@/components/panels/Panel"
import { FullscreenPanel } from "@/components/panels/FullscreenPanel"
import { Mic, Keyboard, ChevronRight } from "lucide-react"
import type { PhaseConfiguration } from "@/config/supabase"

interface GearFourProps {
  config: PhaseConfiguration
  onSwitchToText?: () => void
}

export function GearFour({ config: _config, onSwitchToText }: GearFourProps) {
  return (
    <div className="h-full w-full bg-background p-4 flex flex-col gap-3 overflow-hidden">
      {/* Large Image Display at top - Voice mode: no text panel */}
      <FullscreenPanel className="flex-1 min-h-0">
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <span className="text-6xl">🎙️</span>
            </div>
            <p className="text-lg font-medium">Voice Mode Active</p>
            <p className="text-sm mt-2">Tap the microphone to begin speaking</p>
          </div>
        </div>
      </FullscreenPanel>

      {/* Voice Input Panel - with activation effect */}
      <Panel className="shrink-0 py-3 px-4" interactive>
        <div className="flex items-center justify-center relative">
          {/* Return to Text - Absolute positioned left */}
          <button
            onClick={onSwitchToText}
            className="absolute left-4 p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Return to text input"
          >
            <Keyboard className="h-7 w-7" />
          </button>

          {/* Centered Mic Button */}
          <button className="p-3 rounded-full border-2 border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <Mic className="h-6 w-6" />
          </button>

          {/* Next - Absolute positioned right */}
          <button className="absolute right-4 p-2 text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </Panel>

      {/* Status Bar - expandable to fullscreen */}
      <FullscreenPanel className="shrink-0 py-2 px-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Librarian: <span className="text-foreground">Sage</span></span>
            <span>Voice Mode</span>
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
