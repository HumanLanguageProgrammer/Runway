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
  // Show neutral gear during loading or if there's an error
  if (loading || error || !config) {
    return <NeutralGear error={error} />
  }

  // Render appropriate gear based on configuration
  switch (config.initial_gear) {
    case 1:
      return <GearOne config={config} />
    case 2:
      return <GearTwo config={config} />
    case 3:
      return <GearThree config={config} />
    case 4:
      return <GearFour config={config} />
    default:
      return <NeutralGear />
  }
}
