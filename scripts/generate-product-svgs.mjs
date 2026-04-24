// Generate transparent-background SVG "clothing silhouettes" for the homepage canvas.
// Not realistic illustrations — soft editorial blobs suggesting garments.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const out = (name, svg) => {
  const path = `public/products/${name}.svg`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svg.trim());
  console.log('wrote', path);
};

const grad = (id, a, b) => `
<defs>
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${a}"/>
    <stop offset="1" stop-color="${b}"/>
  </linearGradient>
  <filter id="${id}-n" x="0" y="0">
    <feTurbulence baseFrequency="0.9" numOctaves="2" result="t"/>
    <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
</defs>`;

// T-shirt
out('tricko-bezove', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
  ${grad('g1', '#F1E0C6', '#E2C9A0')}
  <path fill="url(#g1)" d="M60 60 L110 40 Q150 65 190 40 L240 60 L270 110 L230 130 L225 320 Q150 335 75 320 L70 130 L30 110 Z"/>
  <path d="M60 60 L110 40 Q150 65 190 40 L240 60 L270 110 L230 130 L225 320 Q150 335 75 320 L70 130 L30 110 Z" fill="url(#g1)" filter="url(#g1-n)"/>
  <path d="M120 50 Q150 70 180 50" stroke="#B08A5A" stroke-width="1.2" fill="none" opacity="0.5"/>
</svg>`);

// Hoodie brick
out('hoodie-cihla', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 380" width="320" height="380">
  ${grad('g2', '#C96F55', '#A44B38')}
  <path fill="url(#g2)" d="M55 90 Q100 50 130 55 Q140 25 160 25 Q180 25 190 55 Q220 50 265 90 L295 140 L250 160 L245 350 Q160 365 75 350 L70 160 L25 140 Z"/>
  <path d="M55 90 Q100 50 130 55 Q140 25 160 25 Q180 25 190 55 Q220 50 265 90 L295 140 L250 160 L245 350 Q160 365 75 350 L70 160 L25 140 Z" fill="url(#g2)" filter="url(#g2-n)"/>
  <path d="M130 55 Q160 90 190 55" stroke="#7A2E1E" stroke-width="2" fill="none" opacity="0.6"/>
  <rect x="148" y="210" width="24" height="90" fill="#7A2E1E" opacity="0.15" rx="4"/>
</svg>`);

// Shirt cream
out('kosile-kremova', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 380" width="300" height="380">
  ${grad('g3', '#FBF3DF', '#ECDDB8')}
  <path fill="url(#g3)" d="M65 70 L110 45 L150 70 L190 45 L235 70 L270 125 L235 145 L230 350 Q150 365 70 350 L65 145 L30 125 Z"/>
  <path d="M65 70 L110 45 L150 70 L190 45 L235 70 L270 125 L235 145 L230 350 Q150 365 70 350 L65 145 L30 125 Z" fill="url(#g3)" filter="url(#g3-n)"/>
  <line x1="150" y1="75" x2="150" y2="345" stroke="#B08A5A" stroke-width="1" opacity="0.4"/>
  <circle cx="150" cy="140" r="2.5" fill="#B08A5A" opacity="0.6"/>
  <circle cx="150" cy="190" r="2.5" fill="#B08A5A" opacity="0.6"/>
  <circle cx="150" cy="240" r="2.5" fill="#B08A5A" opacity="0.6"/>
  <circle cx="150" cy="290" r="2.5" fill="#B08A5A" opacity="0.6"/>
</svg>`);

// Sweatpants sand
out('teplaky-pisek', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 420" width="240" height="420">
  ${grad('g4', '#E8CFA9', '#C9A876')}
  <path fill="url(#g4)" d="M40 20 Q120 10 200 20 L215 90 L195 400 L135 400 L120 180 L105 400 L45 400 L25 90 Z"/>
  <path d="M40 20 Q120 10 200 20 L215 90 L195 400 L135 400 L120 180 L105 400 L45 400 L25 90 Z" fill="url(#g4)" filter="url(#g4-n)"/>
  <path d="M40 30 Q120 22 200 30" stroke="#8B6736" stroke-width="1.5" fill="none" opacity="0.5"/>
</svg>`);

// Cap with logo
out('cepice-logo', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 200" width="260" height="200">
  ${grad('g5', '#3B2A23', '#1F1612')}
  <path fill="url(#g5)" d="M50 120 Q60 55 130 50 Q200 55 210 120 L220 125 L240 170 L20 170 L40 125 Z"/>
  <path d="M50 120 Q60 55 130 50 Q200 55 210 120 L220 125 L240 170 L20 170 L40 125 Z" fill="url(#g5)" filter="url(#g5-n)"/>
  <text x="130" y="115" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-style="italic" fill="#F5E6D3">D</text>
  <path d="M20 170 L240 170" stroke="#0F0A08" stroke-width="1" opacity="0.6"/>
</svg>`);

// Zip sweatshirt rust
out('mikina-zip-rust', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 380" width="320" height="380">
  ${grad('g6', '#B55A3A', '#8A3E22')}
  <path fill="url(#g6)" d="M55 90 Q110 55 150 55 L170 55 Q210 55 265 90 L295 140 L250 160 L245 350 Q160 365 75 350 L70 160 L25 140 Z"/>
  <path d="M55 90 Q110 55 150 55 L170 55 Q210 55 265 90 L295 140 L250 160 L245 350 Q160 365 75 350 L70 160 L25 140 Z" fill="url(#g6)" filter="url(#g6-n)"/>
  <line x1="160" y1="55" x2="160" y2="355" stroke="#3B1A0E" stroke-width="2" opacity="0.7"/>
  <rect x="156" y="55" width="8" height="300" fill="url(#g6)" opacity="0.2"/>
</svg>`);

// Knit beige (bonus)
out('plet-bezova', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 370" width="300" height="370">
  ${grad('g7', '#E4D0AF', '#BFA479')}
  <path fill="url(#g7)" d="M55 80 L105 55 Q150 80 195 55 L245 80 L275 135 L235 155 L230 340 Q150 355 70 340 L65 155 L25 135 Z"/>
  <path d="M55 80 L105 55 Q150 80 195 55 L245 80 L275 135 L235 155 L230 340 Q150 355 70 340 L65 155 L25 135 Z" fill="url(#g7)" filter="url(#g7-n)"/>
  <g stroke="#8B6736" stroke-width="0.6" opacity="0.45" fill="none">
    <path d="M75 170 Q150 185 225 170"/>
    <path d="M75 200 Q150 215 225 200"/>
    <path d="M75 230 Q150 245 225 230"/>
    <path d="M75 260 Q150 275 225 260"/>
    <path d="M75 290 Q150 305 225 290"/>
  </g>
</svg>`);

// Scarf dusty red
out('sala-ruzova', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 360" width="240" height="360">
  ${grad('g8', '#E8B0A4', '#B96A5A')}
  <path fill="url(#g8)" d="M90 20 Q120 50 150 20 L180 50 Q150 110 190 180 Q155 260 180 340 L150 340 Q125 250 120 180 Q115 250 90 340 L60 340 Q85 260 50 180 Q90 110 60 50 Z"/>
  <path d="M90 20 Q120 50 150 20 L180 50 Q150 110 190 180 Q155 260 180 340 L150 340 Q125 250 120 180 Q115 250 90 340 L60 340 Q85 260 50 180 Q90 110 60 50 Z" fill="url(#g8)" filter="url(#g8-n)"/>
</svg>`);

console.log('done');
