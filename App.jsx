import { useState, useEffect, useRef } from 'react'
import { PLANS, SUBS, GHL_WEBHOOK } from './data.js'

const VIDEO_URL = 'https://assets.cdn.filesafe.space/DL5vmvAkiRP13UUTG58Q/media/69a099bf13b8420e03b4ceab.mp4'

// ── QUESTIONS REWRITTEN ──
const QUESTIONS = [
  {
    n: 'Question 1 sur 7',
    t: 'Combien de transactions fais-tu par année?',
    opts: ['Moins de 20', 'Entre 20 et 50', 'Plus de 50'],
    s: [0, 1, 2],
  },
  {
    n: 'Question 2 sur 7',
    t: 'Combien de relances tu oublies ou retardes par semaine?',
    opts: ['Rarement — je suis assez organisé', '2-3 par semaine — ça m\'arrive', '5 et plus — je perds des deals à cause de ça'],
    s: [0, 1, 2],
  },
  {
    n: 'Question 3 sur 7',
    t: 'Comment tu gères tes demandes d\'infos Centris aujourd\'hui?',
    opts: ['Manuellement — je réponds à chaque demande à la main', 'J\'ai un système partiel mais c\'est pas automatique', 'C\'est déjà automatisé'],
    s: [2, 1, 0],
  },
  {
    n: 'Question 4 sur 7',
    t: 'Combien d\'heures par semaine tu passes sur des tâches administratives?',
    opts: ['Moins de 5 heures', 'Entre 5 et 15 heures', 'Plus de 15 heures — c\'est trop'],
    s: [0, 1, 2],
  },
  {
    n: 'Question 5 sur 7',
    t: 'Tu travailles avec une assistante ou seul?',
    opts: ['Seul — je gère tout moi-même', 'Avec une assistante à temps partiel', 'Avec une équipe'],
    s: [2, 1, 0],
  },
  {
    n: 'Question 6 sur 7',
    t: 'Qu\'est-ce que tu préfères pour la mise en place?',
    opts: ['Qu\'on configure tout pour moi — je veux juste utiliser', 'Un mix — guidé au début, autonome après', 'Je veux apprendre et maîtriser le système moi-même'],
    s: [2, 1, 0],
  },
  {
    n: 'Question 7 sur 7',
    t: 'Dans combien de temps tu veux être opérationnel?',
    opts: ['Cette semaine — je suis prêt', 'Dans les prochaines semaines', 'Je prends le temps qu\'il faut'],
    s: [2, 1, 0],
  },
]

// ── TESTIMONIALS ──
const TESTIMONIALS = [
  {
    quote: "J'ai jamais vu un CRM aussi complet. Un courtier peut rouler sans adjoint pendant un méchant bout avec OLA.",
    author: "Courtier immobilier",
    location: "Québec",
  },
  {
    quote: "Ma business va exploser entre 20 à 50% dans les deux prochaines années juste avec OLA de plus.",
    author: "Courtier immobilier",
    location: "Montréal",
  },
  {
    quote: "Juste avec les demandes Centris, ça fait une grosse différence. Le client répondait « Waouh, merci pour ton service rapide. »",
    author: "Courtier immobilier",
    location: "Rive-Sud",
  },
  {
    quote: "Si t'es pas encore avec OLA, c'est sûrement parce que tu as beaucoup de temps à perdre.",
    author: "Courtier immobilier",
    location: "Laval",
  },
]

// ── PAIN STATS ──
const PAIN_STATS = [
  { num: '73%', label: 'des deals perdus sont dus à un manque de suivi — pas à la compétition' },
  { num: '11h', label: 'par semaine perdues en tâches admin qui pourraient être automatisées' },
  { num: '3×', label: 'plus de chances de closer un lead contacté dans les 5 premières minutes' },
  { num: '40%', label: 'des courtiers abandonnent un lead après seulement 1 tentative de contact' },
]

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
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const QuoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.12 }}>
    <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.81 1.24-1.48 2.13-2.01L9.027 6c-1.49.68-2.67 1.64-3.55 2.88C4.6 10.12 4.16 11.55 4.16 13.18c0 1.39.37 2.54 1.1 3.44.74.9 1.69 1.35 2.85 1.35 1.01 0 1.85-.32 2.52-.95.67-.64 1-.45 1-1.25zm8.461 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.95.1-1.95.78-3 .53-.81 1.24-1.48 2.13-2.01L17.49 6c-1.49.68-2.67 1.64-3.55 2.88-.88 1.24-1.32 2.67-1.32 4.3 0 1.39.37 2.54 1.1 3.44.74.9 1.69 1.35 2.85 1.35 1.01 0 1.85-.32 2.52-.95.67-.64 1-1.45 1-2.25z" />
  </svg>
)

