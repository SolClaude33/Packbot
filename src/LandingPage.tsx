import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ChartNoAxesCombined, Check, ChevronDown, FileJson, FolderOpen, Leaf, Menu, Network, Search, SlidersHorizontal, X, Zap } from 'lucide-react'
import { specialistById, specialists, type SpecialistId } from './model'
import { MAX_TEXT, saveLandingDraft } from './storage'
import { PackbotMark } from './Brand'
import { CrewHeroMedia } from './CrewHeroMedia'
import { ScrollJourney } from './ScrollJourney'
import { useReveal } from './useReveal'

const asset = (id: SpecialistId) => `/assets/${id}.webp`

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <PackbotMark light />
    <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="site-nav" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    <nav id="site-nav" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Primary navigation">
      <a href="#pack" onClick={() => setOpen(false)}>Meet the pack</a>
      <a href="#starting-points" onClick={() => setOpen(false)}>Starting points</a>
      <a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a>
      <a href="#questions" onClick={() => setOpen(false)}>Questions</a>
    </nav>
    <a className="header-cta" href="/workspace">Open workspace <ArrowRight size={16} /></a>
  </header>
}

function Hero() {
  const heroCrew = (['scout', 'dash', 'orbit', 'ledger', 'bloom'] as const).map((id) => specialistById.get(id)!)
  return <section className="hero">
    <Header />
    <div className="crew-hero-layout">
      <div className="hero-copy">
        <p className="eyebrow">Research · Snipe · Trade · Launch</p>
        <h1><span>Your next move.</span><span>Bring the whole pack.</span></h1>
        <p className="hero-dek">Research, snipe, trade, or prepare a launch. Four specialists, with Orbit bringing their work together.</p>
        <div className="hero-actions">
          <a className="button button-ink" href="#builder">Give Orbit a job <ArrowDown size={18} /></a>
          <a className="button button-outline" href="#pack">Meet the specialists <ArrowRight size={18} /></a>
        </div>
      </div>
      <CrewHeroMedia />
      <nav className="crew-role-links" aria-label="Open a bot workspace">{heroCrew.map((person) => <a className={`bot-${person.id}`} href={`/workspace?bot=${person.id}`} key={person.id}><span>{person.name}</span><small>{person.role}</small></a>)}</nav>
    </div>
  </section>
}

function Team() {
  const [selected, setSelected] = useState<SpecialistId>('orbit')
  const current = specialistById.get(selected)!
  return <section className="team-section" id="pack" data-reveal>
    <div className="section-heading centered"><p className="eyebrow">Say hello to the crew</p><h2>One team captain.<br /><span>Four focused specialists.</span></h2></div>
    <div className="team-tabs" aria-label="Choose a specialist" data-reveal-group>
      {specialists.map((person) => <button className={`bot-${person.id}`} data-reveal-item key={person.id} aria-pressed={selected === person.id} onClick={() => setSelected(person.id)}><img src={asset(person.id)} alt="" loading="lazy" /><span><strong>{person.name}</strong><small>{person.role}</small></span></button>)}
    </div>
    <div className={`team-feature tone-${current.id}`} data-bot={current.id} key={current.id} aria-live="polite">
      <div className="team-portrait"><span className="portrait-blob" /><img src={asset(current.id)} alt="" loading="lazy" /></div>
      <div className="team-story">
        <p className="role-pill">{current.role}</p>
        <h3>{current.line}</h3>
        <p className="feature-bio">{current.bio}</p>
        <div className="capability-row">{current.capabilities.map((item) => <span key={item}><Check size={15} />{item}</span>)}</div>
        <a href={`/workspace?bot=${current.id}`} className="button button-ink">Open {current.name}'s workspace <ArrowRight size={17} /></a>
      </div>
    </div>
  </section>
}

