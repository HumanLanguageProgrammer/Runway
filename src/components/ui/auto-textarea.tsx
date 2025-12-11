import * as React from "react"
import { cn } from "@/lib/utils"

export interface AutoTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const AutoTextarea = React.forwardRef<HTMLTextAreaElement, AutoTextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const adjustHeight = () => {
      const textarea = textareaRef.current
      if (textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto'
        // Set height to scrollHeight, with min of 40px and max of 200px
        const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 200)
        textarea.style.height = `${newHeight}px`
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustHeight()
      onChange?.(e)
    }

    // Set ref and handle both internal and forwarded refs
    const setRefs = (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    // Adjust on mount
    React.useEffect(() => {
      adjustHeight()
    }, [])

    return (
      <textarea
        ref={setRefs}
        rows={1}
        className={cn(
          "flex w-full resize-none rounded-md bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
AutoTextarea.displayName = "AutoTextarea"

export { AutoTextarea }
