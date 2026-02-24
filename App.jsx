import { useState, useEffect, useRef } from 'react'
import { QUESTIONS, PLANS, SUBS, GHL_WEBHOOK } from './data.js'

// ── ICONS ──
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)
const ArrowLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
)
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

// ── STYLES ──
const s = {
  wrap: { maxWidth: 840, margin: '0 auto', padding: '48px 24px 100px' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 72 },
  logo: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.04em' },
  navTag: { fontSize: '0.7rem', fontWeight: 500, color: 'var(--g400)', letterSpacing: '0.04em' },
  navR: { display: 'flex', alignItems: 'center', gap: 14 },
  adminDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--g200)', border: 'none', cursor: 'pointer', flexShrink: 0 },

  // Intro
  pill: { display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--g100)', border: '1px solid var(--g200)', padding: '5px 13px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 500, color: 'var(--g600)', marginBottom: 32 },
  pillDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--black)' },
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2.8rem, 7vw, 4.8rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.045em', marginBottom: 24 },
  h1muted: { fontWeight: 300, color: 'var(--g400)' },
  intro_p: { fontSize: '0.97rem', color: 'var(--g600)', lineHeight: 1.65, maxWidth: 420, marginBottom: 44 },
  btnBlack: { display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--black)', color: 'var(--white)', fontSize: '0.85rem', fontWeight: 600, padding: '14px 26px', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' },
  stats: { display: 'flex', alignItems: 'center', gap: 20, marginTop: 48, flexWrap: 'wrap' },
  stat: { fontSize: '0.75rem', color: 'var(--g400)' },
  statSep: { width: 1, height: 14, background: 'var(--g200)' },

  // Progress
  prog: { display: 'flex', gap: 5, marginBottom: 52 },
  progSeg: (state) => ({
    flex: 1, height: 3, borderRadius: 2, overflow: 'hidden', position: 'relative',
    background: state === 'done' ? 'var(--black)' : 'var(--g200)',
  }),

  // Question
  qNum: { fontSize: '0.72rem', fontWeight: 500, color: 'var(--g400)', marginBottom: 16 },
  qH: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(1.7rem, 4.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.15, marginBottom: 36, maxWidth: 560 },
  opts: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 },
  opt: (sel) => ({
    display: 'flex', alignItems: 'center', gap: 14,
    border: `1.5px solid ${sel ? 'var(--black)' : 'var(--g200)'}`,
    borderRadius: 10, padding: '16px 18px', cursor: 'pointer',
    background: sel ? 'var(--black)' : 'var(--white)',
    color: sel ? 'var(--white)' : 'var(--black)',
    fontSize: '0.88rem', fontWeight: 400, textAlign: 'left', width: '100%',
    transition: 'all 0.12s',
  }),
  optKey: (sel) => ({
    width: 26, height: 26, borderRadius: 6,
    border: `1.5px solid ${sel ? 'rgba(255,255,255,0.25)' : 'var(--g200)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.62rem', fontWeight: 700,
    color: sel ? 'rgba(255,255,255,0.6)' : 'var(--g400)',
    background: sel ? 'rgba(255,255,255,0.1)' : 'transparent',
    flexShrink: 0,
  }),
  qAct: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 36 },
  btnNext: (on) => ({
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'var(--black)', color: 'var(--white)',
    fontSize: '0.83rem', fontWeight: 600, padding: '13px 22px',
    border: 'none', borderRadius: 7, cursor: on ? 'pointer' : 'not-allowed',
    opacity: on ? 1 : 0.2, pointerEvents: on ? 'all' : 'none', transition: 'all 0.12s',
  }),
  btnBack: { background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 500, color: 'var(--g400)', cursor: 'pointer', padding: '12px 2px' },

  // Result
  rpill: { display: 'inline-flex', alignItems: 'center', gap: 7, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '5px 13px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 500, color: '#15803d', marginBottom: 22 },
  rpdot: { width: 6, height: 6, borderRadius: '50%', background: '#16a34a' },
  rH: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(1.9rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10 },
  rS: { fontSize: '0.88rem', color: 'var(--g600)', lineHeight: 1.6, maxWidth: 520, marginBottom: 52 },

  // Podium
  podium: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, alignItems: 'end' },
  card: (type) => ({
    border: type === 'feat' ? '2px solid var(--black)' : '1.5px solid var(--g200)',
    borderRadius: 14, padding: '26px 20px',
    background: type === 'feat' ? 'var(--black)' : 'var(--white)',
    color: type === 'feat' ? 'var(--white)' : 'var(--black)',
    position: 'relative', cursor: 'pointer',
    opacity: type === 'decoy' ? 0.18 : type === 'sec' ? 0.38 : 1,
    transform: type === 'feat' ? 'scale(1.04)' : type === 'sec' ? 'scale(0.92) translateY(14px)' : 'scale(0.86) translateY(24px)',
    filter: type === 'decoy' ? 'blur(0.6px)' : 'none',
    zIndex: type === 'feat' ? 2 : 1,
    boxShadow: type === 'feat' ? '0 24px 64px rgba(0,0,0,0.16)' : 'none',
    transition: 'all 0.3s ease',
  }),
  rbadge: { position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--white)', color: 'var(--black)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 100, whiteSpace: 'nowrap', border: '1.5px solid var(--g200)' },
  cName: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 18 },
  cPrice: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 3 },

  // Admin
  admHead: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 },
  abk: { background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 500, color: 'var(--g400)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  abadge: { fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--g100)', border: '1px solid var(--g200)', color: 'var(--g600)', padding: '3px 10px', borderRadius: 100 },
  admH: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 8 },
  admS: { fontSize: '0.85rem', color: 'var(--g600)', marginBottom: 40 },
  recBox: { background: 'var(--g100)', border: '1px solid var(--g200)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, gap: 16 },
  rbl: { fontSize: '0.7rem', fontWeight: 500, color: 'var(--g400)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 },
  rbn: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.03em' },
  rbp: { fontSize: '0.8rem', color: 'var(--g600)', marginTop: 2 },
  asecs: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  asec: { border: '1.5px solid var(--g200)', borderRadius: 14, overflow: 'hidden' },
  asech: { padding: '20px 24px 16px', borderBottom: '1px solid var(--g200)', background: 'var(--g100)' },
  asectag: { fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 4 },
  asecttl: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' },
  asecdesc: { fontSize: '0.75rem', color: 'var(--g600)', marginTop: 4, lineHeight: 1.4 },
  asecb: { padding: '20px 24px' },
  inp: { width: '100%', border: '1.5px solid var(--g200)', borderRadius: 8, padding: '11px 14px', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'var(--black)', background: 'var(--white)', outline: 'none', marginBottom: 10 },
  bbro: (disabled) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: 'var(--black)', color: 'var(--white)', fontSize: '0.82rem', fontWeight: 600, padding: '13px 20px', border: 'none', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.25 : 1, marginTop: 4, transition: 'all 0.12s' }),

  // Contact
  contactItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1.5px solid var(--g200)', borderRadius: 8, cursor: 'pointer', marginBottom: 6, background: 'var(--white)' },
  cselBox: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1.5px solid var(--black)', borderRadius: 8, background: 'var(--g100)', marginBottom: 10 },

  // Popup
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, backdropFilter: 'blur(4px)' },
  popup: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(680px, 95vw)', maxHeight: '90vh', background: '#fff', borderRadius: 16, zIndex: 1001, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' },
  popupHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--g200)', flexShrink: 0 },
  popupClose: { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--g400)', padding: '4px 8px' },
}

// ── COMPONENTS ──

function Intro({ onStart }) {
  return (
    <div className="fade-up">
      <div style={s.pill}><span style={s.pillDot}></span> 5 questions · 60 secondes</div>
      <h1 style={s.h1}>Quel forfait<br /><span style={s.h1muted}>est fait pour vous?</span></h1>
      <p style={s.intro_p}>Répondez honnêtement — le forfait qui correspond à votre réalité s'affiche automatiquement.</p>
      <button style={s.btnBlack} onClick={onStart}>Commencer <ArrowRight /></button>
      <div style={s.stats}>
        <div style={s.stat}><strong>0%</strong> de churn en 14 mois</div>
        <div style={s.statSep}></div>
        <div style={s.stat}>Noté <strong>5/5</strong> par nos clients</div>
        <div style={s.statSep}></div>
        <div style={s.stat}>Opérationnel en <strong>5h</strong></div>
      </div>
    </div>
  )
}

function ProgressBar({ cur, total }) {
  return (
    <div style={s.prog}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={s.progSeg(i < cur ? 'done' : i === cur ? 'cur' : 'idle')}>
          {i === cur && (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--black)', borderRadius: 2, animation: 'fillBar 0.35s ease forwards' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function Question({ q, cur, total, answer, onPick, onNext, onBack }) {
  const keys = ['A', 'B', 'C']
  return (
    <div className="fade-up" key={cur}>
      <ProgressBar cur={cur} total={total} />
      <p style={s.qNum}>{q.n}</p>
      <h2 style={s.qH}>{q.t}</h2>
      <div style={s.opts}>
        {q.opts.map((opt, i) => (
          <button key={i} style={s.opt(answer === i)} onClick={() => onPick(i)}>
            <span style={s.optKey(answer === i)}>{keys[i]}</span>
            {opt}
          </button>
        ))}
      </div>
      <div style={s.qAct}>
        <button style={s.btnNext(answer !== null)} onClick={onNext}>
          {cur === total - 1 ? 'Voir mon résultat' : 'Suivant'} <ArrowRight />
        </button>
        {cur > 0 && <button style={s.btnBack} onClick={onBack}>← Retour</button>}
      </div>
    </div>
  )
}

function PlanCard({ planKey, type, onClick }) {
  const p = PLANS[planKey]
  const featColor = type === 'feat' ? 'rgba(255,255,255,0.62)' : 'var(--g600)'
  const divColor = type === 'feat' ? 'rgba(255,255,255,0.1)' : 'var(--g200)'
  const noteColor = type === 'feat' ? 'rgba(255,255,255,0.38)' : 'var(--g400)'
  const tagColor = type === 'feat' ? 'rgba(255,255,255,0.5)' : 'var(--g600)'
  const tagBorder = type === 'feat' ? 'rgba(255,255,255,0.1)' : 'var(--g200)'

  return (
    <div style={s.card(type)} onClick={onClick}>
      {type === 'feat' && <div style={s.rbadge}>Sélectionné</div>}
      <div style={s.cName}>{p.name}</div>
      <div style={s.cPrice}>{p.price}</div>
      <div style={{ fontSize: '0.62rem', color: noteColor, marginBottom: 18 }}>{p.note}</div>
      <div style={{ height: 1, background: divColor, marginBottom: 16 }}></div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {p.feats.map((f, i) => (
          <li key={i} style={{ fontSize: '0.73rem', color: featColor, lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: type === 'feat' ? 'rgba(255,255,255,0.45)' : 'var(--g400)', flexShrink: 0, marginTop: 1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      {type === 'feat' && (
        <div style={{ fontSize: '0.68rem', fontWeight: 500, color: tagColor, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${tagBorder}`, lineHeight: 1.4 }}>
          {p.tag}
        </div>
      )}
    </div>
  )
}