type Preset = { title: string; label: string; specialist: SpecialistId; brief: string; tasks: string[] }
const presets: Preset[] = [
  { title: 'Research shortlist', label: 'Scout · Research', specialist: 'scout', brief: 'Research the tokens on my shortlist. Keep the sources, open questions, findings, and conclusions together so I can understand each opportunity.', tasks: ['Collect sources', 'Follow research questions', 'Write findings and conclusions'] },
  { title: 'Sniper setup', label: 'Dash · Sniper', specialist: 'dash', brief: 'Prepare a sniper setup for the tokens and pairs I want to watch. Define liquidity, market cap, age, entry size, slippage, and exclusion rules before checking a candidate.', tasks: ['Set fast-entry filters', 'Define size and slippage', 'Check candidate criteria'] },
  { title: 'Signal trader', label: 'Ledger · Trader', specialist: 'ledger', brief: 'Build a signal-led trade setup. Define the pair, direction, timeframe, signals, entry conditions, stop, target, and position size that belong to this trade.', tasks: ['Define signals and entries', 'Set stop and target', 'Review reward and risk'] },
  { title: 'Launch kit', label: 'Bloom · Launch', specialist: 'bloom', brief: 'Prepare my token launch. Organize the token name, symbol, supply, allocation, planned liquidity, project links, and remaining preparation tasks.', tasks: ['Prepare token details', 'Shape supply and allocation', 'Follow the launch checklist'] },
  { title: 'Team mission', label: 'Orbit · Orchestrator', specialist: 'orbit', brief: 'Organize a mission for my crypto crew. Define the objective, split it into specialist jobs, link each setup to the right bot, and keep handoffs and progress together.', tasks: ['Set the team objective', 'Assign specialist jobs', 'Track the handoffs'] },
]

function PresetIcon({ id }: { id: SpecialistId }) {
  if (id === 'scout') return <Search />
  if (id === 'dash') return <Zap />
  if (id === 'ledger') return <ChartNoAxesCombined />
  if (id === 'bloom') return <Leaf />
  return <Network />
}

function StartingPoints({ onSelect }: { onSelect: (preset: Preset) => void }) {
  return <section className="starting-section" id="starting-points" data-reveal><div className="section-heading"><p className="eyebrow">Start with the job</p><h2>What does your<br /><span>next move need?</span></h2><p>Pick a starting point for any bot. Your brief and settings stay yours to shape.</p></div><div className="preset-list" data-reveal-group>{presets.map((preset) => <article className={`preset-card preset-${preset.specialist}`} data-bot={preset.specialist} data-reveal-item key={preset.title}><div className="preset-role-icon" aria-hidden="true"><PresetIcon id={preset.specialist} /></div><div className="preset-copy"><p>{preset.label}</p><h3>{preset.title}</h3><ul className="preset-task-list">{preset.tasks.map((task) => <li key={task}><Check size={15} />{task}</li>)}</ul><details className="preset-details"><summary>Brief details</summary><ul>{preset.tasks.map((task) => <li key={task}><Check size={14} />{task}</li>)}</ul></details></div><button className="button button-ink" onClick={() => onSelect(preset)}><span className="preset-cta-wide">Use this brief</span><span className="preset-cta-short">Use brief</span><ArrowRight size={16} /></button></article>)}</div></section>
}

function SecondLook() {
  return <section className="second-look" data-reveal><div className="second-look-copy"><p className="eyebrow">Research before the next move</p><h2>Room for a<br /><span>second look.</span></h2><p>Keep the question open. Write down what you know, what needs checking, and what would change your mind.</p><a className="button button-ink" href="/workspace?bot=scout">Open research workspace <ArrowRight size={17} /></a></div><div className="second-look-scene"><span aria-hidden="true" /><img src="/assets/second-look.webp" alt="Scout and Ledger considering a research note together" loading="lazy" width="960" height="617" /></div></section>
}

