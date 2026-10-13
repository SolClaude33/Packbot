import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, Download, FileCheck2, Plus, Search, Trash2, Undo2, Upload, X } from 'lucide-react'
import { BotEditor } from './editors/BotEditors'
import { makeDocument, specialistById, specialists, type BotConfig, type BotId, type WorkspaceDocument, type WorkspaceStore } from './model'
import { loadWorkspace, prepareBlockedWorkspace, requestedBotFromLocation, saveWorkspace } from './storage'
import { MAX_DOCUMENTS, mergeImportedStore, validateWorkspaceStore } from './validation'

const asset = (id: BotId) => `/assets/${id}.webp`
function PackbotMark() { return <a className="brand brand-light" href="/" aria-label="Packbot home"><span>Packbot</span><i /></a> }
const actionLabel: Record<BotId, string> = { scout: 'Review inputs', dash: 'Check criteria', ledger: 'Review inputs', bloom: 'Review allocation', orbit: 'Review progress' }

function downloadJson(value: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a'); link.href = href; link.download = filename; link.click(); URL.revokeObjectURL(href)
}

export function Workspace() {
  const [initial] = useState(() => loadWorkspace())
  const [store, setStore] = useState<WorkspaceStore>(() => {
    const requested = requestedBotFromLocation(window.location.search)
    if (!requested) return initial.store
    const requestedId = new URLSearchParams(window.location.search).get('document')
    const persistedActive = initial.store.documents.find((item) => item.botId === requested && item.id === initial.store.activeId)
    const match = initial.store.documents.find((item) => item.botId === requested && item.id === requestedId) ?? persistedActive ?? initial.store.documents.find((item) => item.botId === requested)
    return { ...initial.store, selectedBot: requested, activeId: match?.id ?? null }
  })
  const [fromOrbit, setFromOrbit] = useState(() => new URLSearchParams(window.location.search).get('fromOrbit'))
  const [storageBlocked, setStorageBlocked] = useState(initial.corrupt)
  const [query, setQuery] = useState('')
  const [deleted, setDeleted] = useState<WorkspaceDocument | null>(null)
  const [notice, setNotice] = useState(initial.message ?? '')
  const [storageOk, setStorageOk] = useState(!initial.corrupt)
  const importRef = useRef<HTMLInputElement>(null)
  const linkingTasks = useRef(new Set<string>())
  const recoveryPrepared = useRef(false)
  const active = store.documents.find((item) => item.id === store.activeId && item.botId === store.selectedBot) ?? null
  const visible = useMemo(() => store.documents.filter((item) => item.botId === store.selectedBot && item.title.toLowerCase().includes(query.trim().toLowerCase())), [query, store.documents, store.selectedBot])

  useEffect(() => {
    if (storageBlocked) return
    const saved = saveWorkspace(store); setStorageOk(saved)
    if (!saved) setNotice('This browser could not save your changes. Export your work and check your storage settings.')
  }, [storageBlocked, store])

  useEffect(() => {
    const params = new URLSearchParams({ bot: store.selectedBot })
    if (store.activeId) params.set('document', store.activeId)
    if (fromOrbit) params.set('fromOrbit', fromOrbit)
    window.history.replaceState(null, '', `/workspace?${params.toString()}`)
  }, [fromOrbit, store.activeId, store.selectedBot])

  const commit = (update: (current: WorkspaceStore) => WorkspaceStore) => { setNotice(''); setStore(update) }
  const selectBot = (botId: BotId) => { window.history.replaceState(null, '', `/workspace?bot=${botId}`); setFromOrbit(null); commit((current) => {
    const currentActive = current.documents.find((item) => item.id === current.activeId)
    const activeId = currentActive?.botId === botId ? currentActive.id : current.documents.find((item) => item.botId === botId)?.id ?? null
    return { ...current, selectedBot: botId, activeId }
  }) }
  const create = () => {
    if (store.documents.length >= MAX_DOCUMENTS) { setNotice('Your workspace has reached its 100 document limit. Delete one before creating another.'); return }
    let recoveryMessage = ''
    if (storageBlocked && !recoveryPrepared.current) { const prepared = prepareBlockedWorkspace(initial); if (!prepared.ok) { setNotice(prepared.message ?? 'Saved workspace data could not be protected.'); return } recoveryPrepared.current = true; recoveryMessage = prepared.message ?? '' }
    const document = makeDocument(store.selectedBot)
    setStorageBlocked(false); setStore((current) => ({ ...current, documents: [document, ...current.documents], activeId: document.id })); setNotice(`${recoveryMessage ? `${recoveryMessage} ` : ''}Setup created. Give it a name when you are ready.`)
  }
  const patchActive = (patch: Partial<WorkspaceDocument>) => commit((current) => ({ ...current, documents: current.documents.map((item) => item.id === current.activeId ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item) }))
  const patchConfig = (config: BotConfig) => patchActive({ config })
  const saveNow = () => {
    try { const checked = validateWorkspaceStore(store); const saved = saveWorkspace(checked); setStorageBlocked(false); setStorageOk(saved); setNotice(saved ? 'Setup saved locally.' : 'This browser could not save your setup.') }
    catch (error) { setStorageOk(false); setNotice(error instanceof Error ? error.message : 'The setup could not be saved.') }
  }
  const duplicate = () => {
    if (!active) return
    if (store.documents.length >= MAX_DOCUMENTS) { setNotice('Your workspace has reached its 100 document limit. Delete one before duplicating.'); return }
    const copy = structuredClone(active); copy.id = crypto.randomUUID(); copy.title = `${active.title.slice(0, 115)} copy`; copy.updatedAt = new Date().toISOString()
    if (copy.config.kind === 'orbit') copy.config.tasks = copy.config.tasks.map((task) => ({ ...task, id: crypto.randomUUID(), linkedDocumentId: '' }))
    commit((current) => ({ ...current, documents: [copy, ...current.documents], activeId: copy.id })); setNotice('Setup duplicated.')
  }
  const remove = () => {
    if (!active) return
    setDeleted(active)
    setStore((current) => { const documents = current.documents.filter((item) => item.id !== active.id); return { ...current, documents, activeId: documents.find((item) => item.botId === current.selectedBot)?.id ?? null } })
    setNotice('Setup deleted.')
  }
  const undo = () => {
    if (!deleted) return
    if (store.documents.length >= MAX_DOCUMENTS) { setNotice('Your workspace has reached its 100 document limit. Delete one before restoring.'); return }
    setStore((current) => ({ ...current, documents: [deleted, ...current.documents], selectedBot: deleted.botId, activeId: deleted.id })); setDeleted(null); setNotice('Setup restored.')
  }
  const exportWorkspace = () => { try { downloadJson(validateWorkspaceStore(store), 'packbot-workspace.json'); setNotice('Workspace exported.') } catch (error) { setNotice(error instanceof Error ? error.message : 'The workspace could not be exported.') } }
  const exportActive = () => { if (!active) return; try { const single = validateWorkspaceStore({ version: 2, documents: [active], activeId: active.id, selectedBot: active.botId }); downloadJson(single, `packbot-${active.botId}-setup.json`); setNotice(`${specialistById.get(active.botId)!.name} setup exported.`) } catch (error) { setNotice(error instanceof Error ? error.message : 'The setup could not be exported.') } }
  const importFile = async (file?: File) => {
    if (!file) return
    try {
      if (file.size > 1_000_000) throw new Error('Choose a workspace file smaller than 1 MB.')
      const merged = mergeImportedStore(store, JSON.parse(await file.text()))
      let recoveryMessage = ''
      if (storageBlocked && !recoveryPrepared.current) { const prepared = prepareBlockedWorkspace(initial); if (!prepared.ok) throw new Error(prepared.message ?? 'Saved workspace data could not be protected.'); recoveryPrepared.current = true; recoveryMessage = prepared.message ?? '' }
      setStorageBlocked(false); setStore(merged); setDeleted(null); setNotice(`${recoveryMessage ? `${recoveryMessage} ` : ''}Documents imported into your workspace.`)
    } catch (error) { setNotice(error instanceof Error ? error.message : 'The workspace could not be imported.') }
    if (importRef.current) importRef.current.value = ''
  }
  const openLinked = (documentId: string) => {
    const linked = store.documents.find((document) => document.id === documentId)
    if (!linked) { setNotice('The linked setup is no longer in this workspace.'); return }
    const originId = active?.botId === 'orbit' ? active.id : fromOrbit
    window.history.replaceState(null, '', `/workspace?bot=${linked.botId}&document=${encodeURIComponent(linked.id)}${originId ? `&fromOrbit=${encodeURIComponent(originId)}` : ''}`)
    setFromOrbit(originId ?? null)
    commit((current) => ({ ...current, selectedBot: linked.botId, activeId: linked.id }))
  }
  const createLinked = (taskId: string, targetBot: Exclude<BotId, 'orbit'>, title: string, brief: string) => {
    if (!active || active.config.kind !== 'orbit') return
    if (linkingTasks.current.has(taskId)) return
    if (store.documents.length >= MAX_DOCUMENTS) { setNotice('Your workspace has reached its 100 document limit. Delete one before creating another.'); return }
    linkingTasks.current.add(taskId)
    const document = makeDocument(targetBot, title.trim() || `${specialistById.get(targetBot)!.role} setup`, brief)
    const orbitId = active.id
    try {
      const next = validateWorkspaceStore({ ...store, documents: [document, ...store.documents.map((item) => item.id === orbitId && item.config.kind === 'orbit' ? { ...item, updatedAt: new Date().toISOString(), config: { ...item.config, tasks: item.config.tasks.map((task) => task.id === taskId ? { ...task, linkedDocumentId: document.id } : task) } } : item)], selectedBot: targetBot, activeId: document.id })
      setStore(next); setFromOrbit(orbitId)
      window.history.replaceState(null, '', `/workspace?bot=${targetBot}&document=${encodeURIComponent(document.id)}&fromOrbit=${encodeURIComponent(orbitId)}`)
      setNotice(`${specialistById.get(targetBot)!.name} setup created and linked.`)
      window.setTimeout(() => linkingTasks.current.delete(taskId), 500)
    } catch (error) { linkingTasks.current.delete(taskId); setNotice(error instanceof Error ? error.message : 'The specialist setup could not be created.') }
  }
  const returnToOrbit = () => {
    const orbit = fromOrbit ? store.documents.find((document) => document.id === fromOrbit && document.botId === 'orbit') : null
    if (!orbit) { setFromOrbit(null); setNotice('The original Orbit setup is no longer available.'); return }
    window.history.replaceState(null, '', `/workspace?bot=orbit&document=${encodeURIComponent(orbit.id)}`); setFromOrbit(null)
    commit((current) => ({ ...current, selectedBot: 'orbit', activeId: orbit.id }))
  }

  return <main className="workspace-shell">
    <header className="workspace-header"><PackbotMark />{fromOrbit ? <button className="back-link" onClick={returnToOrbit}>Back to Orbit</button> : <a href="/" className="back-link">Back to Packbot</a>}<div className="workspace-actions"><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(event) => importFile(event.target.files?.[0])} /><button onClick={() => importRef.current?.click()}><Upload size={16} />Import</button><button onClick={exportWorkspace} disabled={!store.documents.length}><Download size={16} />Export workspace</button></div></header>
    <nav className="bot-tabs" aria-label="Packbot workspaces">{specialists.map((bot) => <button key={bot.id} aria-pressed={store.selectedBot === bot.id} onClick={() => selectBot(bot.id)}><img src={asset(bot.id)} alt="" /><span><strong>{bot.name}</strong><small>{bot.role}</small></span><b>{store.documents.filter((item) => item.botId === bot.id).length}</b></button>)}</nav>
    <div className="workspace-layout">
      <aside className="strategy-sidebar"><div className="sidebar-heading"><span>{specialistById.get(store.selectedBot)!.role} setups</span><button onClick={create} aria-label={`Create ${specialistById.get(store.selectedBot)!.role.toLowerCase()} setup`}><Plus /></button></div><label className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search setups" aria-label="Search setups" /></label><div className="strategy-list">{visible.length ? visible.map((item) => <button className={active?.id === item.id ? 'active' : ''} onClick={() => commit((current) => ({ ...current, activeId: item.id }))} key={item.id}><img src={asset(item.botId)} alt="" /><span><strong>{item.title || 'Untitled setup'}</strong><small>{new Date(item.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</small></span></button>) : <p className="sidebar-empty">{query ? 'No matching setups.' : `No ${specialistById.get(store.selectedBot)!.role.toLowerCase()} setups yet.`}</p>}</div>{deleted ? <button className="undo-button" onClick={undo}><Undo2 size={16} />Undo delete</button> : null}</aside>
      <section className="workspace-main">{notice ? <div className={`notice ${storageBlocked ? 'notice-warning' : ''}`} role="status"><span>{notice}</span><button aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={16} /></button></div> : null}{active ? <div className="strategy-editor"><div className="editor-top"><div><p className="editor-kicker">{specialistById.get(active.botId)!.role} setup</p><input className="title-input" aria-label="Setup name" value={active.title} maxLength={120} onChange={(event) => patchActive({ title: event.target.value })} /></div><div className="editor-actions"><button onClick={saveNow}><Check size={16} />Save</button><button onClick={() => document.getElementById('bot-review')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })}><FileCheck2 size={16} />{actionLabel[active.botId]}</button><button onClick={exportActive}><Download size={16} />Export setup</button><button onClick={duplicate}><Copy size={16} />Duplicate</button><button className="danger" onClick={remove}><Trash2 size={16} />Delete</button></div></div><div className={`specialist-strip tone-${active.botId}`}><div><span>Your bot</span><strong>{specialistById.get(active.botId)!.name}</strong><small>{specialistById.get(active.botId)!.role}</small></div><img src={asset(active.botId)} alt="" /><p>{specialistById.get(active.botId)!.line}</p></div><section className="document-common"><label className="editor-field"><span>Brief</span><textarea rows={4} maxLength={10000} value={active.brief} placeholder="What are you setting up?" onChange={(event) => patchActive({ brief: event.target.value })} /></label><label className="permission-row"><span><strong>Require final review</strong><small>Keep a visible checkpoint in this setup.</small></span><input type="checkbox" checked={active.reviewPermission} onChange={(event) => patchActive({ reviewPermission: event.target.checked })} /><i aria-hidden="true" /></label></section><BotEditor config={active.config} onChange={patchConfig} documents={store.documents} onCreateLinked={createLinked} onOpenLinked={openLinked} />{active.legacySnapshot ? <details className="legacy-notes"><summary>Saved notes from the previous workspace</summary><dl>{Object.entries(active.legacySnapshot).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{typeof value === 'boolean' ? value ? 'Yes' : 'No' : value || 'Empty'}</dd></div>)}</dl></details> : null}{active.savedNotes?.length ? <details className="legacy-notes"><summary>Saved notes from the previous Orbit workspace</summary><dl>{active.savedNotes.map((note, index) => <div key={`${note.label}-${index}`}><dt>{note.label}</dt><dd>{note.value}</dd></div>)}</dl></details> : null}<div className={`save-state ${storageOk ? '' : 'save-error'}`}>{storageOk ? <Check size={16} /> : <X size={16} />}<span>{storageOk ? 'Changes saved locally' : 'Changes are not saved'}</span><time>{new Date(active.updatedAt).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}</time></div></div> : <EmptyBot botId={store.selectedBot} onCreate={create} corrupt={storageBlocked} />}</section>
    </div>
  </main>
}

function EmptyBot({ botId, onCreate, corrupt }: { botId: BotId; onCreate: () => void; corrupt: boolean }) {
  const bot = specialistById.get(botId)!
  return <div className="empty-workspace"><img className="empty-bot" src={asset(botId)} alt="" /><p className="eyebrow">{bot.role} workspace</p><h1>{corrupt ? 'Your saved workspace needs attention.' : `Start with ${bot.name}.`}</h1><p>{corrupt ? 'Packbot must preserve the unreadable data before this workspace can be replaced.' : bot.line}</p><button className="button button-violet" onClick={onCreate}><Plus size={18} />Create {bot.role.toLowerCase()} setup</button></div>
}
