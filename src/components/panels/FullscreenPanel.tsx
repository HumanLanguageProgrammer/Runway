import { useState } from "react"
import { Panel } from "./Panel"
import { X } from "lucide-react"

interface FullscreenPanelProps {
  children: React.ReactNode
  className?: string
  title?: string
  interactive?: boolean
}

export function FullscreenPanel({
  children,
  className = "",
  title,
  interactive = true
}: FullscreenPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 bg-background p-4 cursor-pointer"
        onClick={toggleFullscreen}
      >
        <Panel className="h-full w-full" title={title} interactive={interactive}>
          <button
            className="absolute top-3 right-3 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
            aria-label="Exit fullscreen"
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen()
            }}
          >
            <X className="h-5 w-5" />
          </button>
          {children}
        </Panel>
      </div>
    )
  }

  return (
    <Panel
      className={className}
      title={title}
      interactive={interactive}
      onClick={toggleFullscreen}
    >
      {children}
    </Panel>
  )
}
