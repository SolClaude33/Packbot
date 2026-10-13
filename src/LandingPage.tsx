import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Check, ChevronDown, CircleDot, FileJson, Menu, Plus, SlidersHorizontal, X } from 'lucide-react'
import { specialistById, specialists, type SpecialistId } from './model'
import { MAX_TEXT, saveLandingDraft } from './storage'
import { PackbotMark } from './Brand'
import { OrbitMedia } from './OrbitMedia'
import { useReveal } from './useReveal'

const asset = (id: SpecialistId) => `/assets/${id}.webp`

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <PackbotMark />
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

const heroMissions = specialists.filter((person) => person.id !== 'orbit')

function HeroDiagram() {
  return <div className="hero-diagram" aria-label="Orbit connects four specialist bots">
    <svg className="hero-connectors" viewBox="0 0 640 620" preserveAspectRatio="none" aria-hidden="true"><path d="M245 310C350 310 348 95 455 95" /><path d="M245 310C350 310 348 235 455 235" /><path d="M245 310C350 310 348 385 455 385" /><path d="M245 310C350 310 348 530 455 530" /></svg>
    <div className="orbit-stage"><span className="orbit-label">Crew lead</span><div className="orbit-blob"><OrbitMedia /></div><strong>Orbit</strong><small>Orchestrator</small></div>
    <div className="mission-card-grid">{heroMissions.map((person, index) => <a className={`hero-mission mission-${person.id}`} href={`/workspace?bot=${person.id}`} key={person.id} style={{ '--mission-index': index } as React.CSSProperties}><span>{person.role}</span><img src={asset(person.id)} alt="" /><div><strong>{person.name}</strong><small>{person.role === 'Research' ? 'Build the context' : person.role === 'Sniper' ? 'Shape the entry' : person.role === 'Trader' ? 'Write the rules' : 'Prepare the launch'}</small></div><ArrowRight size={16} /></a>)}</div>
  </div>
}

function Hero() {
  return <section className="hero">
    <Header />
    <div className="vivid-hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">Research · Snipe · Trade · Launch</p>
        <h1><span>Your next move.</span><span>Bring the pack.</span></h1>
        <p className="hero-dek">Four specialists take on research, entries, trade rules, and launches. Orbit organizes the jobs and keeps every handoff in view.</p>
        <div className="hero-actions">
          <a className="button button-ink" href="#builder">Give Orbit a job <ArrowDown size={18} /></a>
          <a className="button button-outline" href="#pack">Meet the specialists <ArrowRight size={18} /></a>
        </div>
      </div>
      <HeroDiagram />
    </div>
  </section>
}

