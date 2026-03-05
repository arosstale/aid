import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  spring,
} from 'remotion';
import { SLIDES } from './slides.js';

// ── Color palette (matches the HTML deck) ──────────────────────────────────
const C = {
  bg:      '#0c1018',
  surface: '#141b28',
  surface2:'#1a2436',
  text:    '#e2e8f0',
  dim:     '#8896a8',
  accent:  '#38bdf8',
  green:   '#34d399',
  amber:   '#fbbf24',
  rose:    '#fb7185',
  teal:    '#2dd4bf',
  red:     '#f87171',
  code:    '#080c14',
};
const colorFor = (c) => C[c] || C.accent;

const FONT = '"DM Sans", system-ui, sans-serif';
const MONO = '"Fira Code", "SF Mono", Consolas, monospace';

const SLIDE_DUR = 180; // 6 seconds per slide at 30fps

// ── Shared animated entry ──────────────────────────────────────────────────
function FadeUp({ children, delay = 0, style = {} }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.6 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
}

// ── Slide type renderers ───────────────────────────────────────────────────

function TitleSlide({ heading, label }) {
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, rgba(56,189,248,0.12) 0%, transparent 50%), ${C.bg}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: FONT }}>
      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <FadeUp delay={6}>
        <div style={{ fontSize: 14, color: C.accent, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>{label}</div>
      </FadeUp>
      <FadeUp delay={12}>
        <div style={{ fontSize: 72, fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: 1.1, maxWidth: 900, whiteSpace: 'pre-line', textShadow: '0 0 80px rgba(56,189,248,0.3)' }}>{heading}</div>
      </FadeUp>
    </AbsoluteFill>
  );
}