type BuilderState = { title: string; brief: string; specialist: SpecialistId; preset: string }
function StrategyBuilder({ draft, setDraft, nameRef }: { draft: BuilderState; setDraft: React.Dispatch<React.SetStateAction<BuilderState>>; nameRef: React.RefObject<HTMLInputElement | null> }) {
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (status === 'Give your setup a name first.' && draft.title.trim()) setStatus('')
  }, [draft.title, status])
  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.title.trim()) { setStatus('Give your setup a name first.'); requestAnimationFrame(() => nameRef.current?.focus()); return }
    try { saveLandingDraft(draft.title, draft.brief, draft.specialist); window.location.href = `/workspace?bot=${draft.specialist}` }
    catch (error) { setStatus(error instanceof Error ? error.message : 'This browser could not save the setup.') }
  }
  const current = specialistById.get(draft.specialist)!
  const nameError = status === 'Give your setup a name first.'
  return <section className="builder-section" id="builder" data-reveal><div className="builder-heading"><p className="eyebrow">Create your first setup</p><h2>Give your bot<br /><span>a job of its own.</span></h2><p>Choose a bot, name your setup, and add a brief. Its workspace has the controls for your job.</p><div className={`builder-role-label bot-${current.id}`}><span>{current.name}</span><small>{current.role}</small></div></div><form className="quick-builder" onSubmit={save}><div className="builder-topline"><span>{draft.preset || 'New setup'}</span><span>Your starting point</span></div><label>Setup name<input ref={nameRef} value={draft.title} onChange={(event) => { const title = event.target.value; setDraft((currentDraft) => ({ ...currentDraft, title })); if (nameError && title.trim()) setStatus('') }} placeholder="Name your setup" maxLength={120} aria-invalid={nameError} aria-describedby={status ? 'builder-status' : undefined} /></label><fieldset><legend>Your bot</legend><div className="specialist-picks">{specialists.map((person) => <button className={`bot-${person.id}`} type="button" aria-pressed={draft.specialist === person.id} onClick={() => setDraft((currentDraft) => ({ ...currentDraft, specialist: person.id }))} key={person.id}><img src={asset(person.id)} alt="" loading="lazy" /><span>{person.name}</span><small>{person.role}</small></button>)}</div></fieldset><label>Your brief<textarea value={draft.brief} maxLength={MAX_TEXT} onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, brief: event.target.value }))} placeholder="Describe the job, your inputs, and the rules that matter." rows={4} /></label>{status ? <p className="form-status" id="builder-status" role="alert">{status}</p> : null}<button className="button button-violet" type="submit">Continue in workspace <ArrowRight size={18} /></button></form></section>
}

function Capabilities() {
  const [selected, setSelected] = useState(0)
  const labels = ['Controls', 'Portability', 'Saved work']
  return <section className="details-section" data-reveal><div className="section-heading"><p className="eyebrow">Built around your crypto day</p><h2>Different jobs.<br /><span>A familiar place to work.</span></h2></div><div className="capability-tabs" aria-label="Choose a capability">{labels.map((label, index) => <button id={`capability-button-${index}`} type="button" aria-pressed={selected === index} aria-controls={`capability-panel-${index}`} onClick={() => setSelected(index)} key={label}>{label}</button>)}</div><div className="capability-trio" data-reveal-group><article id="capability-panel-0" aria-labelledby="capability-button-0" data-active={selected === 0} data-reveal-item><SlidersHorizontal /><h3>Controls that fit the bot</h3><p>Each workspace keeps the fields that belong to its job.</p><dl><div><dt>Scout</dt><dd>Sources and findings</dd></div><div><dt>Dash</dt><dd>Entry filters</dd></div><div><dt>Ledger</dt><dd>Signals and exits</dd></div><div><dt>Bloom</dt><dd>Supply and launch tasks</dd></div></dl></article><article id="capability-panel-1" aria-labelledby="capability-button-1" data-active={selected === 1} data-reveal-item><FileJson /><h3>Portable when you need it</h3><p>Import and export the complete Packbot document as JSON from the workspace.</p><div className="file-diagram"><span>packbot-workspace.json</span><small>All bot setups</small></div></article><article id="capability-panel-2" aria-labelledby="capability-button-2" data-active={selected === 2} data-reveal-item><FolderOpen /><h3>Pick up every setup</h3><p>Search, rename, duplicate, delete, undo, and return to the work already saved in this browser.</p><a href="/workspace">Open workspace <ArrowRight size={16} /></a></article></div></section>
}

const faqs = [
  ['What can my bots help with?', 'Scout handles research, Dash covers sniper setups, Ledger focuses on signals and trade rules, and Bloom prepares token launches. Orbit coordinates the jobs and handoffs between them.'],
  ['How do I start?', 'Choose a bot or a starting point, add a name and brief, then open the workspace with the controls made for that job.'],
  ['Do I need to use every bot?', 'Start with the specialist that fits your job. Each setup has its own workspace. Use Orbit when you want to organize several specialist jobs around one objective.'],
  ['Where is my work stored?', 'Your setups stay in this browser through local storage. You can export a Packbot document whenever you want a portable copy.'],
  ['What happens when I delete a setup?', 'A deleted setup can be restored with Undo until another setup is deleted or the page is closed.'],
]

