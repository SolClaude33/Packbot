import { isBotId, makeDocument, type BotId, type SpecialistId, type WorkspaceStore } from './model'
import { emptyWorkspace, MAX_DOCUMENTS, MAX_TEXT, migrateLegacyStore, validateWorkspaceStore } from './validation'

export { MAX_DOCUMENTS as MAX_STRATEGIES, MAX_TEXT }
export const WORKSPACE_KEY = 'pack.workspace-store.v2'
export const LEGACY_KEY = 'pack.strategy-store.v1'
export const RECOVERY_KEY = 'pack.workspace-recovery.v2'

export type LoadResult = { store: WorkspaceStore; corrupt: boolean; migrated: boolean; message?: string; blockedSource?: 'v2' | 'legacy' | 'access'; recoveryRaw?: string }

export function loadWorkspace(): LoadResult {
  let current: string | null
  try { current = localStorage.getItem(WORKSPACE_KEY) }
  catch { return { store: emptyWorkspace(), corrupt: true, migrated: false, blockedSource: 'access', message: 'This browser blocked access to saved workspace data. Check your storage settings and try again.' } }
  if (current !== null) {
    try { return { store: validateWorkspaceStore(JSON.parse(current)), corrupt: false, migrated: false } }
    catch (error) { return { store: emptyWorkspace(), corrupt: true, migrated: false, blockedSource: 'v2', recoveryRaw: current, message: error instanceof Error ? `Saved workspace could not be opened. ${error.message}` : 'Saved workspace could not be opened.' } }
  }
  let legacy: string | null
  try { legacy = localStorage.getItem(LEGACY_KEY) }
  catch { return { store: emptyWorkspace(), corrupt: true, migrated: false, blockedSource: 'access', message: 'This browser blocked access to saved workspace data. Check your storage settings and try again.' } }
  if (legacy !== null) {
    try { return { store: migrateLegacyStore(JSON.parse(legacy)), corrupt: false, migrated: true, message: 'Previous Packbot strategies were moved into the new workspace.' } }
    catch (error) { return { store: emptyWorkspace(), corrupt: true, migrated: false, blockedSource: 'legacy', message: error instanceof Error ? `Saved workspace could not be migrated. ${error.message}` : 'Saved workspace could not be migrated.' } }
  }
  return { store: emptyWorkspace(), corrupt: false, migrated: false }
}

export function prepareBlockedWorkspace(result: LoadResult): { ok: boolean; message?: string } {
  if (!result.corrupt) return { ok: true }
  if (result.blockedSource === 'legacy') return { ok: true }
  if (result.blockedSource === 'access') {
    const retry = loadWorkspace()
    if (retry.blockedSource === 'access') return { ok: false, message: 'Saved workspace data is still unavailable. Check your browser storage settings and try again.' }
    if (!retry.corrupt) return { ok: false, message: 'Saved workspace data is available again. Reload this page before making changes.' }
    return prepareBlockedWorkspace(retry)
  }
  if (result.blockedSource === 'v2' && result.recoveryRaw !== undefined) {
    try {
      if (localStorage.getItem(RECOVERY_KEY) !== null) return { ok: false, message: 'A previous recovery copy already exists. Export or clear it before replacing this workspace.' }
      localStorage.setItem(RECOVERY_KEY, result.recoveryRaw)
      return { ok: true, message: 'The unreadable workspace was copied to browser recovery storage.' }
    } catch { return { ok: false, message: 'The unreadable workspace could not be backed up. Check your browser storage settings and try again.' } }
  }
  return { ok: false, message: 'The saved workspace could not be prepared for recovery.' }
}

export function saveWorkspace(store: WorkspaceStore): boolean {
  try { localStorage.setItem(WORKSPACE_KEY, JSON.stringify(validateWorkspaceStore(store))); return true }
  catch { return false }
}

export function requestedBotFromLocation(search: string): BotId | null {
  const params = new URLSearchParams(search)
  const value = params.get('bot') ?? params.get('specialist')
  return isBotId(value) ? value : null
}

export function saveLandingDraft(title: string, brief: string, specialist: SpecialistId) {
  const loaded = loadWorkspace()
  if (loaded.corrupt) throw new Error('Your saved workspace needs attention before a new setup can be added.')
  if (loaded.store.documents.length >= MAX_DOCUMENTS) throw new Error('Your workspace has reached its 100 document limit. Delete one before creating another.')
  const document = makeDocument(specialist, title.trim() || 'Untitled setup', brief.trim())
  const next: WorkspaceStore = { version: 2, documents: [document, ...loaded.store.documents], activeId: document.id, selectedBot: specialist }
  if (!saveWorkspace(next)) throw new Error('This browser could not save the setup. Export your current work and check your storage settings.')
}