function DividerSlide({ num, heading, label, bg }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numScale = spring({ frame, fps, config: { damping: 30, mass: 1.2 } });
  const col = colorFor(bg);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 60% 50%, ${col}18 0%, transparent 40%), ${C.bg}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 100px', fontFamily: FONT }}>
      {/* Big number */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -55%) scale(${numScale})`, fontSize: 260, fontWeight: 200, lineHeight: 0.85, opacity: 0.05, color: col, pointerEvents: 'none' }}>{num}</div>
      <FadeUp delay={8}>
        <div style={{ fontSize: 13, color: col, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 16 }}>{label}</div>
      </FadeUp>
      <FadeUp delay={14}>
        <div style={{ fontSize: 56, fontWeight: 700, color: C.text, lineHeight: 1.15, maxWidth: 800 }}>{heading}</div>
      </FadeUp>
    </AbsoluteFill>
  );
}

function QuoteSlide({ quote, cite, bg }) {
  const col = colorFor(bg);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${col}15 0%, transparent 50%), ${C.bg}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 120px', fontFamily: FONT }}>
      <FadeUp delay={6}>
        <div style={{ fontSize: 80, color: col, opacity: 0.3, marginBottom: -20 }}>&ldquo;</div>
      </FadeUp>
      <FadeUp delay={12}>
        <div style={{ fontSize: 36, fontWeight: 500, fontStyle: 'italic', color: C.text, textAlign: 'center', lineHeight: 1.4, maxWidth: 860, whiteSpace: 'pre-line' }}>{quote}</div>
      </FadeUp>
      <FadeUp delay={20}>
        <div style={{ fontSize: 13, fontFamily: MONO, color: C.dim, letterSpacing: 2, textTransform: 'uppercase', marginTop: 32 }}>— {cite}</div>
      </FadeUp>
    </AbsoluteFill>
  );
}

function ContentSlide({ label, heading, bullets, aside }) {
  return (
    <AbsoluteFill style={{ background: C.bg, display: 'flex', padding: '80px 100px', fontFamily: FONT, gap: 60 }}>
      <div style={{ flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {label && <FadeUp delay={4}><div style={{ fontSize: 13, color: C.accent, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>{label}</div></FadeUp>}
        <FadeUp delay={10}><div style={{ fontSize: 44, fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 28 }}>{heading}</div></FadeUp>
        {bullets && bullets.map((b, i) => (
          <FadeUp key={i} delay={18 + i * 8}>
            <div style={{ fontSize: 22, color: C.dim, lineHeight: 1.6, marginBottom: 8, paddingLeft: 20, borderLeft: `2px solid ${C.accent}30` }}>{b}</div>
          </FadeUp>
        ))}
      </div>
      {aside && (
        <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FadeUp delay={24}>
            <div style={{ fontFamily: MONO, fontSize: 18, color: C.green, lineHeight: 2, background: C.surface, padding: '32px 28px', borderRadius: 12, border: `1px solid ${C.accent}20`, whiteSpace: 'pre-line' }}>{aside}</div>
          </FadeUp>
        </div>
      )}
    </AbsoluteFill>
  );
}

function SplitSlide({ heading, left, right }) {
  return (
    <AbsoluteFill style={{ display: 'flex', fontFamily: FONT }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: C.surface, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 56px' }}>
        {left.label && <FadeUp delay={4}><div style={{ fontSize: 13, color: C.green, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>{left.label}</div></FadeUp>}
        <FadeUp delay={10}><div style={{ fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 24 }}>{heading}</div></FadeUp>
        {left.items && left.items.map((item, i) => (
          <FadeUp key={i} delay={16 + i * 7}>
            <div style={{ fontSize: 20, color: C.dim, lineHeight: 1.6, marginBottom: 8, paddingLeft: 16, borderLeft: `2px solid ${C.green}40` }}>{item}</div>
          </FadeUp>
        ))}
      </div>
      {/* Right panel */}
      <div style={{ flex: 1, background: C.surface2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 56px' }}>
        {right.label && <FadeUp delay={8}><div style={{ fontSize: 13, color: C.amber, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>{right.label}</div></FadeUp>}
        {right.items && right.items.map((item, i) => (
          <FadeUp key={i} delay={20 + i * 7}>
            <div style={{ fontSize: 20, color: C.dim, lineHeight: 1.6, marginBottom: 8, paddingLeft: 16, borderLeft: `2px solid ${C.amber}40` }}>{item}</div>
          </FadeUp>
        ))}
        {right.code && (
          <FadeUp delay={16}>
            <div style={{ fontFamily: MONO, fontSize: 18, color: C.green, lineHeight: 2, background: C.code, padding: '24px 20px', borderRadius: 8, whiteSpace: 'pre-line', marginTop: 8 }}>{right.code}</div>
          </FadeUp>
        )}
      </div>
    </AbsoluteFill>
  );
}

function CodeSlide({ label, heading, code }) {
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 80%, ${C.green}12 0%, transparent 40%), ${C.bg}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 80px', fontFamily: FONT }}>
      {label && <FadeUp delay={4}><div style={{ fontSize: 13, color: C.green, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>{label}</div></FadeUp>}
      <FadeUp delay={10}><div style={{ fontSize: 36, fontWeight: 700, color: C.text, marginBottom: 32, textAlign: 'center' }}>{heading}</div></FadeUp>
      <FadeUp delay={18}>
        <div style={{ fontFamily: MONO, fontSize: 19, color: C.code === '#080c14' ? '#cbd5e1' : C.text, lineHeight: 1.9, background: C.code, padding: '32px 40px', borderRadius: 12, border: `1px solid ${C.green}20`, whiteSpace: 'pre', maxWidth: 900, width: '100%' }}>{code}</div>
      </FadeUp>
    </AbsoluteFill>
  );
}

function TableSlide({ heading, headers, rows }) {
  const cellStyle = { padding: '12px 20px', borderBottom: `1px solid ${C.accent}15`, fontSize: 18, color: C.dim };
  const headerStyle = { ...cellStyle, color: C.accent, fontFamily: MONO, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 };
  return (
    <AbsoluteFill style={{ background: C.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 80px', fontFamily: FONT }}>
      <FadeUp delay={6}><div style={{ fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 36 }}>{heading}</div></FadeUp>
      <FadeUp delay={14}>
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 1000 }}>
          <thead><tr>{headers.map((h, i) => <th key={i} style={headerStyle}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((row, ri) => (
            <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={cellStyle}>{cell}</td>)}</tr>
          ))}</tbody>
        </table>
      </FadeUp>
    </AbsoluteFill>
  );
}

function DashboardSlide({ heading, kpis }) {
  return (
    <AbsoluteFill style={{ background: C.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 80px', fontFamily: FONT }}>
      <FadeUp delay={6}><div style={{ fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 48 }}>{heading}</div></FadeUp>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', maxWidth: 960 }}>
        {kpis.map((kpi, i) => (
          <FadeUp key={i} delay={14 + i * 6} style={{ background: C.surface, border: `1px solid ${C.accent}20`, borderRadius: 12, padding: '24px 32px', minWidth: 160, textAlign: 'center' }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: C.accent, marginBottom: 8 }}>{kpi.val}</div>
            <div style={{ fontSize: 14, fontFamily: MONO, color: C.dim, letterSpacing: 1.5, textTransform: 'uppercase' }}>{kpi.label}</div>
          </FadeUp>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function StepsSlide({ heading, steps }) {
  return (
    <AbsoluteFill style={{ background: C.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', fontFamily: FONT }}>
      <FadeUp delay={6}><div style={{ fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 40, textAlign: 'center' }}>{heading}</div></FadeUp>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {steps.map((s, i) => {
          const col = colorFor(s.color === 'dim' ? 'dim' : s.color);
          return (
            <FadeUp key={i} delay={14 + i * 6}>
              <div style={{ background: C.surface, border: `1px solid ${col}30`, borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: col, marginBottom: 6 }}>{s.num}. {s.label}</div>
                <div style={{ fontSize: 16, color: C.dim, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function FinalSlide({ heading, links }) {
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, ${C.accent}12 0%, transparent 50%), ${C.bg}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 100px', fontFamily: FONT }}>
      <FadeUp delay={8}><div style={{ fontSize: 52, fontWeight: 800, color: C.text, marginBottom: 40, textAlign: 'center' }}>{heading}</div></FadeUp>
      {links.map((link, i) => (
        <FadeUp key={i} delay={18 + i * 6}>
          <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim, marginBottom: 12 }}>{link}</div>
        </FadeUp>
      ))}
    </AbsoluteFill>
  );
}

// ── Slide renderer dispatch ────────────────────────────────────────────────
function RenderSlide({ slide }) {
  switch (slide.type) {
    case 'title':     return <TitleSlide {...slide} />;
    case 'divider':   return <DividerSlide {...slide} />;
    case 'quote':     return <QuoteSlide {...slide} />;
    case 'content':   return <ContentSlide {...slide} />;
    case 'split':     return <SplitSlide {...slide} />;
    case 'code':      return <CodeSlide {...slide} />;
    case 'table':     return <TableSlide {...slide} />;
    case 'dashboard': return <DashboardSlide {...slide} />;
    case 'steps':     return <StepsSlide {...slide} />;
    case 'final':     return <FinalSlide {...slide} />;
    default:          return <ContentSlide heading={slide.type} bullets={['Unknown slide type']} />;
  }
}

// ── Cross-fade transition between slides ───────────────────────────────────
const TRANSITION = 15; // frames of crossfade

export function Presentation() {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {SLIDES.map((slide, i) => (
        <Sequence key={i} from={i * SLIDE_DUR} durationInFrames={SLIDE_DUR + TRANSITION}>
          <SlideWithTransition index={i}>
            <RenderSlide slide={slide} />
          </SlideWithTransition>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

function SlideWithTransition({ children, index }) {
  const frame = useCurrentFrame();
  // Fade in
  const fadeIn = interpolate(frame, [0, TRANSITION], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Fade out
  const fadeOut = interpolate(frame, [SLIDE_DUR - TRANSITION, SLIDE_DUR], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = index === 0 ? fadeOut : Math.min(fadeIn, fadeOut);
  // First slide doesn't fade in
  const finalOpacity = index === 0 ? interpolate(frame, [SLIDE_DUR - TRANSITION, SLIDE_DUR], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : opacity;

  return <AbsoluteFill style={{ opacity: finalOpacity }}>{children}</AbsoluteFill>;
}
