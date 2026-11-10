/**
 * Aurora backdrop: a deep navy base with soft, slowly drifting glows in the icon palette
 * (indigo, violet, blue, pink, amber). Pure CSS gradients — no image to download, crisp at any
 * resolution, and cheap to animate because only transforms change.
 */
const LAYERS = [
  { color: '99 102 241', alpha: 0.7, at: '18% 22%', size: '42% 48%', anim: 'aurora-a 38s' }, // indigo
  { color: '168 85 247', alpha: 0.55, at: '82% 18%', size: '36% 44%', anim: 'aurora-b 46s' }, // violet
  { color: '37 99 235', alpha: 0.6, at: '74% 82%', size: '46% 52%', anim: 'aurora-c 52s' }, // blue
  { color: '236 72 153', alpha: 0.3, at: '48% 58%', size: '28% 32%', anim: 'aurora-b 60s reverse' }, // pink
  { color: '251 146 60', alpha: 0.28, at: '12% 88%', size: '30% 34%', anim: 'aurora-a 56s reverse' }, // amber
];

export default function Backdrop({ dim = 0 }: { dim?: number }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#07080f]">
      {LAYERS.map((l, i) => (
        <div
          key={i}
          className="absolute -inset-[15%] motion-reduce:!animate-none"
          style={{
            background: `radial-gradient(${l.size} at ${l.at}, rgb(${l.color} / ${l.alpha}) 0%, rgb(${l.color} / ${l.alpha * 0.35}) 35%, transparent 70%)`,
            animation: `${l.anim} ease-in-out infinite alternate`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Faint light ribbon for depth */}
      <div
        className="absolute -inset-[20%] opacity-40 motion-reduce:!animate-none"
        style={{
          background:
            'conic-gradient(from 200deg at 60% 45%, transparent 0deg, rgb(129 140 248 / 0.12) 40deg, transparent 90deg, rgb(244 114 182 / 0.08) 160deg, transparent 220deg)',
          animation: 'aurora-spin 90s linear infinite',
        }}
      />

      {/* Vignette keeps the menu bar, dock and text readable */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 45%, transparent 45%, rgb(4 5 10 / 0.45) 100%), linear-gradient(180deg, rgb(4 5 10 / ${0.25 + dim}) 0%, rgb(4 5 10 / ${dim}) 35%, rgb(4 5 10 / ${0.35 + dim}) 100%)`,
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