function Result({ rec, onSelectPlan }) {
  // Always show all 3 plans — selected in center, others on sides
  const allKeys = ['essentiel', 'signature', 'elite']
  const others = allKeys.filter(k => k !== rec)
  const order = [others[0], rec, others[1]]
  const types = ['sec', 'feat', 'decoy']

  return (
    <div className="fade-up">
      <div style={s.rpill}><span style={s.rpdot}></span> Analyse complétée</div>
      <h2 style={s.rH}>{PLANS[rec].name} — c'est votre match.</h2>
      <p style={s.rS}>{SUBS[rec]}</p>
      <div style={s.podium}>
        {order.map((key, i) => (
          <PlanCard key={key} planKey={key} type={types[i]} onClick={() => onSelectPlan(key)} />
        ))}
      </div>
    </div>
  )
}

function FormPopup({ rec, onClose }) {
  const p = PLANS[rec]
  const iframeRef = useRef(null)

  useEffect(() => {
    // Load GHL embed script
    const existing = document.getElementById('ghlEmbedScript')
    if (existing) existing.remove()
    const script = document.createElement('script')
    script.id = 'ghlEmbedScript'
    script.src = 'https://api.ola-ai.ca/js/form_embed.js'
    document.body.appendChild(script)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      <div style={s.overlay} onClick={onClose} />
      <div style={s.popup}>
        <div style={s.popupHead}>
          <div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Créer le compte</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--g400)', marginTop: 2 }}>{p.name} · {p.price}</div>
          </div>
          <button style={s.popupClose} onClick={onClose}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <iframe
            ref={iframeRef}
            src="https://api.ola-ai.ca/widget/survey/QO5yOsTIIctYRZ9l9wSP"
            style={{ border: 'none', width: '100%', minHeight: 600, display: 'block' }}
            scrolling="no"
            id="QO5yOsTIIctYRZ9l9wSP"
            title="Formulaire OLA"
          />
        </div>
      </div>
    </>
  )
}

