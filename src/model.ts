export type BotId = 'scout' | 'dash' | 'ledger' | 'bloom' | 'orbit'
export type SpecialistId = BotId

export type LegacySnapshot = {
  id: string; title: string; specialist: BotId; brief: string; sources: string; tokens: string; entryMin: string; entryMax: string
  liquidity: string; age: string; budget: string; exits: string; launchCriteria: string; reviewPermission: boolean; updatedAt: string
}
export type SourceItem = { id: string; url: string; note: string }
export type QuestionItem = { id: string; text: string; resolved: boolean }
export type AllocationItem = { id: string; label: string; percent: string }
export type ChecklistItem = { id: string; label: string; complete: boolean }
export type HandoffTask = { id: string; title: string; brief: string; targetBot: Exclude<BotId, 'orbit'>; linkedDocumentId: string; status: 'todo' | 'in-progress' | 'done'; priority: '' | 'low' | 'medium' | 'high' }
export type SavedNote = { label: string; value: string }

export type ScoutConfig = { kind: 'scout'; topic: string; network: string; observedAssets: string; sources: SourceItem[]; questions: QuestionItem[]; findings: string; conclusion: string }
export type DashConfig = { kind: 'dash'; network: string; targets: string; marketCapMin: string; marketCapMax: string; liquidityMin: string; maxAgeHours: string; entrySize: string; entryCurrency: string; maxSlippage: string; exclusions: string; candidate: { marketCap: string; liquidity: string; ageHours: string } }
export type LedgerConfig = { kind: 'ledger'; assetPair: string; network: string; direction: '' | 'long' | 'short'; timeframe: string; signals: string; entryConditions: string; invalidation: string; entryPrice: string; stopPrice: string; targetPrice: string; size: string; sizeCurrency: string; rules: string }
export type BloomConfig = { kind: 'bloom'; tokenName: string; symbol: string; network: string; description: string; supply: string; allocations: AllocationItem[]; plannedLiquidity: string; liquidityCurrency: string; links: string; checklist: ChecklistItem[] }
export type OrbitConfig = { kind: 'orbit'; goal: string; tasks: HandoffTask[]; reviewNotes: string }
export type BotConfig = ScoutConfig | DashConfig | LedgerConfig | BloomConfig | OrbitConfig

export type WorkspaceDocument = { id: string; title: string; botId: BotId; brief: string; reviewPermission: boolean; config: BotConfig; updatedAt: string; legacySnapshot?: LegacySnapshot; savedNotes?: SavedNote[] }
export type WorkspaceStore = { version: 2; documents: WorkspaceDocument[]; activeId: string | null; selectedBot: BotId }

export const specialists = [
  { id: 'orbit', name: 'Orbit', role: 'Orchestrator', line: 'The brain that keeps your crypto crew moving.', bio: 'Orbit turns one objective into specialist jobs, linked setups, and clear handoffs across the whole crew.', note: 'Good at the big picture. Even better at clear handoffs.', capabilities: ['Goal planning', 'Specialist handoffs', 'Linked setup progress'] },
  { id: 'scout', name: 'Scout', role: 'Research', line: 'Finds the context behind every crypto question.', bio: 'Scout organizes the topic, sources, open questions, observed assets, findings, and conclusion in one research setup.', note: 'Curious about everything. Careful about what makes the list.', capabilities: ['Source notes', 'Research questions', 'Written findings'] },
  { id: 'dash', name: 'Dash', role: 'Sniper', line: 'Built for entries that need quick instincts.', bio: 'Dash is your sniper for targets, market filters, entry size, slippage, exclusions, and fast candidate checks.', note: 'Quick to scan. Strict about missing inputs.', capabilities: ['Entry criteria', 'Candidate check', 'Exclusion notes'] },
  { id: 'ledger', name: 'Ledger', role: 'Trader', line: 'Turns signals into trades that follow your rules.', bio: 'Ledger keeps the pair, timeframe, signals, entry conditions, invalidation, exits, and position plan together.', note: 'Calm with numbers. Fond of explicit invalidation.', capabilities: ['Signals and rules', 'Long or short setup', 'Reward to risk'] },
  { id: 'bloom', name: 'Bloom', role: 'Launch', line: 'Gets your token ready for its first day.', bio: 'Bloom shapes your token identity, supply, allocation, liquidity, links, and preparation tasks into a launch brief.', note: 'Bright, practical, and ready with a checklist.', capabilities: ['Token brief', 'Allocation plan', 'Launch checklist'] },
] as const

export const specialistById = new Map(specialists.map((item) => [item.id, item]))
export const BOT_IDS = specialists.map((item) => item.id) as BotId[]
export const isBotId = (value: unknown): value is BotId => typeof value === 'string' && BOT_IDS.includes(value as BotId)
export const newId = () => crypto.randomUUID()

export function makeConfig(botId: BotId): BotConfig {
  if (botId === 'scout') return { kind: 'scout', topic: '', network: '', observedAssets: '', sources: [], questions: [], findings: '', conclusion: '' }
  if (botId === 'dash') return { kind: 'dash', network: '', targets: '', marketCapMin: '', marketCapMax: '', liquidityMin: '', maxAgeHours: '', entrySize: '', entryCurrency: '', maxSlippage: '', exclusions: '', candidate: { marketCap: '', liquidity: '', ageHours: '' } }
  if (botId === 'ledger') return { kind: 'ledger', assetPair: '', network: '', direction: '', timeframe: '', signals: '', entryConditions: '', invalidation: '', entryPrice: '', stopPrice: '', targetPrice: '', size: '', sizeCurrency: '', rules: '' }
  if (botId === 'bloom') return { kind: 'bloom', tokenName: '', symbol: '', network: '', description: '', supply: '', allocations: [], plannedLiquidity: '', liquidityCurrency: '', links: '', checklist: [] }
  return { kind: 'orbit', goal: '', tasks: [], reviewNotes: '' }
}

export function makeDocument(botId: BotId, title = 'Untitled setup', brief = ''): WorkspaceDocument {
  return { id: newId(), title, botId, brief, reviewPermission: true, config: makeConfig(botId), updatedAt: new Date().toISOString() }
}
