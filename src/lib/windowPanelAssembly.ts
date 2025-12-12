import type { RegistryEntry, NodeContent } from '@/config/supabase'

/**
 * Assembles the Knowledge Context section of the Window Panel.
 * This includes the Knowledge Registry table and any Retrieved Nodes.
 */
export function assembleKnowledgeContext(
  registry: RegistryEntry[],
  retrieved: Map<string, NodeContent>
): string {
  if (registry.length === 0) {
    return ''
  }

  let context = '## Knowledge Registry\n\n'
  context += '| Node | Description | Status |\n'
  context += '|------|-------------|--------|\n'

  for (const entry of registry) {
    const status = entry.status === 'active' ? '● Active' : '○ Available'
    context += `| ${entry.node_key} | ${entry.description} | ${status} |\n`
  }

  context += '\n○ = Available (in library) | ● = Active (loaded)\n'

  if (retrieved.size > 0) {
    context += '\n## Retrieved Nodes\n'
    for (const [key, node] of retrieved) {
      context += `\n### ${key}\n\n${node.text_content}\n`
    }
  }

  return context
}

/**
 * Combines Master Frame with Knowledge Context to create the full system prompt.
 */
export function assembleFullSystemPrompt(
  masterFrame: string,
  knowledgeContext: string
): string {
  if (!knowledgeContext) {
    return masterFrame
  }

  return `${masterFrame}\n\n---\n\n${knowledgeContext}`
}