function Team() {
  const [selected, setSelected] = useState<SpecialistId>('orbit')
  const current = specialistById.get(selected)!
  return <section className="team-section" id="pack" data-reveal>
    <div className="section-heading centered"><p className="eyebrow">Say hello to the crew</p><h2>One team captain.<br /><span>Four focused specialists.</span></h2></div>
    <div className="team-tabs" aria-label="Choose a specialist">
      {specialists.map((person) => <button className={`bot-${person.id}`} key={person.id} aria-pressed={selected === person.id} onClick={() => setSelected(person.id)}><img src={asset(person.id)} alt="" loading="lazy" /><span><strong>{person.name}</strong><small>{person.role}</small></span></button>)}
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

type Preset = { title: string; label: string; specialist: SpecialistId; brief: string; tasks: string[]; tone: string }
const presets: Preset[] = [
  { title: 'Research shortlist', label: 'Scout · Research', specialist: 'scout', brief: 'Research the tokens on my shortlist. Keep the sources, open questions, findings, and conclusions together so I can understand each opportunity.', tasks: ['Collect sources', 'Follow research questions', 'Write findings and conclusions'], tone: 'lavender' },
  { title: 'Sniper setup', label: 'Dash · Sniper', specialist: 'dash', brief: 'Prepare a sniper setup for the tokens and pairs I want to watch. Define liquidity, market cap, age, entry size, slippage, and exclusion rules before checking a candidate.', tasks: ['Set fast-entry filters', 'Define size and slippage', 'Check candidate criteria'], tone: 'sky' },
  { title: 'Signal trader', label: 'Ledger · Trader', specialist: 'ledger', brief: 'Build a signal-led trade setup. Define the pair, direction, timeframe, signals, entry conditions, stop, target, and position size that belong to this trade.', tasks: ['Define signals and entries', 'Set stop and target', 'Review reward and risk'], tone: 'peach' },
  { title: 'Launch kit', label: 'Bloom · Launch', specialist: 'bloom', brief: 'Prepare my token launch. Organize the token name, symbol, supply, allocation, planned liquidity, project links, and remaining preparation tasks.', tasks: ['Prepare token details', 'Shape supply and allocation', 'Follow the launch checklist'], tone: 'mint' },
  { title: 'Team mission', label: 'Orbit · Orchestrator', specialist: 'orbit', brief: 'Organize a mission for my crypto crew. Define the objective, split it into specialist jobs, link each setup to the right bot, and keep handoffs and progress together.', tasks: ['Set the team objective', 'Assign specialist jobs', 'Track the handoffs'], tone: 'lime' },
]

function StartingPoints({ onSelect }: { onSelect: (preset: Preset) => void }) {
  return <section className="starting-section" id="starting-points" data-reveal><div className="section-heading"><p className="eyebrow">Start with the job</p><h2>What does your<br /><span>next move need?</span></h2><p>Pick a starting point for any bot. Your brief and settings stay yours to shape.</p></div><div className="preset-list">{presets.map((preset) => <article className={`preset-card preset-${preset.specialist}`} data-bot={preset.specialist} key={preset.title}><div><p>{preset.label}</p><h3>{preset.title}</h3><ul>{preset.tasks.map((task) => <li key={task}><Check size={15} />{task}</li>)}</ul></div><img className="preset-mascot" src={asset(preset.specialist)} alt="" loading="lazy" /><button className="button button-ink" onClick={() => onSelect(preset)}>Use this brief <ArrowRight size={16} /></button></article>)}</div></section>
}

const missions = [
  { id: 'scout', title: 'Understand a token', copy: 'Give Scout a research question. Collect sources, work through open questions, and build a conclusion you can retrace.', detail: 'Sources · questions · findings · conclusion' },
  { id: 'dash', title: 'Find the entry that fits', copy: 'Give Dash a sniper setup. Put the entry filters and execution limits in one place, then check a candidate against your rules.', detail: 'Targets · entry filters · size · slippage' },
  { id: 'ledger', title: 'Turn signals into trade rules', copy: 'Give Ledger a pair and a thesis. Shape the signals, entry conditions, stop, and target for a trade that follows your rules.', detail: 'Pair · signals · entry · stop · target' },
  { id: 'bloom', title: 'Prepare your own launch', copy: 'Give Bloom the token you want to create. Organize its identity, supply, allocation, liquidity, and the tasks that get it ready.', detail: 'Token details · allocation · liquidity · checklist' },
  { id: 'orbit', title: 'Keep the whole crew moving', copy: 'Give Orbit the objective. Break it into jobs for the four specialists, link their setups, and keep the handoffs and progress in one mission.', detail: 'Objective · specialist jobs · linked setups · progress' },
] as const

function BotMissions() {
  const [selected, setSelected] = useState(0)
  const mission = missions[selected]
  return <section className="handoff-section" data-reveal><div className="section-heading"><p className="eyebrow">A workspace for every mission</p><h2>Pick the job.<br /><span>Meet the right bot.</span></h2></div><div className="handoff-board"><div className="handoff-track mission-track" aria-label="Choose a bot mission">{missions.map((item, index) => <button className={`bot-${item.id}`} key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={asset(item.id)} alt="" loading="lazy" /><strong>{specialistById.get(item.id)!.name}</strong><small>{specialistById.get(item.id)!.role}</small></button>)}</div><div className="handoff-detail" data-bot={mission.id} key={mission.id} aria-live="polite"><div><small>{specialistById.get(mission.id)!.role} workspace</small><h3>{mission.title}</h3><p>{mission.copy}</p><a className="mission-link" href={`/workspace?bot=${mission.id}`}>Open {specialistById.get(mission.id)!.name}'s workspace <ArrowRight size={16} /></a></div><div className="structure-slip"><CircleDot size={18} /><span>Made for this job</span><strong>{mission.detail}</strong></div></div></div></section>
}

function HowItWorks() {
  const steps = [
    { number: '1', title: 'Choose the right bot', copy: 'Start with research, sniping, trading, or a launch. Give Orbit the objective when a job needs the whole crew.', link: '#pack', label: 'Meet your bot' },
    { number: '2', title: 'Make the setup yours', copy: 'Give it a name and brief. Open the controls built for that bot and add your inputs.', link: '#builder', label: 'Create a setup' },
    { number: '3', title: 'Keep your work together', copy: 'Save each setup, revisit the details, and switch between bots as your next job changes.', link: '/workspace', label: 'Open the workspace' },
  ]
  return <section className="how-section" id="how-it-works" data-reveal><div className="section-heading centered"><p className="eyebrow">A good place to begin</p><h2>Your next job,<br /><span>in three simple steps.</span></h2></div><div className="steps-grid">{steps.map((step) => <article key={step.number}><span className="step-number">{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p><a href={step.link}>{step.label} <ArrowRight size={16} /></a></article>)}</div></section>
}

type BuilderState = { title: string; brief: string; specialist: SpecialistId; preset: string }
function StrategyBuilder({ draft, setDraft, nameRef }: { draft: BuilderState; setDraft: React.Dispatch<React.SetStateAction<BuilderState>>; nameRef: React.RefObject<HTMLInputElement | null> }) {
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (status === 'Give your setup a name first.' && draft.title.trim()) setStatus('')
  }, [draft.title, status])
  const save = () => {
    if (!draft.title.trim()) { setStatus('Give your setup a name first.'); return }
    try { saveLandingDraft(draft.title, draft.brief, draft.specialist); window.location.href = `/workspace?bot=${draft.specialist}` }
    catch (error) { setStatus(error instanceof Error ? error.message : 'This browser could not save the setup.') }
  }
  return <section className="builder-section" id="builder" data-reveal><div className="builder-heading"><p className="eyebrow">Create your first setup</p><h2>Give your bot<br /><span>a job of its own.</span></h2><p>Choose the bot, name the setup, and describe what you want to work on. Its own workspace takes it from there.</p><div className="builder-mascot"><img src={asset(draft.specialist)} alt="" loading="lazy" /><span>{specialistById.get(draft.specialist)!.name} · {specialistById.get(draft.specialist)!.role}</span></div></div><div className="quick-builder"><div className="builder-topline"><span>{draft.preset || 'New setup'}</span><span>Your starting point</span></div><label>Setup name<input ref={nameRef} value={draft.title} onChange={(event) => { const title = event.target.value; setDraft((current) => ({ ...current, title })); if (status === 'Give your setup a name first.' && title.trim()) setStatus('') }} placeholder="Name your setup" maxLength={120} /></label><fieldset><legend>Your bot</legend><div className="specialist-picks">{specialists.map((person) => <button type="button" aria-pressed={draft.specialist === person.id} onClick={() => setDraft((current) => ({ ...current, specialist: person.id }))} key={person.id}><img src={asset(person.id)} alt="" loading="lazy" /><span>{person.name}</span><small>{person.role}</small></button>)}</div></fieldset><label>Your brief<textarea value={draft.brief} maxLength={MAX_TEXT} onChange={(event) => setDraft((current) => ({ ...current, brief: event.target.value }))} placeholder="Describe the job, your inputs, and the rules that matter." rows={5} /></label>{status ? <p className="form-status" role="alert">{status}</p> : null}<button className="button button-violet" type="button" onClick={save}>Continue in workspace <ArrowRight size={18} /></button></div></section>
}

