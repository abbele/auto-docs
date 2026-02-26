# Workshop: Documentation-as-Code & AI Context Engineering

Presentazione interattiva che simula Visual Studio Code.

## Avvio rapido

```bash
# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Navigazione

| Azione | Come |
|--------|------|
| Slide successiva | `→` o `↓` |
| Slide precedente | `←` o `↑` |
| Apri/chiudi terminale | `` ` `` (backtick) |
| Vai a slide specifica | Click sul file nella sidebar o sul tab |

## Build statica (SSG)

```bash
npm run build
```

I file statici saranno generati nella cartella `out/`. Puoi servili con qualsiasi server statico o deployare su Vercel, Netlify, GitHub Pages, ecc.

## Stack

- Next.js 15 (App Router, Static Export)
- React 19
- Zero dipendenze extra — tutto CSS-in-JS inline
