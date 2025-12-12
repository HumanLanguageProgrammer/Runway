import { useState } from "react"
import { Panel } from "@/components/panels/Panel"
import { FullscreenPanel } from "@/components/panels/FullscreenPanel"
import { AutoTextarea } from "@/components/ui/auto-textarea"
import { Mic, ArrowUp, ChevronRight, Loader2 } from "lucide-react"
import type { PhaseConfiguration } from "@/config/supabase"

interface GearThreeProps {
  config: PhaseConfiguration
  onSwitchToVoice?: () => void
  sendMessage?: (message: string) => Promise<void>
  responseContent?: string
  isLoading?: boolean
  imageUrl?: string | null
  imageAlt?: string | null
}

export function GearThree({ config: _config, onSwitchToVoice, sendMessage, responseContent, isLoading, imageUrl, imageAlt }: GearThreeProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev)
  }

  const handleSend = async () => {
    if (!inputValue.trim() || !sendMessage || isLoading) return
    const message = inputValue
    setInputValue("")
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full w-full bg-background p-4 flex flex-col gap-3 overflow-hidden">
      {/* Main Content - Inverted layout: Response dominant (left), Image small (right) */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Response on left - takes flex-1, always visible */}
        <Panel
          className={isFullScreen ? "flex-1 min-h-0" : "flex-1 min-h-0"}
          title="LLM Generated Response"
          onClick={toggleFullScreen}
          interactive
        >
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            ) : responseContent ? (
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {responseContent}
              </p>
            ) : (
              <>
                <p className="text-foreground leading-relaxed mb-4">
                  Welcome to the Learning Lab's Deep Dive mode. This configuration prioritizes extended text engagement, allowing for more detailed explanations and deeper dialogue.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  The text area takes priority in this layout, providing more space for comprehensive responses while the image serves as a smaller visual reference.
                </p>
                <p className="text-foreground leading-relaxed">
                  Feel free to explore complex topics here. This mode is designed for sustained, in-depth learning conversations.
                </p>
              </>
            )}
          </div>
        </Panel>

        {/* Image on right - narrower, hides when response expands */}
        {!isFullScreen && (
          <FullscreenPanel className="w-56 min-w-0">
            <div className="flex-1 flex items-center justify-center h-full">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={imageAlt || 'Display image'}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-muted/50 flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="text-xs">Image Thumbnail</p>
                </div>
              )}
            </div>
          </FullscreenPanel>
        )}
      </div>

      {/* Text Input Panel - with activation effect */}
      <Panel className="shrink-0 py-2 px-3" interactive>
        <div className="flex items-end gap-2">
          <AutoTextarea
            placeholder="Type your message..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0 py-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            onClick={onSwitchToVoice}
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors shrink-0"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
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
