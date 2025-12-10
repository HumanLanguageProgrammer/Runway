import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PanelProps {
  children?: ReactNode
  className?: string
  title?: string
  onClick?: () => void
  interactive?: boolean
}

export function Panel({ children, className, title, onClick, interactive }: PanelProps) {
  const isClickable = onClick || interactive

  return (
    <div
      onClick={onClick}
      className={cn(
        "border-2 border-border rounded-lg bg-card p-4 flex flex-col",
        isClickable && [
          "cursor-pointer",
          "transition-all duration-200 ease-out",
          "hover:border-[3px] hover:border-primary/50",
          "hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]",
          "active:scale-[0.995]",
          "active:border-primary/70",
        ],
        className
      )}
    >
      {title && (
        <div className="text-sm font-medium text-muted-foreground mb-2">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
