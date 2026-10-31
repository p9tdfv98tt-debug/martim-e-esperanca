// Builds the Cloudflare Pages site in ./dist from index.html (the single source file).
// index.html is written as a page fragment (that is what the claude.ai artifact expects);
// here it gets a full document with mobile / home-screen metadata.
//
// Password lock: with `--protect` the whole game is encrypted (AES-GCM, key from the password via PBKDF2) and the
// published page only holds a password screen plus the encrypted game — without the password nothing can be read,
// not even in the page source. The password comes from GAME_PASSWORD or the file ~/.martim-jogo-password
// (kept outside the project folder, so it is never uploaded or shared).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { webcrypto as crypto } from 'node:crypto';

const src = readFileSync('index.html', 'utf8');
const cut = src.indexOf('<canvas');
const head = src.slice(0, cut).trim();
const body = src.slice(cut).trim();

const meta = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#46b8ff">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Martim &amp; Esperança">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">`;

const html = `<!doctype html>
<html lang="pt">
<head>
${meta}
<meta name="description" content="Um jogo de plataformas para crianças: o Martim chuta a bola, a Esperança dá com o ursinho!">
${head}
</head>
<body>
${body}
</body>
</html>
`;

const manifest = {
  name: 'As Aventuras do Martim e da Esperança',
  short_name: 'Martim & Esperança',
  lang: 'pt',
  start_url: './',
  scope: './',
  display: 'fullscreen',
  orientation: 'landscape',
  background_color: '#7fd6ff',
  theme_color: '#46b8ff',
  icons: [
    { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
  ]
};

const PASS_FILE = join(homedir(), '.martim-jogo-password');
const protect = process.argv.includes('--protect');
const password = process.env.GAME_PASSWORD || (existsSync(PASS_FILE) ? readFileSync(PASS_FILE, 'utf8').replace(/\r?\n$/, '') : '');
if (protect && !password) {
  console.error(`No password set: create ${PASS_FILE} first. Nothing was built.`);
  process.exit(1);
}

const ITER = 250000;
const b64 = u8 => Buffer.from(u8).toString('base64');
async function lockPage(plain, pass) {
  // the salt stays the same between builds so "Lembrar neste aparelho" keeps working after each update
  // (changing the password still locks everyone out until they type the new one); the IV is new every build
  const salt = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('martim-e-esperanca/lock'))).slice(0, 16);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass.normalize('NFC').trim()), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain)));
  return `<!doctype html>
<html lang="pt">
<head>
${meta}
<title>As Aventuras do Martim e da Esperança</title>
<style>
  :root{color-scheme:light}
  html,body{margin:0;height:100%}
  body{background:linear-gradient(#46b8ff,#aee8ff 60%,#ffe3f1);font-family:"Arial Rounded MT Bold","Trebuchet MS",system-ui,sans-serif;color:#2b1b4e;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}
  form{background:#fffaf0;border:4px solid #2b1b4e;border-radius:24px;box-shadow:0 6px 0 #2b1b4e;padding:22px 24px;width:100%;max-width:360px;box-sizing:border-box;text-align:center}
  h1{margin:0 0 4px;font-size:24px;line-height:1.1;color:#ff5d8f}
  p{margin:0 0 14px;font-size:15px}
  input[type=password]{width:100%;box-sizing:border-box;font:inherit;font-size:20px;padding:10px 14px;border:3px solid #2b1b4e;border-radius:14px;outline:none;text-align:center}
  input[type=password]:focus{border-color:#2f6bff}
  label{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 0 4px;font-size:15px}
  label input{width:20px;height:20px}
  button{margin-top:12px;width:100%;font:inherit;font-size:22px;padding:10px;border:3px solid #2b1b4e;border-radius:16px;background:#3ddc84;color:#2b1b4e;box-shadow:0 4px 0 #2b1b4e;cursor:pointer}
  button:disabled{opacity:.6}
  #err{color:#e8364f;min-height:20px;margin:10px 0 0;font-size:15px}
</style>
</head>
<body>
<form id="lock" autocomplete="off">
  <h1>As Aventuras do Martim e da Esperança</h1>
  <p>Escreve a palavra-passe para jogar</p>
  <input type="password" id="pw" aria-label="Palavra-passe" autofocus>
  <label><input type="checkbox" id="keep" checked> Lembrar neste aparelho</label>
  <button id="go">Entrar</button>
  <p id="err" role="alert"></p>
</form>
<script>
(() => {
  const D = { salt: '${b64(salt)}', iv: '${b64(iv)}', iter: ${ITER}, data: '${b64(data)}' };
  const u8 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const KEY = 'mea-lock-key';
  async function open(key) {
    const page = new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u8(D.iv) }, key, u8(D.data)));
    // replace this page with the game only once it has finished loading (otherwise the game is appended to it)
    if (document.readyState !== 'complete') await new Promise(r => addEventListener('load', r, { once: true }));
    document.open(); document.write(page); document.close();
  }
  async function keyFrom(pass) {
    // «ç» may be typed as one character or as c + cedilla (NFC makes them the same); spaces around it are ignored
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass.normalize('NFC').trim()), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: u8(D.salt), iterations: D.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
  }
  const form = document.getElementById('lock'), pw = document.getElementById('pw'), err = document.getElementById('err'), go = document.getElementById('go');
  // remembered on this device: open straight away (a new password makes the old key fail, so it is forgotten)
  let saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved) crypto.subtle.importKey('raw', u8(saved), 'AES-GCM', false, ['decrypt']).then(open).catch(() => { try { localStorage.removeItem(KEY); } catch (e) {} });
  form.addEventListener('submit', async e => {
    e.preventDefault(); err.textContent = ''; go.disabled = true; go.textContent = 'A abrir…';
    try {
      const raw = new Uint8Array(await crypto.subtle.exportKey('raw', await keyFrom(pw.value)));
      const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
      await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u8(D.iv) }, key, u8(D.data));
      if (document.getElementById('keep').checked) { try { localStorage.setItem(KEY, btoa(String.fromCharCode(...raw))); } catch (e) {} }
      await open(key);
    } catch (e) {
      err.textContent = 'Palavra-passe errada. Tenta outra vez.'; go.disabled = false; go.textContent = 'Entrar'; pw.select();
    }
  });
})();
</script>
</body>
</html>
`;
}

const out = protect ? await lockPage(html, password) : html;
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', out);
writeFileSync('dist/manifest.webmanifest', JSON.stringify(manifest, null, 2));
for (const f of ['icon.svg', 'icon-192.png', 'apple-touch-icon.png']) if (existsSync(`assets/${f}`)) copyFileSync(`assets/${f}`, `dist/${f}`);
console.log('dist/ built:', (out.length / 1024).toFixed(1) + ' KB', protect ? '(locked with the password)' : '(no password)');
