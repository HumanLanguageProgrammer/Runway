import { useState, useMemo, useCallback } from "react"
import type { PhaseConfiguration } from "@/config/supabase"
import { useAgent } from "@/hooks/useAgent"
import { useConversation } from "@/hooks/useConversation"
import { useKnowledgeRegistry } from "@/hooks/useKnowledgeRegistry"
import { NeutralGear } from "./NeutralGear"
import { GearOne } from "./GearOne"
import { GearTwo } from "./GearTwo"
import { GearThree } from "./GearThree"
import { GearFour } from "./GearFour"

interface VEPControllerProps {
  config: PhaseConfiguration | null
  loading: boolean
  error: Error | null
}

export function VEPController({ config, loading, error }: VEPControllerProps) {
  // UI-driven gear override (e.g., when mic is clicked or agent calls set_gear)
  const [gearOverride, setGearOverride] = useState<number | null>(null)

  // Load agent and assemble Master Frame
  const { masterFrame, agentLoading, agentError } = useAgent(
    config?.default_agent ?? null,
    config?.default_model ?? null
  )

  // Load knowledge registry and manage retrieved nodes
  const {
    knowledgeRegistry,
    retrievedNodes,
    displayedImage,
    registryLoading,
    registryError,
    loadNode,
    displayNode
  } = useKnowledgeRegistry(config?.default_agent ?? null)

  // Handler for agent-driven gear changes
  const handleSetGear = useCallback((gear: number) => {
    setGearOverride(gear)
  }, [])

  // Tool handlers for conversation
  const toolHandlers = useMemo(() => ({
    onSetGear: handleSetGear,
    onLoadNode: loadNode,
    onDisplayNode: displayNode
  }), [handleSetGear, loadNode, displayNode])

  // Conversation state management with knowledge context
  const { sendMessage, responseContent, isLoading: conversationLoading } = useConversation(
    masterFrame,
    config?.default_model ?? null,
    knowledgeRegistry,
    retrievedNodes,
    toolHandlers
  )

  // Show neutral gear during loading or if there's an error
  const combinedError = error || agentError || registryError
  if (loading || agentLoading || registryLoading || combinedError || !config) {
    return <NeutralGear error={combinedError} />
  }

  // Use override if set, otherwise use config
  const activeGear = gearOverride ?? config.initial_gear

  // Handler to switch to voice mode (Gear 4)
  const handleSwitchToVoice = () => {
    setGearOverride(4)
  }

  // Handler to return from voice mode to previous gear
  const handleSwitchToText = () => {
    setGearOverride(null)
  }

  // Conversation props for gears with text input
  const conversationProps = {
    sendMessage,
    responseContent,
    isLoading: conversationLoading
  }

  // Image props for gears with image display
  const imageProps = {
    imageUrl: displayedImage?.url ?? null,
    imageAlt: displayedImage?.alt ?? null
  }

  // Render appropriate gear based on active gear
  switch (activeGear) {
    case 1:
      return <GearOne config={config} onSwitchToVoice={handleSwitchToVoice} {...imageProps} />
    case 2:
      return <GearTwo config={config} onSwitchToVoice={handleSwitchToVoice} {...conversationProps} {...imageProps} />
    case 3:
      return <GearThree config={config} onSwitchToVoice={handleSwitchToVoice} {...conversationProps} {...imageProps} />
    case 4:
      return <GearFour config={config} onSwitchToText={handleSwitchToText} {...imageProps} />
    default:
      return <NeutralGear />
  }
}
