# Prompt for Google Antigravity

Two options. **Option A** is best: give Antigravity the existing game and let it continue. **Option B** rebuilds everything from scratch using only the spec below.

---

## Option A — continue from the existing code (recommended)

Open the project folder `As Aventuras de Martim e Esperança` in Antigravity (it contains `index.html`, `build.mjs`, `package.json`, `assets/`), then paste:

```
This folder contains a finished kids' platform game, "As Aventuras do Martim e da Esperança",
written as a single file: index.html (HTML + CSS + one <script>, canvas 2D, all art drawn
in code, all music/sfx synthesized with the Web Audio API, no external assets except the
Google Fonts "Baloo 2" and "Nunito").

Read index.html fully before changing anything. Key structure:
- LEVELS (level list, keyed by `theme`), buildLevel() + one build function and one
  backdrop function per theme (buildFunchal, buildCity, buildPortoSanto, buildAirport,
  buildHome), makeBuilders() for level pieces.
- Physics: moveBody(), solids (L.solids), one-way platforms (L.oneways, optional
  `bounce` for trampolines), moving platforms (L.movers), conveyors (L.conveyors).
- Heroes: drawMartim(), drawEsperanca() with smoothPose(), heroExpr(), heroLook();
  Dad the pilot: drawDad().
- Enemies: updateEnemy()/drawEnemy(); bosses share one state machine (walk, crouch,
  jump, dash) configured per theme in startBoss().
- Super power: SUPER_KEYS, activatePower(), G.power (30 s).
- Ending cutscenes: CUT, startEnding(), cutUpdate(); level-5 intro: drawIntro().
- Music: SONGS (per theme) + STYLES (one synth "band" per level).
- `node build.mjs` wraps index.html into dist/ (full HTML doc + PWA manifest + icons);
  `npm run deploy` publishes dist/ to Cloudflare Pages (project martim-e-esperanca).

Rules: keep it a single index.html; in-game text in European Portuguese; landscape
mobile with touch controls must keep working; Martim's shirt number is 7; both children
have brown eyes; after every change run the game in a browser and play the affected level.

My next request: <describe what you want>
```

---

## Option B — full spec to rebuild from scratch