function Capabilities() {
  return <section className="details-section" data-reveal><div className="section-heading"><p className="eyebrow">Built around your crypto day</p><h2>Different jobs.<br /><span>A familiar place to work.</span></h2></div><div className="details-mosaic"><article className="detail-wide lavender"><SlidersHorizontal /><h3>Controls that fit the bot</h3><p>Research sources, sniper filters, trade signals, and launch details each get a workspace built for that job.</p></article><article className="detail-tall peach"><img src={asset('ledger')} alt="" /><h3>Your signals. Your trade rules.</h3><p>Keep the pair, timeframe, entry, stop, and target together with Ledger.</p></article><article className="mint"><Check /><h3>Orbit keeps the big picture</h3><p>Group the specialist jobs into a mission and keep their handoffs and progress close.</p></article><article className="sky"><FileJson /><h3>Keep your work portable</h3><p>Save, duplicate, import, and export your bot setups from one workspace.</p></article><article className="detail-dark"><Plus /><h3>A place for every bot</h3><p>Switch between jobs and pick up each setup where you left it.</p><a href="/workspace">Open workspace <ArrowRight size={16} /></a></article></div></section>
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
  return <section className="faq-section" id="questions" data-reveal><div className="faq-title"><p className="eyebrow">Good to know</p><h2>A few quick<br /><span>answers.</span></h2><img src={asset('scout')} alt="Scout, the research specialist" /></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className="faq-item" key={question}><button aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}><span>{question}</span><ChevronDown /></button>{open === index ? <p>{answer}</p> : null}</div>)}</div></section>
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
  return <main><Hero /><Team /><StartingPoints onSelect={selectPreset} /><BotMissions /><HowItWorks /><StrategyBuilder draft={draft} setDraft={setDraft} nameRef={nameRef} /><Capabilities /><FAQ /><section className="closing" data-reveal><div><p className="eyebrow">Your next move has company</p><h2>Ready to give<br /><span>your crew a job?</span></h2><a className="button button-ink" href="/workspace">Open your workspace <ArrowRight size={18} /></a></div><div className="closing-crew">{['scout', 'orbit', 'ledger'].map((id) => <img src={asset(id as SpecialistId)} alt="" key={id} />)}</div></section><footer><PackbotMark light /><p>Research. Snipe. Trade. Launch.</p><div><a href="#pack">The pack</a><a href="#starting-points">Starting points</a><a href="#questions">Questions</a><a href="/workspace">Workspace</a></div><small>Packbot. Your crypto crew.</small></footer></main>
}
