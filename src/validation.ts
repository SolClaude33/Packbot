import { BOT_IDS, isBotId, makeDocument, newId, type AllocationItem, type BloomConfig, type BotConfig, type BotId, type ChecklistItem, type DashConfig, type HandoffTask, type LedgerConfig, type LegacySnapshot, type OrbitConfig, type QuestionItem, type SavedNote, type ScoutConfig, type SourceItem, type WorkspaceDocument, type WorkspaceStore } from './model'

export const MAX_DOCUMENTS = 100
export const MAX_TEXT = 10000
const MAX_ITEMS = 100
const text = (value: unknown, label: string, max = MAX_TEXT) => { if (typeof value !== 'string' || value.length > max) throw new Error(`${label} contains invalid text.`); return value }
const id = (value: unknown, label: string) => { const result = text(value, label, 100); if (!result) throw new Error(`${label} is missing.`); return result }
const bool = (value: unknown, label: string) => { if (typeof value !== 'boolean') throw new Error(`${label} is invalid.`); return value }
const list = (value: unknown, label: string) => { if (!Array.isArray(value) || value.length > MAX_ITEMS) throw new Error(`${label} is invalid.`); return value }
const record = (value: unknown, label: string): Record<string, unknown> => { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} is invalid.`); return value as Record<string, unknown> }
const numericText = (value: unknown, label: string) => { const result = text(value, label, 80); if (result !== '' && (!Number.isFinite(Number(result)) || Number(result) < 0)) throw new Error(`${label} must be zero or greater.`); return result }

const source = (value: unknown, label: string): SourceItem => { const raw = record(value, label); return { id: id(raw.id, `${label} ID`), url: text(raw.url, `${label} URL`, 2048), note: text(raw.note, `${label} note`) } }
const question = (value: unknown, label: string): QuestionItem => { const raw = record(value, label); return { id: id(raw.id, `${label} ID`), text: text(raw.text, `${label} text`), resolved: bool(raw.resolved, `${label} status`) } }
const allocation = (value: unknown, label: string): AllocationItem => { const raw = record(value, label); return { id: id(raw.id, `${label} ID`), label: text(raw.label, `${label} label`, 200), percent: numericText(raw.percent, `${label} percent`) } }
const checklist = (value: unknown, label: string): ChecklistItem => { const raw = record(value, label); return { id: id(raw.id, `${label} ID`), label: text(raw.label, `${label} label`, 500), complete: bool(raw.complete, `${label} status`) } }
const handoff = (value: unknown, label: string): HandoffTask => { const raw = record(value, label); const targetBot = raw.targetBot; if (targetBot !== 'scout' && targetBot !== 'dash' && targetBot !== 'ledger' && targetBot !== 'bloom') throw new Error(`${label} has an invalid specialist.`); const status = raw.status; if (status !== 'todo' && status !== 'in-progress' && status !== 'done') throw new Error(`${label} has an invalid status.`); const priority = raw.priority; if (priority !== '' && priority !== 'low' && priority !== 'medium' && priority !== 'high') throw new Error(`${label} has an invalid priority.`); return { id: id(raw.id, `${label} ID`), title: text(raw.title, `${label} title`, 200), brief: text(raw.brief, `${label} brief`), targetBot, linkedDocumentId: text(raw.linkedDocumentId, `${label} link`, 100), status, priority } }
const savedNote = (value: unknown, label: string): SavedNote => { const raw = record(value, label); return { label: text(raw.label, `${label} label`, 200), value: text(raw.value, `${label} value`) } }
const uniqueIds = <T extends { id: string }>(items: T[], label: string) => { const ids = new Set<string>(); for (const item of items) { if (ids.has(item.id)) throw new Error(`${label} contains duplicate identifiers.`); ids.add(item.id) } return items }

export function validateConfig(value: unknown, botId: BotId): BotConfig {
  const raw = record(value, `${botId} configuration`)
  if (raw.kind !== botId) throw new Error(`The ${botId} configuration type does not match its bot.`)
  if (botId === 'scout') return { kind: 'scout', topic: text(raw.topic, 'Research topic'), network: text(raw.network, 'Research network'), observedAssets: text(raw.observedAssets, 'Observed assets'), sources: uniqueIds(list(raw.sources, 'Sources').map((item, index) => source(item, `Source ${index + 1}`)), 'Sources'), questions: uniqueIds(list(raw.questions, 'Questions').map((item, index) => question(item, `Question ${index + 1}`)), 'Questions'), findings: text(raw.findings, 'Findings'), conclusion: text(raw.conclusion, 'Conclusion') } satisfies ScoutConfig
  if (botId === 'dash') { const candidate = record(raw.candidate, 'Candidate metrics'); return { kind: 'dash', network: text(raw.network, 'Network'), targets: text(raw.targets, 'Targets'), marketCapMin: numericText(raw.marketCapMin, 'Minimum market cap'), marketCapMax: numericText(raw.marketCapMax, 'Maximum market cap'), liquidityMin: numericText(raw.liquidityMin, 'Minimum liquidity'), maxAgeHours: numericText(raw.maxAgeHours, 'Maximum age'), entrySize: numericText(raw.entrySize, 'Entry size'), entryCurrency: text(raw.entryCurrency, 'Entry currency', 30), maxSlippage: numericText(raw.maxSlippage, 'Maximum slippage'), exclusions: text(raw.exclusions, 'Exclusions'), candidate: { marketCap: numericText(candidate.marketCap, 'Candidate market cap'), liquidity: numericText(candidate.liquidity, 'Candidate liquidity'), ageHours: numericText(candidate.ageHours, 'Candidate age') } } satisfies DashConfig }
  if (botId === 'ledger') { const direction = raw.direction; if (direction !== '' && direction !== 'long' && direction !== 'short') throw new Error('Trade direction is invalid.'); return { kind: 'ledger', assetPair: text(raw.assetPair, 'Asset pair', 200), network: text(raw.network, 'Network', 200), direction, timeframe: text(raw.timeframe, 'Timeframe', 100), signals: text(raw.signals, 'Signals'), entryConditions: text(raw.entryConditions, 'Entry conditions'), invalidation: text(raw.invalidation, 'Invalidation'), entryPrice: numericText(raw.entryPrice, 'Entry price'), stopPrice: numericText(raw.stopPrice, 'Stop price'), targetPrice: numericText(raw.targetPrice, 'Target price'), size: numericText(raw.size, 'Trade size'), sizeCurrency: raw.sizeCurrency === undefined ? '' : text(raw.sizeCurrency, 'Size currency', 30), rules: text(raw.rules, 'Trade rules') } satisfies LedgerConfig }
  if (botId === 'bloom') return { kind: 'bloom', tokenName: text(raw.tokenName, 'Token name', 200), symbol: text(raw.symbol, 'Token symbol', 40), network: text(raw.network, 'Network', 200), description: text(raw.description, 'Description'), supply: numericText(raw.supply, 'Token supply'), allocations: uniqueIds(list(raw.allocations, 'Allocations').map((item, index) => allocation(item, `Allocation ${index + 1}`)), 'Allocations'), plannedLiquidity: numericText(raw.plannedLiquidity, 'Planned liquidity'), liquidityCurrency: text(raw.liquidityCurrency, 'Liquidity currency', 30), links: text(raw.links, 'Links'), checklist: uniqueIds(list(raw.checklist, 'Checklist').map((item, index) => checklist(item, `Checklist item ${index + 1}`)), 'Checklist') } satisfies BloomConfig
  return { kind: 'orbit', goal: text(raw.goal, 'Orchestration goal'), tasks: uniqueIds(list(raw.tasks, 'Handoff tasks').map((item, index) => handoff(item, `Handoff ${index + 1}`)), 'Handoff tasks'), reviewNotes: text(raw.reviewNotes, 'Review notes') } satisfies OrbitConfig
}

function migratePortfolioOrbit(raw: Record<string, unknown>): { config: OrbitConfig; savedNotes: SavedNote[] } {
  const notes: SavedNote[] = []
  const add = (label: string, value: unknown) => { if (typeof value === 'string' && value) notes.push({ label, value }) }
  add('Reference currency', raw.referenceCurrency); add('Cash', raw.cash); add('Maximum concentration', raw.maxConcentration); add('Exposure notes', raw.exposureNotes); add('Review notes', raw.reviewNotes)
  if (Array.isArray(raw.positions)) raw.positions.forEach((value, index) => { if (!value || typeof value !== 'object') return; const item = value as Record<string, unknown>; const summary = [item.asset, item.value, item.note].filter((part) => typeof part === 'string' && part).join(' · '); if (summary) notes.push({ label: `Saved position ${index + 1}`, value: summary }) })
  return { config: { kind: 'orbit', goal: '', tasks: [], reviewNotes: typeof raw.reviewNotes === 'string' ? raw.reviewNotes : '' }, savedNotes: notes }
}

export function validateWorkspaceDocument(value: unknown, index = 0): WorkspaceDocument {
  const raw = record(value, `Document ${index + 1}`)
  if (!isBotId(raw.botId)) throw new Error(`Document ${index + 1} has an unknown bot.`)
  const updatedAt = text(raw.updatedAt, `Document ${index + 1} date`, 100)
  if (Number.isNaN(Date.parse(updatedAt))) throw new Error(`Document ${index + 1} has an invalid date.`)
  const configRaw = record(raw.config, `Document ${index + 1} configuration`)
  const priorOrbit = raw.botId === 'orbit' && !Array.isArray(configRaw.tasks) && ('positions' in configRaw || 'referenceCurrency' in configRaw)
  const converted = priorOrbit ? migratePortfolioOrbit(configRaw) : null
  const result: WorkspaceDocument = { id: id(raw.id, `Document ${index + 1} ID`), title: text(raw.title, `Document ${index + 1} title`, 120), botId: raw.botId, brief: text(raw.brief, `Document ${index + 1} brief`), reviewPermission: bool(raw.reviewPermission, `Document ${index + 1} review setting`), config: converted?.config ?? validateConfig(configRaw, raw.botId), updatedAt }
  if (raw.legacySnapshot !== undefined) result.legacySnapshot = validateLegacySnapshot(raw.legacySnapshot, index)
  const existingNotes = raw.savedNotes === undefined ? [] : list(raw.savedNotes, 'Saved notes').map((item, noteIndex) => savedNote(item, `Saved note ${noteIndex + 1}`))
  if (existingNotes.length || converted?.savedNotes.length) result.savedNotes = [...existingNotes, ...(converted?.savedNotes ?? [])]
  return result
}

export function validateWorkspaceStore(value: unknown): WorkspaceStore {
  const raw = record(value, 'Workspace document')
  if (raw.version !== 2) throw new Error('This workspace document uses an unsupported format.')
  const documents = list(raw.documents, 'Workspace documents')
  if (documents.length > MAX_DOCUMENTS) throw new Error('A workspace can contain at most 100 documents.')
  const normalized = documents.map(validateWorkspaceDocument)
  const ids = new Set<string>()
  for (const document of normalized) { if (ids.has(document.id)) throw new Error('The workspace contains duplicate identifiers.'); ids.add(document.id) }
  if (!isBotId(raw.selectedBot)) throw new Error('The selected bot is invalid.')
  const activeId = raw.activeId === null || (typeof raw.activeId === 'string' && ids.has(raw.activeId)) ? raw.activeId : null
  return { version: 2, documents: normalized, activeId, selectedBot: raw.selectedBot }
}

export function validateLegacySnapshot(value: unknown, index = 0): LegacySnapshot {
  const raw = record(value, `Legacy document ${index + 1}`)
  const specialist = raw.specialist
  if (!isBotId(specialist)) throw new Error(`Legacy document ${index + 1} has an unknown specialist.`)
  const snapshot: LegacySnapshot = { id: id(raw.id, 'Legacy ID'), title: text(raw.title, 'Legacy title', 120), specialist, brief: text(raw.brief, 'Legacy brief'), sources: text(raw.sources, 'Legacy sources'), tokens: text(raw.tokens, 'Legacy tokens'), entryMin: numericText(raw.entryMin, 'Legacy minimum'), entryMax: numericText(raw.entryMax, 'Legacy maximum'), liquidity: numericText(raw.liquidity, 'Legacy liquidity'), age: numericText(raw.age, 'Legacy age'), budget: numericText(raw.budget, 'Legacy budget'), exits: text(raw.exits, 'Legacy exits'), launchCriteria: text(raw.launchCriteria, 'Legacy launch criteria'), reviewPermission: bool(raw.reviewPermission, 'Legacy review setting'), updatedAt: text(raw.updatedAt, 'Legacy date', 100) }
  if (Number.isNaN(Date.parse(snapshot.updatedAt))) throw new Error('A legacy document has an invalid date.')
  return snapshot
}

export function migrateLegacyStrategy(value: unknown, index = 0): WorkspaceDocument {
  const raw = record(value, `Legacy strategy ${index + 1}`)
  const snapshot = validateLegacySnapshot(raw, index)
  const document = makeDocument(snapshot.specialist, snapshot.title || 'Imported setup', snapshot.brief)
  document.id = snapshot.id
  document.updatedAt = snapshot.updatedAt
  document.reviewPermission = snapshot.reviewPermission
  document.legacySnapshot = snapshot
  if (document.config.kind === 'scout') { document.config.observedAssets = snapshot.tokens; document.config.sources = snapshot.sources ? [{ id: newId(), url: '', note: snapshot.sources }] : [] }
  if (document.config.kind === 'dash') { document.config.targets = snapshot.tokens; document.config.marketCapMin = snapshot.entryMin; document.config.marketCapMax = snapshot.entryMax; document.config.liquidityMin = snapshot.liquidity; document.config.maxAgeHours = snapshot.age; document.config.entrySize = snapshot.budget; document.config.entryCurrency = snapshot.budget ? 'SOL' : '' }
  if (document.config.kind === 'ledger') { document.config.assetPair = snapshot.tokens; document.config.rules = snapshot.exits }
  return document
}

export function migrateLegacyStore(value: unknown): WorkspaceStore {
  const raw = record(value, 'Legacy workspace')
  if (raw.version !== 1) throw new Error('This legacy workspace uses an unsupported format.')
  const strategies = list(raw.strategies, 'Legacy strategies')
  if (strategies.length > MAX_DOCUMENTS) throw new Error('A workspace can contain at most 100 documents.')
  const documents = strategies.map(migrateLegacyStrategy)
  const ids = new Set<string>()
  for (const document of documents) { if (ids.has(document.id)) throw new Error('The legacy workspace contains duplicate identifiers.'); ids.add(document.id) }
  const activeId = typeof raw.activeId === 'string' && ids.has(raw.activeId) ? raw.activeId : null
  const active = documents.find((item) => item.id === activeId)
  return { version: 2, documents, activeId, selectedBot: active?.botId ?? 'scout' }
}

export function emptyWorkspace(botId: BotId = 'orbit'): WorkspaceStore { return { version: 2, documents: [], activeId: null, selectedBot: botId } }

const numberOrNull = (value: string) => value === '' ? null : Number(value)
export function checkDash(config: DashConfig) {
  const fields = [config.candidate.marketCap, config.candidate.liquidity, config.candidate.ageHours]
  if (fields.some((value) => value === '')) return { status: 'missing' as const, message: 'Add all three candidate metrics to check the criteria.', checks: [] as { label: string; passed: boolean }[] }
  const min = numberOrNull(config.marketCapMin), max = numberOrNull(config.marketCapMax), liquidity = numberOrNull(config.liquidityMin), age = numberOrNull(config.maxAgeHours)
  if (min !== null && max !== null && min > max) return { status: 'invalid' as const, message: 'Maximum market cap must be equal to or greater than the minimum.', checks: [] as { label: string; passed: boolean }[] }
  const candidateCap = Number(config.candidate.marketCap), candidateLiquidity = Number(config.candidate.liquidity), candidateAge = Number(config.candidate.ageHours)
  const checks = [
    ...(min === null ? [] : [{ label: 'Market cap meets the minimum', passed: candidateCap >= min }]),
    ...(max === null ? [] : [{ label: 'Market cap stays below the maximum', passed: candidateCap <= max }]),
    ...(liquidity === null ? [] : [{ label: 'Liquidity meets the minimum', passed: candidateLiquidity >= liquidity }]),
    ...(age === null ? [] : [{ label: 'Age stays below the maximum', passed: candidateAge <= age }]),
  ]
  if (!checks.length) return { status: 'missing' as const, message: 'Add at least one criterion before checking a candidate.', checks }
  return { status: checks.every((item) => item.passed) ? 'passed' as const : 'failed' as const, message: checks.every((item) => item.passed) ? 'The entered candidate meets every filled criterion.' : 'The entered candidate misses one or more filled criteria.', checks }
}

export function calculateTrade(config: LedgerConfig) {
  if (!config.direction || !config.entryPrice || !config.stopPrice || !config.targetPrice) return { status: 'missing' as const, message: 'Add direction, entry, stop, and target to calculate the setup.' }
  const entry = Number(config.entryPrice), stop = Number(config.stopPrice), target = Number(config.targetPrice)
  const coherent = config.direction === 'long' ? stop < entry && target > entry : stop > entry && target < entry
  if (!coherent) return { status: 'invalid' as const, message: config.direction === 'long' ? 'A long setup needs stop below entry and target above entry.' : 'A short setup needs stop above entry and target below entry.' }
  const stopDistance = Math.abs(entry - stop)
  const rewardRisk = Math.abs(target - entry) / stopDistance
  if (!Number.isFinite(stopDistance) || !Number.isFinite(rewardRisk)) return { status: 'invalid' as const, message: 'The entered prices are too far apart to calculate reliably.' }
  return { status: 'ready' as const, stopDistance, rewardRisk }
}

export function calculateAllocations(config: BloomConfig) {
  const filled = config.allocations.filter((item) => item.percent !== '')
  const total = filled.reduce((sum, item) => sum + Number(item.percent), 0)
  return { total, complete: config.allocations.length > 0 && filled.length === config.allocations.length, valid: Number.isFinite(total) && total <= 100 }
}

export function mergeImportedStore(current: WorkspaceStore, imported: unknown): WorkspaceStore {
  const parsed = record(imported, 'Imported document')
  const incoming = parsed.version === 2 ? validateWorkspaceStore(imported) : migrateLegacyStore(imported)
  if (current.documents.length + incoming.documents.length > MAX_DOCUMENTS) throw new Error('Import would exceed the 100 document limit.')
  const used = new Set(current.documents.map((item) => item.id)); const idMap = new Map<string, string>()
  const importSuffix = ' imported'
  const documents = incoming.documents.map((item) => { const originalId = item.id; if (!used.has(item.id)) { used.add(item.id); idMap.set(originalId, item.id); return item } const copy = { ...item, id: newId(), title: `${item.title.slice(0, 120 - importSuffix.length)}${importSuffix}` }; used.add(copy.id); idMap.set(originalId, copy.id); return copy })
  for (const document of documents) if (document.config.kind === 'orbit') document.config = { ...document.config, tasks: document.config.tasks.map((task) => ({ ...task, linkedDocumentId: idMap.get(task.linkedDocumentId) ?? task.linkedDocumentId })) }
  return validateWorkspaceStore({ version: 2, documents: [...documents, ...current.documents], activeId: documents[0]?.id ?? current.activeId, selectedBot: documents[0]?.botId ?? current.selectedBot })
}

export const knownBotIds = BOT_IDS
