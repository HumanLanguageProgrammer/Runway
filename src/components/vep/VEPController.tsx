import { useState } from "react"
import type { PhaseConfiguration } from "@/config/supabase"
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
  // UI-driven gear override (e.g., when mic is clicked)
  const [gearOverride, setGearOverride] = useState<number | null>(null)

  // Show neutral gear during loading or if there's an error
  if (loading || error || !config) {
    return <NeutralGear error={error} />
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

  // Render appropriate gear based on active gear
  switch (activeGear) {
    case 1:
      return <GearOne config={config} onSwitchToVoice={handleSwitchToVoice} />
    case 2:
      return <GearTwo config={config} onSwitchToVoice={handleSwitchToVoice} />
    case 3:
      return <GearThree config={config} onSwitchToVoice={handleSwitchToVoice} />
    case 4:
      return <GearFour config={config} onSwitchToText={handleSwitchToText} />
    default:
      return <NeutralGear />
  }
}
