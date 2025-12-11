import { useConfiguration } from "@/hooks/useConfiguration"
import { VEPController } from "@/components/vep/VEPController"

function App() {
  const { config, loading, error } = useConfiguration('checkin')

  return (
    <div className="h-full w-full">
      <VEPController config={config} loading={loading} error={error} />
    </div>
  )
}

export default App