function Admin({ rec, onBack, onViewPodium }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const p = PLANS[rec]

  const confirmContact = () => {
    if (!name.trim() || !email.trim()) return
    setContact({ name: name.trim(), email: email.trim() })
    setName('')
    setEmail('')
  }

  const sendBrochure = async () => {
    if (!contact) return
    setSending(true)
    try {
      await fetch(GHL_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          forfait: p.name,
          forfait_prix: p.price,
          forfait_mensuel: p.note,
          date: new Date().toISOString(),
        }),
        mode: 'no-cors',
      })
      setSent(true)
    } catch (e) {
      console.error(e)
    }
    setSending(false)
  }

  return (
    <div className="fade-up">
      {showForm && <FormPopup rec={rec} onClose={() => setShowForm(false)} />}
      <div style={s.admHead}>
        <button style={s.abk} onClick={onBack}><ArrowLeft /> Retour au résultat</button>
        <span style={s.abadge}>Admin</span>
      </div>
      <h2 style={s.admH}>Prochaines étapes</h2>
      <p style={s.admS}>Choisissez l'action selon le résultat de la conversation.</p>
      <div style={s.recBox}>
        <div>
          <div style={s.rbl}>Forfait sélectionné</div>
          <div style={s.rbn}>{p.name}</div>
          <div style={s.rbp}>{p.price} installation · + {p.note.split('+ ')[1]}</div>
        </div>
        <button style={{ ...s.btnBlack, fontSize: '0.75rem', padding: '10px 18px' }} onClick={onViewPodium}>Voir le podium →</button>
      </div>

      <div style={s.asecs}>
        {/* BROCHURE */}
        <div style={s.asec}>
          <div style={s.asech}>
            <div style={s.asectag}>Pas closé</div>
            <div style={s.asecttl}>Envoyer la brochure</div>
            <div style={s.asecdesc}>Entrez les infos du contact pour déclencher l'envoi dans GHL.</div>
          </div>
          <div style={s.asecb}>
            {!contact ? (
              <>
                <input style={s.inp} type="text" placeholder="Nom complet" value={name} onChange={e => setName(e.target.value)} />
                <input style={s.inp} type="email" placeholder="Courriel" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmContact()} />
                <button style={s.bbro(!name || !email)} onClick={confirmContact} disabled={!name || !email}>
                  Confirmer le contact
                </button>
              </>
            ) : (
              <>
                <div style={s.cselBox}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{contact.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--g400)', marginTop: 2 }}>{contact.email}</div>
                  </div>
                  <button onClick={() => { setContact(null); setSent(false) }} style={{ background: 'none', border: 'none', color: 'var(--g400)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                </div>
                {!sent ? (
                  <button style={s.bbro(sending)} onClick={sendBrochure} disabled={sending}>
                    <SendIcon /> {sending ? 'Envoi en cours...' : 'Envoyer la brochure'}
                  </button>
                ) : (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', fontSize: '0.78rem', color: '#15803d', fontWeight: 500, textAlign: 'center' }}>
                    ✓ Brochure envoyée — workflow déclenché dans GHL
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* FORMULAIRE */}
        <div style={s.asec}>
          <div style={s.asech}>
            <div style={s.asectag}>Closé 🎉</div>
            <div style={s.asecttl}>Créer le compte</div>
            <div style={s.asecdesc}>Ouvrez le formulaire d'onboarding directement ici.</div>
          </div>
          <div style={s.asecb}>
            <button style={s.bbro(false)} onClick={() => setShowForm(true)}>
              <EditIcon /> Ouvrir le formulaire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN APP ──
export default function App() {
  const [screen, setScreen] = useState('intro') // intro | quiz | result | admin
  const [cur, setCur] = useState(0)
  const [answers, setAnswers] = useState(new Array(QUESTIONS.length).fill(null))
  const [rec, setRec] = useState('signature')

  const startQuiz = () => setScreen('quiz')

  const pick = (i) => {
    const next = [...answers]
    next[cur] = i
    setAnswers(next)
  }

  const next = () => {
    if (answers[cur] === null) return
    if (cur < QUESTIONS.length - 1) {
      setCur(c => c + 1)
    } else {
      const score = answers.reduce((s, a, i) => s + (a !== null ? QUESTIONS[i].s[a] : 0), 0)
      setRec(score <= 4 ? 'essentiel' : 'signature')
      setScreen('result')
    }
  }

  const back = () => { if (cur > 0) setCur(c => c - 1) }

  const goAdmin = () => setScreen('admin')
  const backToResult = () => setScreen('result')
  const viewPodium = () => setScreen('result')

  return (
    <div style={s.wrap}>
      <nav style={s.nav}>
        <span style={s.logo}>OLA</span>
        <div style={s.navR}>
          <span style={s.navTag}>Qualification · Fin de présentation</span>
          <button style={s.adminDot} onClick={goAdmin} title="" />
        </div>
      </nav>

      {screen === 'intro' && <Intro onStart={startQuiz} />}

      {screen === 'quiz' && (
        <Question
          q={QUESTIONS[cur]}
          cur={cur}
          total={QUESTIONS.length}
          answer={answers[cur]}
          onPick={pick}
          onNext={next}
          onBack={back}
        />
      )}

      {screen === 'result' && (
        <Result rec={rec} onSelectPlan={(key) => setRec(key)} />
      )}

      {screen === 'admin' && (
        <Admin rec={rec} onBack={backToResult} onViewPodium={viewPodium} />
      )}
    </div>
  )
}