function FAQ() {
  const [open, setOpen] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [reservedHeight, setReservedHeight] = useState<number>()

  useLayoutEffect(() => {
    const list = listRef.current
    const measure = measureRef.current
    if (!list || !measure) return
    let active = true
    let frame = 0
    let lastWidth = -1

    const measureHeight = () => {
      frame = 0
      if (!active) return
      const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>('.faq-item > button'))
      const items = Array.from(list.querySelectorAll<HTMLElement>('.faq-item'))
      const listStyle = getComputedStyle(list)
      const gap = Number.parseFloat(listStyle.rowGap) || 0
      const buttonsAndCards = buttons.reduce((total, button, index) => {
        const itemStyle = getComputedStyle(items[index])
        const chrome = (Number.parseFloat(itemStyle.borderTopWidth) || 0) + (Number.parseFloat(itemStyle.borderBottomWidth) || 0) + (Number.parseFloat(itemStyle.paddingTop) || 0) + (Number.parseFloat(itemStyle.paddingBottom) || 0)
        return total + button.getBoundingClientRect().height + chrome
      }, 0)
      const bodyHeight = Math.max(0, ...Array.from(measure.children, (panel) => panel.getBoundingClientRect().height))
      setReservedHeight(Math.ceil(buttonsAndCards + gap * Math.max(0, items.length - 1) + bodyHeight))
    }
    const schedule = () => {
      if (!active || frame) return
      frame = requestAnimationFrame(measureHeight)
    }
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? list.getBoundingClientRect().width
      if (Math.abs(width - lastWidth) < .5) return
      lastWidth = width
      schedule()
    })
    observer.observe(list)
    document.fonts?.ready.then(() => { if (active) schedule() })
    schedule()
    return () => {
      active = false
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return <section className="faq-section" id="questions" data-reveal><div className="faq-title"><p className="eyebrow">Good to know</p><h2>A few quick<br /><span>answers.</span></h2><img src="/assets/scout-answers.webp" alt="Scout ready to answer a question" loading="lazy" /></div><div className="faq-list-shell"><div ref={listRef} className="faq-list" style={reservedHeight ? { minHeight: `${reservedHeight}px` } : undefined}>{faqs.map(([question, answer], index) => { const buttonId = `faq-button-${index}`; const panelId = `faq-panel-${index}`; const expanded = open === index; return <div className="faq-item" key={question}><button id={buttonId} aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpen(expanded ? -1 : index)}><span>{question}</span><ChevronDown /></button><div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded}><p>{answer}</p></div></div> })}</div><div ref={measureRef} className="faq-measure" aria-hidden="true">{faqs.map(([, answer], index) => <div className="faq-measure-panel" key={index}><p>{answer}</p></div>)}</div></div></section>
}

export function LandingPage() {
  useReveal()
  const [draft, setDraft] = useState<BuilderState>({ title: '', brief: '', specialist: 'orbit', preset: '' })
  const nameRef = useRef<HTMLInputElement>(null)
  const selectPreset = (preset: Preset) => {
    setDraft({ title: preset.title, brief: preset.brief, specialist: preset.specialist, preset: preset.title })
    requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById('builder')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
      window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), reducedMotion ? 0 : 450)
    })
  }
  return <main><Hero /><Team /><StartingPoints onSelect={selectPreset} /><SecondLook /><ScrollJourney /><StrategyBuilder draft={draft} setDraft={setDraft} nameRef={nameRef} /><Capabilities /><FAQ /><section className="closing" data-reveal><div><p className="eyebrow">Your next move has company</p><h2>Ready to give<br /><span>your crew a job?</span></h2><a className="button button-ink" href="/workspace">Open your workspace <ArrowRight size={18} /></a></div><div className="closing-scene"><span aria-hidden="true" /><img src="/assets/crew-pile.webp" alt="The five Packbot companions piled together" loading="lazy" width="900" height="732" /></div></section><footer><PackbotMark light /><p>Research. Snipe. Trade. Launch.</p><div><a href="#pack">The pack</a><a href="#starting-points">Starting points</a><a href="#questions">Questions</a><a href="/workspace">Workspace</a></div><small>Packbot. Your crypto crew.</small></footer></main>
}