```
Build a complete, polished 2D side-scrolling platform game for young children called
"As Aventuras do Martim e da Esperança". All in-game text must be in European Portuguese.

TECH
- One self-contained index.html: HTML + CSS + a single <script>, HTML5 canvas 2D.
- No image or audio files: draw every character, enemy, prop and background in code
  (vector shapes with thick dark outlines #2b1b4e, bright colours, soft gradients,
  cartoon style). Synthesize all music and sound effects with the Web Audio API.
- Fonts from Google Fonts: "Baloo 2" (display) and "Nunito" (UI), with fallbacks.
- Fixed-timestep game loop (1/60 s), requestAnimationFrame rendering, devicePixelRatio
  up to 2. Virtual world height 540 (600 on touch devices so on-screen buttons sit on
  an extra strip of floor below the play area); width follows the screen aspect.
- Also produce build.mjs that wraps index.html into dist/index.html (full <!doctype>,
  viewport-fit=cover, apple-mobile-web-app-capable, theme-color) plus a web manifest
  (display fullscreen, orientation landscape) and icons, for deployment to Cloudflare
  Pages ("npm run deploy" = build + `wrangler pages deploy dist`).

HOME PAGE AND MENUS
- Opens on a home page with the title in huge letters, every letter a different bright
  colour, popping in one by one then gently bobbing: "As Aventuras" / "do Martim" /
  "e da Esperança", plus a big green "Jogar!" button (this first tap also starts audio).
  Behind it the chosen level's scenery scrolls slowly with the two heroes in the corners.
- Then a menu card: level buttons (Nível 1..6 with place names), "1 Jogador",
  "2 Jogadores" (hidden on touch-only devices), and a "Como jogar" section.
- Pause card (Continuar / Menu), game-over card ("Oh não!", Tentar outra vez = restart
  from last checkpoint with full hearts, Menu), win card ("Conseguiram!", stars, points,
  best score in localStorage, "Nível N+1 →" or "Nível N+1 · Em breve").
- Win card contains a small celebration canvas: Martim at a table piled with food
  eating everything in one go (pastel de nata, burger, pizza, banana, cake, ice cream;
  stuffed cheeks, chomping mouth, crumbs, "Nham nham!") and Esperança shaking her arms
  very fast, bouncing, saying "Iupi!", with her teddy bear smiling (closed happy eyes).

HEROES
- Martim, 8 years old: FC Barcelona football kit — blue and garnet striped shirt with gold
  trim and number 10 on the back (the 10 must read correctly when he faces left), blue
  shorts, blue socks with a garnet band, blue boots, spiky
  brown hair, brown eyes, a football at his feet. Attack: kicks the ball (bouncing
  projectile, max 2 on screen). Higher single jump.
- Esperança, 2 years old: pink polka-dot dress with ruffled hem, Peter-Pan collar and
  puff sleeves, pink shoes, light-brown hair with a pigtail and yellow bow, big brown
  eyes, a blue pacifier (chupeta) she sucks on, a teddy bear in her hand. Attack: swings
  the teddy overhead ("POW!"). Has a double jump. Toddler waddle.
- Animation must be fluid: two-segment limbs (knees and elbows bend in the walk cycle),
  poses eased between states (idle, run, jump rising/falling, kick, attack, hurt, win),
  body leans into the run, pigtail lags behind, eyes follow the nearest enemy and glance
  around when idle, blinking, expressions (smile, grin when running, "O" when jumping,
  effort face when attacking, hurt face with arms flailing — Esperança sheds a tear —,
  arms up when celebrating). Squash and stretch on jump and landing.
- 1 player: control one hero, the other follows with a simple AI (jumps gaps and walls,
  boards moving platforms with the leader, teleports with a poof if left behind);
  C/Tab switches hero. 2 players on one keyboard: Martim A/D/W + F, Esperança arrows + L.
- Keyboard: arrows/WASD move, Space/Up jump, X attack, C switch, P pause, M mute.
- Touch (landscape phones/tablets): one wide left/right pad you can slide your thumb
  across, big Saltar / Chutar(or "Pum!") / Trocar buttons, notch-safe layout, a
  "Roda o telemóvel" screen in portrait, fullscreen + landscape lock + wake lock on
  Android, pause when the app is hidden.
- 5 shared hearts, i-frames after a hit, stomping enemies bounces you, falling in a pit
  costs a heart and respawns you on the last safe ground, checkpoints (flags), stars to
  collect, heart pickups, floating comic words ("POW!", "GOLO!", "BOING!", "ZÁS!").

- The family dog: a small white Maltese (long silky white coat, dark round eyes, black nose,
  pink bow on its top-knot, plume tail that wags) always runs around the children: it picks
  a new spot near them every couple of seconds, sprints to catch up, hops over gaps and up
  onto the platforms they stand on, rides moving platforms with them, sits when they stop,
  barks "Au au!" at nearby enemies, can't be hurt, and pops back next to them if left behind.
  It also follows them in the ending scenes, sits by Esperança on the home page, the menu
  and the win card, and sits by her high chair at the family dinners.

SUPER POWER — two golden "chave especial" keys hidden in every level. Picking one gives
both heroes 30 seconds of power (HUD bar, music speeds up):
- Esperança: sunglasses, pacifier moving much faster, a golden glow, dress/sleeves/shoes
  turn blue and white; enemies she touches are knocked out and nothing hurts her; her
  attack launches three flying teddy bears that home in on the nearest enemies (each can
  knock out three) leaving sparkle trails.
- Martim: 45% faster, wears a New York Knicks basketball kit (blue sleeveless jersey with
  orange trim, number 11, blue baggy shorts with an orange stripe, white socks and
  high-tops, orange headband and wristbands), and
  throws flaming basketballs with his hands that skim along the ground and pierce
  through every enemy in their path.

LEVELS (each has its own backdrop, enemies, boss, ending cutscene and music style)
1. Funchal, Madeira — Mercado dos Lavradores fruit and flower stalls, levada channel,
   Rua de Santa Maria with painted doors and wrought-iron balconies, Madeiran houses
   (white/pastel walls, dark basalt corners, green shutters, red roofs, bougainvillea),
   green mountains dotted with houses and the Monte church; a teleférico (cable cars
   that loop on two cables and stop at each station) across a ravine; the Monte
   toboggan (carro de cesto) pushed by carreiros in white with straw hats — walk into
   it to ride, it knocks out lizards; marina with floating fishing boats over water,
   palm trees, sailboats and a cruise ship. Enemies: lagartixas (lizards that dash),
   crabs, seagulls. Boss: "Sol Traquinas" (the sun comes down from the sky, wearing
   sunglasses, bounces and rolls). Ending: they board the caravel "Santa Maria" and it
   sails away, shrinking to the horizon with them and the dog on deck, fireworks.
2. Lisboa — tram 28, azulejo facades, calçada portuguesa, jacarandas, a red suspension
   bridge in the distance; cars, market stalls, scaffolding, crates. Enemies: grumpy
   pigeons, hopping trash cans, seagulls. Boss: "Rei dos Pombos" (giant crowned pigeon).
   Ending: the gate reads "FEIRA POPULAR"; inside a spinning carousel with bobbing
   horses, a Ferris wheel and a "FARTURAS" stall; they ride the carousel with the dog.
3. Porto Santo — arrival by the Lobo Marinho ferry at Vila Baleira, Casa Colombo, ice
   cream stall, the golden beach: beach umbrellas are trampolines, sandcastles, a
   lifeguard tower, tide pools with jumping jellyfish, duck and flamingo floats to
   cross water, basalt columns (Pico Ana Ferreira) rising from the sea to hop across,
   dry hills with turning windmills, an islet with a lighthouse. Enemies: crabs,
   seagulls, jellyfish. Boss: "Lambeca Gigante" (Porto Santo's traditional soft-serve
   ice cream, pink and cream swirl with sprinkles, angry face). Ending: they enter a
   giant sandcastle, come out at the top of a tower and slide down a slide into a pool
   with a big splash; the dog slides after them and paddles next to Esperança.
4. O Aeroporto — terminal with big glass walls (control tower, parked TAP planes, a plane
   taking off nose-first), a "PARTIDAS" board, check-in desks, luggage stacks,
   security, Duty Free shelves, a pastel-de-nata café, flush moving walkways that speed
   you up, gate "Porta 7 · Embarque", a jet bridge, then inside a TAP plane that looks
   realistic: overhead bins attached to the ceiling with curved lips, reading lights and
   seatbelt sign, rounded windows at seated eye level with some shades down, airline
   seats seen from the side (frame, cushion, reclined back, headrest cover, armrest) —
   seat cushions are trampolines — a door with a "SAÍDA" sign and a stainless-steel
   galley. Enemies: runaway suitcases with eyes, cleaning robots, pigeons. Boss: the
   flight attendant ("Hospedeira Apressada") charging with the drinks trolley; when
   beaten she gets dizzy, laughs and says "Sumos para todos!" (she does not vanish).
   Ending: they sit in golden seats labelled "Martim" and "Esperança", and the dog takes
   the third seat (marked with a paw print); once all three are in, seatbelt chime, fade to white, the TAP plane climbs through the clouds: "Boa viagem!".
5. Em Casa — intro cutscene: the cockpit door opens (sunset through the windscreen,
   blinking instruments) and they walk out holding hands with their dad, an airline
   pilot (navy uniform, gold sleeve stripes, cap, wings badge), and their mom (long
   blonde hair, brown eyes, reading glasses, teal dress) — a chain of hands: Esperança,
   Dad, Martim, Mom — "Chegámos! Vamos para casa!". Then their home: balcony (iron railing, flower planters, drying rack, city
   and rooftops behind), bedroom (bunk bed and bed are trampolines, toy box, shelves,
   desk, football poster with a 10, bunting spelling MARTIM and ESPERANÇA), living room
   (sofa and armchair are trampolines, TV, bookshelf, coffee table, rug, family photos),
   kitchen (azulejo backsplash, checkered floor, counters, cabinets, fridge right next
   to the counter, island with fruit, washing machine). Enemies: dust bunnies, toy cars,
   wind-up robots, pigeons on the balcony. Boss: "Monstro da Roupa Suja" (a pile of
   dirty laundry with a sock on top). The level ends at a doorway marked "Sala de Jantar"
   (no kitchen table). Ending: a quick fade to the family dining room —
   the same design as level 6's dinner (candlelight, long white table with a white
   tablecloth, light brown wooden floor, a window onto the city at night). Martim on a
   chair, Esperança in a high chair (pacifier out, chomping, teddy smiling); Mom walks in
   with the bread and Dad with a steaming pot of soup, they sit and the whole family eats
   together, all smiling, spoons going to mouths, "Bom apetite!" / "Jantar em família!".
   The music changes to a slow, warm dinner tune (soft pad, piano arpeggios, melody).
6. Londres — intro: the same cockpit scene (London skyline through the windscreen), the
   family walks out holding hands with Mom and Dad: "Chegámos a Londres!". Level: Trafalgar
   Square (bronze lions on plinths to climb, Nelson's Column, a fountain whose centre bowl
   is a trampoline), red double-decker buses (stand on the band between decks and on the
   roof), black cabs, red phone boxes and post boxes, Big Ben with a real-time clock next
   to the Houses of Parliament (it chimes "DONG!" as you pass), the Thames crossed on a
   riverboat, the South Bank with the London Eye (its capsules are rotating platforms),
   Tower Bridge (a deck over the river, stone ledges up the towers, the blue high walkway
   with a key), the City's Georgian terraces, then a royal park with grass and striped
   deckchairs as trampolines, royal guards in sentry boxes, Buckingham Palace with the
   Union flag behind the boss arena. Enemies: pigeons, runaway hopping umbrellas, grey
   squirrels that dash. Boss: "O Roadman" (hoodie up over a cap, black tracksuit with
   white stripes, crossbody bag, gold chain, white trainers; walks with a swagger, jumps,
   and charges on an e-scooter shouting "Wagwan!", "Bruv!"); when beaten he just
   smiles, arms relaxed, no hand gestures: "Safe, bruv!" / "Bem-vindos a Londres!". Ending (starts by itself 3 s after
   the boss is beaten, no bus): Esperança's godparents wait with Mom and Dad — Madrinha
   (long brown hair, brown eyes, glasses, dark blue dress) and Padrinho (striped shirt,
   brown hair, glasses, dark blue jeans). Esperança runs to them shouting "Madrinha!
   Padrinho!", Madrinha scoops her up for a hug with floating hearts, then fade to the
   godparents' home: a candlelit dinner — long white table with a white tablecloth, three
   candles glowing, roast chicken, light brown wooden floor, a window onto London at
   night; all six sit and eat (Martim on a chair, Esperança in a high chair), the music
   turns warm: "Jantar em casa dos padrinhos!".

BOSSES — each fight locks the camera in an arena with a boss health bar and an intro
banner; bosses walk toward the players, crouch, then jump or (when below half health)
dash; stomps, balls, teddy hits, fire balls and flying teddies each remove one heart
with short invulnerability; after the win a path to the ending opens.
Every ending cutscene can be skipped with a tap or key, then shows the win card.

AUDIO — every level has its own original music and instrumentation (never copy existing
songs): Funchal = Madeiran-folk feel (strummed braguinha, accordion lead, brinquinho
jingles, castanets, oom-pah bass); Lisboa = marcha popular (brass band, tuba oom-pah,
marching snare rolls, cymbals, tram bell "ding-ding"); Londres = British pop-rock (driving
eighth-note bass, jangly guitar chords, backbeat drums, bright lead, a Westminster-chime bell); Porto Santo = beach calypso
(steel pan with echo, ukulele off-beats, congas, shaker); Aeroporto = travel funk (slap
bass, synth brass stabs, claps, airport PA "ding-dong"); Em Casa = cosy piano chords,
glockenspiel melody, pizzicato bass, brushes. 8-bar A/B tunes, happy and energetic.
Sound effects: jump, double jump, kick, swing, bonk, star, heart, hurt, checkpoint,
boing (trampolines), power-up, fire, chime, win. Mute button remembered in localStorage.

HUD — hearts, stars, points, a progress bar with the two heads moving toward the flag,
the power timer bar, boss name and health, pause/mute/switch buttons.

QUALITY — test every level from start to finish in a browser (desktop and a landscape
phone viewport), make sure nothing can trap the player (every obstacle climbable),
and keep the frame rate smooth on phones.
```
