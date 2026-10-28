// Bandeira ondulada de quatro cores do Windows XP, desenhada em SVG (decorativa).
// O logo é marca da Microsoft: aqui aparece só como homenagem ao visual do XP.
export function XpFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="xp-flag-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7b4a" />
          <stop offset="1" stopColor="#e2380f" />
        </linearGradient>
        <linearGradient id="xp-flag-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a6e35a" />
          <stop offset="1" stopColor="#4ea317" />
        </linearGradient>
        <linearGradient id="xp-flag-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5fbdff" />
          <stop offset="1" stopColor="#1373d6" />
        </linearGradient>
        <linearGradient id="xp-flag-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe066" />
          <stop offset="1" stopColor="#f2b000" />
        </linearGradient>
      </defs>
      {/* Quatro painéis curvos, como uma bandeira tremulando */}
      <path d="M3 6 C7 3.5 11 3.5 15 5.5 L13.6 15 C9.8 13 6 13 2 15.5 Z" fill="url(#xp-flag-red)" />
      <path
        d="M17 6.5 C21 8.5 25 8.5 29 6 L27.6 15.5 C23.8 18 20 18 15.6 16 Z"
        fill="url(#xp-flag-green)"
      />
      <path
        d="M1.8 17.5 C5.8 15 9.6 15 13.4 17 L12 26.5 C8.2 24.5 4.4 24.5 0.4 27 Z"
        fill="url(#xp-flag-blue)"
      />
      <path
        d="M15.4 18 C19.8 20 23.6 20 27.4 17.5 L26 27 C22.2 29.5 18.4 29.5 14 27.5 Z"
        fill="url(#xp-flag-yellow)"
      />
    </svg>
  )
}
