# As Aventuras do Martim e da Esperança

A colourful 2D platform game for young children, starring Martim (8) and his little sister Esperança (2), with the family's Maltese dog always running alongside. All in-game text is in European Portuguese.

## The game

- **Six levels**, each with its own scenery, enemies, boss, music and ending cutscene:
  1. Funchal, Madeira
  2. Lisboa
  3. Porto Santo
  4. O Aeroporto
  5. Em Casa
  6. Londres
- **Two heroes:** Martim kicks a football and jumps higher; Esperança swings her teddy bear and can double jump.
- **1 or 2 players.** In 1-player mode the other hero follows with a simple AI. 2 players share one keyboard.
- **Super power:** find a hidden golden *chave especial* for 30 seconds of power-ups.
- **Phones and tablets:** landscape touch controls, installable as a home-screen app.

### Controls

| Action | Keyboard | 2 players |
|---|---|---|
| Move | Arrows / WASD | Martim A/D · Esperança ←/→ |
| Jump | Space / Up | Martim W · Esperança ↑ |
| Attack | X | Martim F · Esperança L |
| Switch hero | C / Tab | — |
| Pause / Mute | P / M | — |

## How it's built

Everything lives in one file, `index.html`: HTML, CSS and a single script drawing on a 2D canvas. There are no image or audio files. Every character, enemy and background is drawn in code, and all music and sound effects are synthesized with the Web Audio API.

```
index.html              the whole game
build.mjs               wraps index.html into dist/ with a PWA manifest and icons
assets/                 app icons
ANTIGRAVITY_PROMPT.md   design spec and notes for continuing development
```

## Running it

```bash
npm run build                       # writes dist/
python3 -m http.server 8765 --directory dist
```

Then open http://localhost:8765.

## Deploying

```bash
npm run deploy
```

This builds with `--protect`, which encrypts the whole game (AES-GCM, key derived from a password) so the published page shows only a password screen. The password comes from the `GAME_PASSWORD` environment variable or the file `~/.martim-jogo-password`. Neither is stored in this repo. It then publishes `dist/` to Cloudflare Pages.