// ── STYLES ──
const s = {
  wrap: { maxWidth: 900, margin: '0 auto', padding: '0 24px 100px' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 0 0' },
  logo: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.04em' },
  navTag: { fontSize: '0.7rem', fontWeight: 500, color: 'var(--g400)', letterSpacing: '0.04em' },
  navR: { display: 'flex', alignItems: 'center', gap: 14 },
  adminDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--g200)', border: 'none', cursor: 'pointer', flexShrink: 0 },

  // HERO
  heroPill: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--g100)', border: '1px solid var(--g200)', padding: '6px 14px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, color: 'var(--g600)', marginBottom: 36, letterSpacing: '0.03em', textTransform: 'uppercase' },
  heroPillDot: { width: 6, height: 6, borderRadius: '50%', background: '#16a34a' },
  heroH: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(3.2rem, 9vw, 6.5rem)', fontWeight: 800, lineHeight: 0.92, letterSpacing: '-0.055em', marginBottom: 28, maxWidth: 700 },
  heroMuted: { color: 'var(--g400)', fontWeight: 300 },
  heroSub: { fontSize: '1.05rem', color: 'var(--g600)', lineHeight: 1.7, maxWidth: 520, marginBottom: 48 },
  heroCta: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 96 },
  btnBlack: { display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--black)', color: 'var(--white)', fontSize: '0.9rem', fontWeight: 600, padding: '15px 28px', border: 'none', borderRadius: 9, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif' },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--g600)', fontSize: '0.85rem', fontWeight: 500, padding: '14px 0', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },

  // VIDEO
  sectionLabel: { fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 20 },
  videoWrap: { position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0d0d0d', aspectRatio: '16/9', cursor: 'pointer', marginBottom: 96 },
  videoOverlay: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 2 },
  playBtn: { width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', marginBottom: 16, color: '#0d0d0d', paddingLeft: 4 },
  videoCaption: { fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' },
  videoCaptionSub: { fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', marginTop: 5, textAlign: 'center' },

  // PAIN STATS
  painSection: { marginBottom: 96 },
  painGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 },
  painCard: (i) => ({
    padding: '32px 28px',
    background: i % 2 === 0 ? 'var(--black)' : 'var(--g100)',
    borderRadius: i === 0 ? '14px 0 0 0' : i === 1 ? '0 14px 0 0' : i === 2 ? '0 0 0 14px' : '0 0 14px 0',
  }),
  painNum: (dark) => ({ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: 10, color: dark ? 'var(--white)' : 'var(--black)' }),
  painLabel: (dark) => ({ fontSize: '0.82rem', color: dark ? 'rgba(255,255,255,0.5)' : 'var(--g600)', lineHeight: 1.5 }),

  // TESTIMONIALS
  testimonialsSection: { marginBottom: 96 },
  testimonialsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  testimonialCard: { border: '1.5px solid var(--g200)', borderRadius: 14, padding: '28px 24px', position: 'relative', background: 'var(--white)' },
  testimonialQuote: { fontSize: '0.92rem', color: 'var(--black)', lineHeight: 1.65, marginBottom: 20, fontStyle: 'italic' },
  testimonialAuthor: { fontSize: '0.72rem', fontWeight: 600, color: 'var(--black)' },
  testimonialLocation: { fontSize: '0.68rem', color: 'var(--g400)', marginTop: 2 },

  // QUIZ INTRO BANNER
  quizBanner: { background: 'var(--black)', borderRadius: 16, padding: '52px 48px', marginBottom: 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 },
  quizBannerH: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 1.1, marginBottom: 12 },
  quizBannerSub: { fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 },
  btnWhite: { display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--white)', color: 'var(--black)', fontSize: '0.88rem', fontWeight: 700, padding: '15px 28px', border: 'none', borderRadius: 9, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', flexShrink: 0 },

  // QUIZ
  prog: { display: 'flex', gap: 5, marginBottom: 52 },
  progSeg: (state) => ({ flex: 1, height: 3, borderRadius: 2, overflow: 'hidden', position: 'relative', background: state === 'done' ? 'var(--black)' : 'var(--g200)' }),
  qNum: { fontSize: '0.72rem', fontWeight: 500, color: 'var(--g400)', marginBottom: 16 },
  qH: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(1.7rem, 4.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.15, marginBottom: 36, maxWidth: 560 },
  opts: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 },
  opt: (sel) => ({ display: 'flex', alignItems: 'center', gap: 14, border: `1.5px solid ${sel ? 'var(--black)' : 'var(--g200)'}`, borderRadius: 10, padding: '16px 18px', cursor: 'pointer', background: sel ? 'var(--black)' : 'var(--white)', color: sel ? 'var(--white)' : 'var(--black)', fontSize: '0.88rem', fontWeight: 400, textAlign: 'left', width: '100%', transition: 'all 0.12s' }),
  optKey: (sel) => ({ width: 26, height: 26, borderRadius: 6, border: `1.5px solid ${sel ? 'rgba(255,255,255,0.25)' : 'var(--g200)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 700, color: sel ? 'rgba(255,255,255,0.6)' : 'var(--g400)', background: sel ? 'rgba(255,255,255,0.1)' : 'transparent', flexShrink: 0 }),
  qAct: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 36 },
  btnNext: (on) => ({ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--black)', color: 'var(--white)', fontSize: '0.83rem', fontWeight: 600, padding: '13px 22px', border: 'none', borderRadius: 7, cursor: on ? 'pointer' : 'not-allowed', opacity: on ? 1 : 0.2, pointerEvents: on ? 'all' : 'none', transition: 'all 0.12s', fontFamily: 'Inter, sans-serif' }),
  btnBack: { background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 500, color: 'var(--g400)', cursor: 'pointer', padding: '12px 2px', fontFamily: 'Inter, sans-serif' },

  // RESULT
  rpill: { display: 'inline-flex', alignItems: 'center', gap: 7, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '5px 13px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 500, color: '#15803d', marginBottom: 22 },
  rpdot: { width: 6, height: 6, borderRadius: '50%', background: '#16a34a' },
  rH: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(1.9rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10 },
  rS: { fontSize: '0.88rem', color: 'var(--g600)', lineHeight: 1.6, maxWidth: 520, marginBottom: 52 },
  podium: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, alignItems: 'end' },
  card: (type) => ({ border: type === 'feat' ? '2px solid var(--black)' : '1.5px solid var(--g200)', borderRadius: 14, padding: '26px 20px', background: type === 'feat' ? 'var(--black)' : 'var(--white)', color: type === 'feat' ? 'var(--white)' : 'var(--black)', position: 'relative', cursor: 'pointer', opacity: type === 'decoy' ? 0.18 : type === 'sec' ? 0.38 : 1, transform: type === 'feat' ? 'scale(1.04)' : type === 'sec' ? 'scale(0.92) translateY(14px)' : 'scale(0.86) translateY(24px)', filter: type === 'decoy' ? 'blur(0.6px)' : 'none', zIndex: type === 'feat' ? 2 : 1, boxShadow: type === 'feat' ? '0 24px 64px rgba(0,0,0,0.16)' : 'none', transition: 'all 0.3s ease' }),
  rbadge: { position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--white)', color: 'var(--black)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 100, whiteSpace: 'nowrap', border: '1.5px solid var(--g200)' },
  cName: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 18 },
  cPrice: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 3 },

  // ADMIN
  admHead: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 },
  abk: { background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 500, color: 'var(--g400)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif' },
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
  bbro: (disabled) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: 'var(--black)', color: 'var(--white)', fontSize: '0.82rem', fontWeight: 600, padding: '13px 20px', border: 'none', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.25 : 1, marginTop: 4, transition: 'all 0.12s', fontFamily: 'Inter, sans-serif' }),
  cselBox: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1.5px solid var(--black)', borderRadius: 8, background: 'var(--g100)', marginBottom: 10 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, backdropFilter: 'blur(4px)' },
  popup: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(680px, 95vw)', maxHeight: '90vh', background: '#fff', borderRadius: 16, zIndex: 1001, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' },
  popupHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--g200)', flexShrink: 0 },
  popupClose: { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--g400)', padding: '4px 8px' },
}

// ── LANDING ──
function Landing({ onStart, onAdmin }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else { videoRef.current.play(); setPlaying(true) }
  }

  return (
    <div className="fade-up">
      <nav style={s.nav}>
        <span style={s.logo}>OLA</span>
        <div style={s.navR}>
          <span style={s.navTag}>Présentation · Demo</span>
          <button style={s.adminDot} onClick={onAdmin} title="" />
        </div>
      </nav>

      {/* HERO */}
      <div style={{ paddingTop: 80 }}>
        <div style={s.heroPill}><span style={s.heroPillDot}></span> Le CRM #1 des courtiers au Québec</div>
        <h1 style={s.heroH}>
          Closez plus.<br />
          <span style={s.heroMuted}>Travaillez moins.</span>
        </h1>
        <p style={s.heroSub}>Le système utilisé par des courtiers qui font 100+ transactions par année — seuls — pour dominer leur marché.</p>
        <div style={s.heroCta}>
          <button style={s.btnBlack} onClick={onStart}>Trouver mon forfait <ArrowRight /></button>
          <button style={s.btnGhost} onClick={togglePlay}><PlayIcon />&nbsp;&nbsp;Voir les résultats de courtiers</button>
        </div>
      </div>

      {/* VIDEO */}
      <div style={s.sectionLabel}>Ce que disent nos courtiers</div>
      <div style={s.videoWrap} onClick={togglePlay}>
        <video ref={videoRef} src={VIDEO_URL} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} playsInline onEnded={() => setPlaying(false)} />
        {!playing && (
          <div style={s.videoOverlay}>
            <button style={s.playBtn}><PlayIcon /></button>
            <div style={s.videoCaption}>Témoignages de courtiers</div>
            <div style={s.videoCaptionSub}>Montage · Résultats réels</div>
          </div>
        )}
      </div>

      {/* PAIN STATS */}
      <div style={s.painSection}>
        <div style={s.sectionLabel}>La réalité du courtage sans système</div>
        <div style={s.painGrid}>
          {PAIN_STATS.map((st, i) => {
            const dark = i % 2 === 0
            return (
              <div key={i} style={s.painCard(i)}>
                <div style={s.painNum(dark)}>{st.num}</div>
                <div style={s.painLabel(dark)}>{st.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={s.testimonialsSection}>
        <div style={s.sectionLabel}>Ce qu'ils disent vraiment</div>
        <div style={s.testimonialsGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={s.testimonialCard}>
              <QuoteIcon />
              <p style={s.testimonialQuote}>"{t.quote}"</p>
              <div style={s.testimonialAuthor}>{t.author}</div>
              <div style={s.testimonialLocation}>{t.location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* QUIZ BANNER CTA */}
      <div style={s.quizBanner}>
        <div>
          <div style={s.quizBannerH}>Quel forfait<br />est fait pour vous?</div>
          <div style={s.quizBannerSub}>7 questions · 90 secondes · Résultat personnalisé</div>
        </div>
        <button style={s.btnWhite} onClick={onStart}>
          Commencer le quiz <ArrowRight />
        </button>
      </div>
    </div>
  )
}

// ── PROGRESS BAR ──
function ProgressBar({ cur, total }) {
  return (
    <div style={s.prog}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={s.progSeg(i < cur ? 'done' : i === cur ? 'cur' : 'idle')}>
          {i === cur && <div style={{ position: 'absolute', inset: 0, background: 'var(--black)', borderRadius: 2, animation: 'fillBar 0.35s ease forwards' }} />}
        </div>
      ))}
    </div>
  )
}

// ── QUESTION ──
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
            <span style={s.optKey(answer === i)}>{keys[i]}</span>{opt}
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

// ── PLAN CARD ──
function PlanCard({ planKey, type, onClick }) {
  const p = PLANS[planKey]
  const isFeat = type === 'feat'
  const fc = isFeat ? 'rgba(255,255,255,0.62)' : 'var(--g600)'
  const dc = isFeat ? 'rgba(255,255,255,0.1)' : 'var(--g200)'
  const nc = isFeat ? 'rgba(255,255,255,0.38)' : 'var(--g400)'
  return (
    <div style={s.card(type)} onClick={onClick}>
      {isFeat && <div style={s.rbadge}>Sélectionné</div>}
      <div style={s.cName}>{p.name}</div>
      <div style={s.cPrice}>{p.price}</div>
      <div style={{ fontSize: '0.62rem', color: nc, marginBottom: 18 }}>{p.note}</div>
      <div style={{ height: 1, background: dc, marginBottom: 16 }}></div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {p.feats.map((f, i) => (
          <li key={i} style={{ fontSize: '0.73rem', color: fc, lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: isFeat ? 'rgba(255,255,255,0.45)' : 'var(--g400)', flexShrink: 0, marginTop: 1 }}>✓</span>{f}
          </li>
        ))}
      </ul>
      {isFeat && <div style={{ fontSize: '0.68rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)', lineHeight: 1.4 }}>{p.tag}</div>}
    </div>
  )
}

// ── RESULT ──
function Result({ rec, onSelectPlan }) {
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

// ── FORM POPUP ──
function FormPopup({ rec, onClose }) {
  const p = PLANS[rec]
  useEffect(() => {
    const ex = document.getElementById('ghlEmbedScript')
    if (ex) ex.remove()
    const sc = document.createElement('script')
    sc.id = 'ghlEmbedScript'
    sc.src = 'https://api.ola-ai.ca/js/form_embed.js'
    document.body.appendChild(sc)
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
          <iframe src="https://api.ola-ai.ca/widget/survey/QO5yOsTIIctYRZ9l9wSP" style={{ border: 'none', width: '100%', minHeight: 600, display: 'block' }} scrolling="no" id="QO5yOsTIIctYRZ9l9wSP" title="Formulaire OLA" />
        </div>
      </div>
    </>
  )
}

// ── ADMIN ──
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
    setName(''); setEmail('')
  }

  const sendBrochure = async () => {
    if (!contact) return
    setSending(true)
    try {
      await fetch(GHL_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contact.name, email: contact.email, forfait: p.name, forfait_prix: p.price, forfait_mensuel: p.note, date: new Date().toISOString() }),
        mode: 'no-cors',
      })
      setSent(true)
    } catch (e) { console.error(e) }
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
                <button style={s.bbro(!name || !email)} onClick={confirmContact} disabled={!name || !email}>Confirmer le contact</button>
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
                {!sent
                  ? <button style={s.bbro(sending)} onClick={sendBrochure} disabled={sending}><SendIcon /> {sending ? 'Envoi en cours...' : 'Envoyer la brochure'}</button>
                  : <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', fontSize: '0.78rem', color: '#15803d', fontWeight: 500, textAlign: 'center' }}>✓ Brochure envoyée — workflow déclenché dans GHL</div>
                }
              </>
            )}
          </div>
        </div>
        <div style={s.asec}>
          <div style={s.asech}>
            <div style={s.asectag}>Closé 🎉</div>
            <div style={s.asecttl}>Créer le compte</div>
            <div style={s.asecdesc}>Ouvrez le formulaire d'onboarding directement ici.</div>
          </div>
          <div style={s.asecb}>
            <button style={s.bbro(false)} onClick={() => setShowForm(true)}><EditIcon /> Ouvrir le formulaire</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN APP ──
export default function App() {
  const [screen, setScreen] = useState('landing')
  const [cur, setCur] = useState(0)
  const [answers, setAnswers] = useState(new Array(QUESTIONS.length).fill(null))
  const [rec, setRec] = useState('signature')

  useEffect(() => { window.scrollTo(0, 0) }, [screen])

  const pick = (i) => { const next = [...answers]; next[cur] = i; setAnswers(next) }

  const next = () => {
    if (answers[cur] === null) return
    if (cur < QUESTIONS.length - 1) { setCur(c => c + 1) }
    else {
      const score = answers.reduce((sum, a, i) => sum + (a !== null ? QUESTIONS[i].s[a] : 0), 0)
      setRec(score <= 5 ? 'essentiel' : 'signature')
      setScreen('result')
    }
  }

  const goAdmin = () => setScreen('admin')

  return (
    <div style={s.wrap}>
      {screen !== 'landing' && (
        <nav style={s.nav}>
          <span style={{ ...s.logo, cursor: 'pointer' }} onClick={() => setScreen('landing')}>OLA</span>
          <div style={s.navR}>
            <span style={s.navTag}>Qualification · Fin de présentation</span>
            <button style={s.adminDot} onClick={goAdmin} title="" />
          </div>
        </nav>
      )}
      <div style={screen !== 'landing' ? { paddingTop: 64 } : {}}>
        {screen === 'landing' && <Landing onStart={() => setScreen('quiz')} onAdmin={goAdmin} />}
        {screen === 'quiz' && <Question q={QUESTIONS[cur]} cur={cur} total={QUESTIONS.length} answer={answers[cur]} onPick={pick} onNext={next} onBack={() => cur > 0 && setCur(c => c - 1)} />}
        {screen === 'result' && <Result rec={rec} onSelectPlan={(key) => setRec(key)} />}
        {screen === 'admin' && <Admin rec={rec} onBack={() => setScreen('result')} onViewPodium={() => setScreen('result')} />}
      </div>
    </div>
  )
}
