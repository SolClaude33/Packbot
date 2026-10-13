import { useEffect, useRef, useState } from 'react'
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
  return <section className="starting-section" id="starting-points" data-reveal><div className="section-heading"><p className="eyebrow">Start with the job</p><h2>What does your<br /><span>next move need?</span></h2><p>Pick a starting point for any bot. Your brief and settings stay yours to shape.</p></div><div className="preset-list" data-reveal-group>{presets.map((preset) => <article className={`preset-card preset-${preset.specialist}`} data-bot={preset.specialist} data-reveal-item key={preset.title}><div className="preset-role-icon" aria-hidden="true"><PresetIcon id={preset.specialist} /></div><div><p>{preset.label}</p><h3>{preset.title}</h3><ul>{preset.tasks.map((task) => <li key={task}><Check size={15} />{task}</li>)}</ul></div><button className="button button-ink" onClick={() => onSelect(preset)}>Use this brief <ArrowRight size={16} /></button></article>)}</div></section>
}

const orbitStages = [
  { title: 'Set the objective', copy: 'Write the outcome that brings the crew together. Orbit keeps that objective at the center of the mission.' },
  { title: 'Create specialist jobs', copy: 'Turn the objective into focused work for Scout, Dash, Ledger, or Bloom, each with its own title and brief.' },
  { title: 'Link real setups', copy: 'Connect each job to a setup from the matching specialist, or create that setup directly from the mission.' },
  { title: 'Update progress', copy: 'Move each job between to do, in progress, and done when you decide the work has moved forward.' },
]

function OrbitCoordination() {
  const [selected, setSelected] = useState(0)
  const stage = orbitStages[selected]
  const crew = specialists.filter((person) => person.id !== 'orbit')
  return <section className="orbit-section" data-reveal><div className="section-heading"><p className="eyebrow">Orbit coordinates the work</p><h2>One objective.<br /><span>Clear jobs and handoffs.</span></h2><p>Orbit keeps the mission structure together while each specialist keeps a workspace built for the job.</p></div><div className="orbit-coordination"><div className="orbit-map"><svg className="orbit-connectors" viewBox="0 0 600 460" preserveAspectRatio="none" aria-hidden="true"><path d="M300 230C220 210 190 90 85 62" /><path d="M300 230C380 210 410 90 515 62" /><path d="M300 230C220 250 190 370 85 398" /><path d="M300 230C380 250 410 370 515 398" /></svg><img src="/assets/orbit-coordinator.webp" alt="Orbit coordinating the four specialist bots" loading="lazy" />{crew.map((person) => <a className={`orbit-role orbit-role-${person.id} bot-${person.id}`} href={`/workspace?bot=${person.id}`} key={person.id}><strong>{person.name}</strong><small>{person.role}</small></a>)}</div><div className="orbit-process"><div className="orbit-stage-buttons" aria-label="Explore Orbit's coordination flow">{orbitStages.map((item, index) => <button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} key={item.title}><span>{index + 1}</span>{item.title}</button>)}</div><div className="orbit-stage-copy" key={stage.title}><p>Step {selected + 1} of 4</p><h3>{stage.title}</h3><p>{stage.copy}</p><a className="button button-ink" href="/workspace?bot=orbit">Open Orbit's workspace <ArrowRight size={17} /></a></div></div></div></section>
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
  return <section className="builder-section" id="builder" data-reveal><div className="builder-heading"><p className="eyebrow">Create your first setup</p><h2>Give your bot<br /><span>a job of its own.</span></h2><p>Choose the bot, name the setup, and describe what you want to work on. Its own workspace takes it from there.</p><div className={`builder-role-label bot-${current.id}`}><span>{current.name}</span><small>{current.role}</small></div></div><form className="quick-builder" onSubmit={save}><div className="builder-topline"><span>{draft.preset || 'New setup'}</span><span>Your starting point</span></div><label>Setup name<input ref={nameRef} value={draft.title} onChange={(event) => { const title = event.target.value; setDraft((currentDraft) => ({ ...currentDraft, title })); if (nameError && title.trim()) setStatus('') }} placeholder="Name your setup" maxLength={120} aria-invalid={nameError} aria-describedby={status ? 'builder-status' : undefined} /></label><fieldset><legend>Your bot</legend><div className="specialist-picks">{specialists.map((person) => <button className={`bot-${person.id}`} type="button" aria-pressed={draft.specialist === person.id} onClick={() => setDraft((currentDraft) => ({ ...currentDraft, specialist: person.id }))} key={person.id}><img src={asset(person.id)} alt="" loading="lazy" /><span>{person.name}</span><small>{person.role}</small></button>)}</div></fieldset><label>Your brief<textarea value={draft.brief} maxLength={MAX_TEXT} onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, brief: event.target.value }))} placeholder="Describe the job, your inputs, and the rules that matter." rows={5} /></label>{status ? <p className="form-status" id="builder-status" role="alert">{status}</p> : null}<button className="button button-violet" type="submit">Continue in workspace <ArrowRight size={18} /></button></form></section>
}

