import { Panel } from "@/components/panels/Panel"
import { FullscreenPanel } from "@/components/panels/FullscreenPanel"

interface NeutralGearProps {
  error?: Error | null
}

export function NeutralGear({ error }: NeutralGearProps) {
  return (
    <div className="h-full w-full bg-background p-4 flex flex-col gap-3 overflow-hidden">
      {/* Display Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        <Panel className="flex-1 min-w-0 flex items-center justify-center">
          <div className="text-center">
            {error ? (
              <>
                <div className="text-lg font-medium text-destructive mb-2">
                  Unable to connect
                </div>
                <div className="text-sm text-muted-foreground">
                  {error.message}
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-medium text-muted-foreground mb-2">
                  Loading...
                </div>
                <div className="text-sm text-muted-foreground">
                  Connecting to Learning Lab
                </div>
              </>
            )}
          </div>
        </Panel>
      </div>

      {/* Input Area Placeholder */}
      <Panel className="shrink-0 py-3 px-4">
        <div className="h-6 bg-muted/30 rounded animate-pulse" />
      </Panel>

      {/* Status Area - expandable to fullscreen */}
      <FullscreenPanel className="shrink-0 py-2 px-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Initializing...</span>
          <span className="text-xs">Please wait</span>
        </div>
      </FullscreenPanel>
    </div>
  )
}
