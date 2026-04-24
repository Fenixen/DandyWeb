import { writeFileSync } from 'node:fs';
const w = (name, gradient) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1170" height="2532" viewBox="0 0 1170 2532">
  <defs>
    <filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2"/><feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0.9 0"/></filter>
  </defs>
  <rect width="1170" height="2532" fill="url(#g)"/>
  <defs>${gradient}</defs>
  <rect width="1170" height="2532" fill="url(#g)"/>
  <rect width="1170" height="2532" filter="url(#n)" opacity="0.2" style="mix-blend-mode:multiply"/>
  <text x="585" y="2400" text-anchor="middle" font-family="Georgia, serif" font-size="56" font-style="italic" fill="rgba(26,22,20,0.7)">Dandy&#39;s Wear</text>
</svg>`;
  writeFileSync(`public/wallpapers/${name}.svg`, svg);
  console.log('wrote', name);
};
w('beige-grain', '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5E6D3"/><stop offset="1" stop-color="#ECD0AC"/></linearGradient>');
w('dusty-sunset', '<radialGradient id="g" cx="0.3" cy="0.2"><stop offset="0" stop-color="#F5E6D3"/><stop offset="0.7" stop-color="#F0C9C0"/><stop offset="1" stop-color="#E2A89C"/></radialGradient>');
w('clay-field', '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C96F55"/><stop offset="1" stop-color="#7A3A26"/></linearGradient>');
w('cream-breath', '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF5EC"/><stop offset="1" stop-color="#ECDDB8"/></linearGradient>');