function Capabilities() {
  return <section className="details-section" data-reveal><div className="section-heading"><p className="eyebrow">Built around your crypto day</p><h2>Different jobs.<br /><span>A familiar place to work.</span></h2></div><div className="capability-trio" data-reveal-group><article data-reveal-item><SlidersHorizontal /><h3>Controls that fit the bot</h3><p>Each workspace keeps the fields that belong to its job.</p><dl><div><dt>Scout</dt><dd>Sources and findings</dd></div><div><dt>Dash</dt><dd>Entry filters</dd></div><div><dt>Ledger</dt><dd>Signals and exits</dd></div><div><dt>Bloom</dt><dd>Supply and launch tasks</dd></div></dl></article><article data-reveal-item><FileJson /><h3>Portable when you need it</h3><p>Import and export the complete Packbot document as JSON from the workspace.</p><div className="file-diagram"><span>packbot-workspace.json</span><small>All bot setups</small></div></article><article data-reveal-item><FolderOpen /><h3>Pick up every setup</h3><p>Search, rename, duplicate, delete, undo, and return to the work already saved in this browser.</p><a href="/workspace">Open workspace <ArrowRight size={16} /></a></article></div></section>
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
  return <section className="faq-section" id="questions" data-reveal><div className="faq-title"><p className="eyebrow">Good to know</p><h2>A few quick<br /><span>answers.</span></h2><img src="/assets/scout-answers.webp" alt="Scout ready to answer a question" loading="lazy" /></div><div className="faq-list">{faqs.map(([question, answer], index) => { const buttonId = `faq-button-${index}`; const panelId = `faq-panel-${index}`; const expanded = open === index; return <div className="faq-item" key={question}><button id={buttonId} aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpen(expanded ? -1 : index)}><span>{question}</span><ChevronDown /></button><div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded}><p>{answer}</p></div></div> })}</div></section>
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
  return <main><Hero /><Team /><StartingPoints onSelect={selectPreset} /><OrbitCoordination /><ScrollJourney /><StrategyBuilder draft={draft} setDraft={setDraft} nameRef={nameRef} /><Capabilities /><FAQ /><section className="closing" data-reveal><div><p className="eyebrow">Your next move has company</p><h2>Ready to give<br /><span>your crew a job?</span></h2><a className="button button-ink" href="/workspace">Open your workspace <ArrowRight size={18} /></a></div><img className="closing-mark" src="/assets/packbot-mark.svg" alt="" /></section><footer><PackbotMark light /><p>Research. Snipe. Trade. Launch.</p><div><a href="#pack">The pack</a><a href="#starting-points">Starting points</a><a href="#questions">Questions</a><a href="/workspace">Workspace</a></div><small>Packbot. Your crypto crew.</small></footer></main>
}
