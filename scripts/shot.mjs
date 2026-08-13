#!/usr/bin/env node
/**
 * Look at nutrioplus.co.uk in a REAL emulated iPhone viewport, and measure the things a
 * picture cannot tell you.
 *
 *   node scripts/shot.mjs                      # 390 + 430, screenshots + probe
 *   node scripts/shot.mjs --widths 390         # one width
 *   node scripts/shot.mjs --probe-only         # numbers, no PNGs
 *   node scripts/shot.mjs --motion             # allow animations (default: reduced)
 *
 * Screenshots land in shots/<width>/index.png.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────
 * `chrome --headless --screenshot --window-size=390,3000` DOES NOT WORK for mobile. That
 * flag sets the OS window, not the layout viewport, and headless Chrome ignores
 * <meta name="viewport"> exactly as a desktop browser does. You get a DESKTOP layout
 * cropped to 390px, which looks identical to catastrophic horizontal overflow and is
 * entirely an artefact of the harness.
 *
 * This bit us for real on 2026-08-13: a --window-size capture of this very site showed the
 * hero two-up and .ways two-up with text sheared off the right edge. All of it was fake —
 * styles.css:486 collapses .hero-inner at 940px and :533 makes .ways single-column at 430px,
 * and both were working correctly the whole time. Emulation.setDeviceMetricsOverride with
 * mobile:true is what makes the viewport meta take effect so media queries fire at the
 * width you asked for.
 *
 * Reduced motion is emulated by default because .up/.stagger elements start at opacity:0
 * and only animate in; without it, a full-page capture is full of blank bands that look
 * like design holes and are not.
 *
 * Zero npm dependencies — Node 22 ships a global WebSocket. These sites have no build step
 * and no package manager, and this script must not change that.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8123, CDP_PORT = 9444;

const argv = process.argv.slice(2);
let widths = [390, 430];
let probeOnly = false, reduceMotion = true;
const pages = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--widths') widths = argv[++i].split(',').map(Number);
  else if (argv[i] === '--probe-only') probeOnly = true;
  else if (argv[i] === '--motion') reduceMotion = false;
  else pages.push(argv[i]);
}
if (!pages.length) pages.push('index.html');

// ── Static server ────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.json': 'application/json',
  '.woff2': 'font/woff2',
};
function serve() {
  return new Promise((res) => {
    const srv = createServer((req, r) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      let file = join(ROOT, p);
      if (!existsSync(file) && existsSync(file + '.html')) file += '.html';
      if (!existsSync(file) || !extname(file)) { r.writeHead(404); return r.end('nope'); }
      r.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      r.end(readFileSync(file));
    });
    srv.listen(PORT, () => res(srv));
  });
}

// ── Minimal CDP ──────────────────────────────────────────────────────────────
const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].find(existsSync);

async function launch() {
  if (!CHROME) throw new Error('No Chrome found');
  const proc = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*',
    '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
    '--user-data-dir=/tmp/nutrio-shots-profile', 'about:blank',
  ], { stdio: 'ignore' });
  const deadline = Date.now() + 15000;
  for (;;) {
    try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) return proc; } catch {}
    if (Date.now() > deadline) { proc.kill(); throw new Error('Chrome debugger never came up'); }
    await new Promise((r) => setTimeout(r, 150));
  }
}

class Session {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map(); }
  static async attach() {
    const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).json();
    const ws = new WebSocket(webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    const s = new Session(ws);
    ws.onmessage = (ev) => s._msg(JSON.parse(ev.data));
    const { targetId } = await s.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await s.send('Target.attachToTarget', { targetId, flatten: true });
    s.sessionId = sessionId;
    // Cache off: a stale stylesheet means measuring the PREVIOUS build, which is worse
    // than not measuring at all.
    await s.send('Network.enable');
    await s.send('Network.setCacheDisabled', { cacheDisabled: true });
    return s;
  }
  _msg(m) {
    if (m.id != null && this.pending.has(m.id)) {
      const { resolve: rs, reject: rj } = this.pending.get(m.id);
      this.pending.delete(m.id);
      return m.error ? rj(new Error(m.error.message)) : rs(m.result);
    }
    if (m.method) this.handlers.get(m.method)?.forEach((h) => h(m.params));
  }
  send(method, params = {}) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (this.sessionId) payload.sessionId = this.sessionId;
    return new Promise((rs, rj) => {
      this.pending.set(id, { resolve: rs, reject: rj });
      this.ws.send(JSON.stringify(payload));
      setTimeout(() => { if (this.pending.delete(id)) rj(new Error(`CDP timeout: ${method}`)); }, 30000);
    });
  }
  once(m) { return new Promise((rs) => { const h = (p) => { this.handlers.get(m).delete(h); rs(p); }; this.on(m, h); }); }
  on(m, fn) { if (!this.handlers.has(m)) this.handlers.set(m, new Set()); this.handlers.get(m).add(fn); }
}

// ── The probe: what a screenshot can't tell you ──────────────────────────────
const PROBE = String.raw`(() => {
  const de = document.documentElement, vw = de.clientWidth, TOL = 1.5;
  const out = { vw, overflow: [], tiny: [], taps: [], tight: [] };

  // Anything inside an aria-hidden subtree is decorative — the phone mockup in the tour
  // renders real UI at phone scale, so its 8px labels are correct, not a legibility bug.
  // Flagging them would bury the findings that matter.
  const decorative = (el) => !!el.closest('[aria-hidden="true"]');
  const seen = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const label = (el) => el.tagName.toLowerCase()
    + (el.id ? '#' + el.id : '')
    + (typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');

  // Horizontal overflow, per element. styles.css:54 sets overflow-x:hidden, so the
  // document-level scrollWidth test reports every page clean. Rects still tell the truth.
  const inScroller = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true;
    }
    return false;
  };
  for (const el of document.querySelectorAll('body *')) {
    if (!seen(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.pointerEvents === 'none' || cs.position === 'fixed') continue;
    const r = el.getBoundingClientRect();
    // Parked far off-screen is the standard skip-link / visually-hidden pattern, not
    // overflow. Only flag things near the viewport that genuinely stick out.
    if (r.left < -1000) continue;
    if ((r.right > vw + TOL || r.left < -TOL) && !inScroller(el)) {
      out.overflow.push({ el: label(el), left: Math.round(r.left), right: Math.round(r.right) });
    }
  }

  // Type under 13px, and line-height under 1.35 on body-sized text.
  for (const el of document.querySelectorAll('p,li,a,span,b,em,h1,h2,h3,h4,summary,button,div')) {
    if (!seen(el)) continue;
    if (!el.textContent.trim() || el.children.length) continue;
    if (decorative(el)) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    // Tracked uppercase micro-labels (eyebrows, ticker chips) are a deliberate
    // typographic device and legibly small by convention — the floor for those is 12px,
    // not 13. Flagging them just trains you to skip the report.
    const microCap = cs.textTransform === 'uppercase' && parseFloat(cs.letterSpacing) >= fs * 0.04;
    const floor = microCap ? 12 : 13;
    if (fs < floor) out.tiny.push({ el: label(el), px: +fs.toFixed(1), micro: microCap, text: el.textContent.trim().slice(0, 34) });
    // Only body-sized text. Display type is SUPPOSED to have tight leading — h1 at 38px
    // with 1.04 is a deliberate choice, not a defect, and flagging it trains you to ignore
    // the whole report. Icons/emoji spans are excluded for the same reason.
    const lh = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight);
    const isIcon = el.getAttribute('aria-hidden') === 'true' || /^\p{Extended_Pictographic}+$/u.test(el.textContent.trim());
    if (fs >= 13 && fs <= 24 && !isIcon && lh / fs < 1.35) {
      out.tight.push({ el: label(el), px: +fs.toFixed(1), ratio: +(lh / fs).toFixed(2), text: el.textContent.trim().slice(0, 30) });
    }
  }

  // Tap targets under 44px (Apple HIG).
  for (const el of document.querySelectorAll('a,button,summary,input,[role="button"]')) {
    if (!seen(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 44) out.taps.push({ el: label(el), h: Math.round(r.height), w: Math.round(r.width), text: el.textContent.trim().slice(0, 26) });
  }
  return out;
})()`;

// ── Run ──────────────────────────────────────────────────────────────────────
const srv = await serve();
const chrome = await launch();
const s = await Session.attach();
let findings = 0;

try {
  await s.send('Page.enable');
  for (const w of widths) {
    console.log(`\n══ ${w}px ${'═'.repeat(52)}`);
    await s.send('Emulation.setDeviceMetricsOverride', {
      width: w, height: 844, deviceScaleFactor: 3, mobile: true,
      screenWidth: w, screenHeight: 844,
      screenOrientation: { angle: 0, type: 'portraitPrimary' },
    });
    await s.send('Emulation.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 '
        + '(KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
      platform: 'iPhone',
    });
    await s.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    if (reduceMotion) {
      await s.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
    }

    for (const page of pages) {
      const loaded = s.once('Page.loadEventFired');
      await s.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/${page}` });
      await Promise.race([loaded, new Promise((r) => setTimeout(r, 12000))]);
      await new Promise((r) => setTimeout(r, 1400));

      const { result } = await s.send('Runtime.evaluate', { expression: PROBE, returnByValue: true });
      const p = result.value;
      const bad = p.overflow.length + p.tiny.length + p.taps.length + p.tight.length;
      findings += bad;

      console.log(`\n  ${page}  (viewport ${p.vw}px)`);
      const show = (title, rows, fmt) => {
        if (!rows.length) return;
        console.log(`    ${title} — ${rows.length}`);
        for (const r of rows.slice(0, 12)) console.log('      ' + fmt(r));
        if (rows.length > 12) console.log(`      … ${rows.length - 12} more`);
      };
      show('HORIZONTAL OVERFLOW', p.overflow, (r) => `${r.el}  ${r.left}…${r.right}`);
      show('TYPE UNDER 13px', p.tiny, (r) => `${r.px}px  ${r.el}  "${r.text}"`);
      show('LINE-HEIGHT UNDER 1.35', p.tight, (r) => `${r.ratio}  ${r.px}px  ${r.el}`);
      show('TAP TARGET UNDER 44px', p.taps, (r) => `${r.h}px  ${r.el}  "${r.text}"`);
      if (!bad) console.log('    ✓ clean');

      if (!probeOnly) {
        // Full-page capture the reliable way: resize the viewport to the document height
        // rather than using captureBeyondViewport, which times out on a page this tall.
        // Chrome's texture limit is 16384px, so drop the scale factor until it fits —
        // this page is ~10000 CSS px, which would be 30000px at dpr 3.
        const { result: h } = await s.send('Runtime.evaluate', {
          expression: 'Math.min(document.documentElement.scrollHeight, 20000)', returnByValue: true,
        });
        const full = h.value;
        const dpr = full * 3 <= 16384 ? 3 : full * 2 <= 16384 ? 2 : 1;
        await s.send('Emulation.setDeviceMetricsOverride', {
          width: w, height: full, deviceScaleFactor: dpr, mobile: true,
          screenWidth: w, screenHeight: full,
          screenOrientation: { angle: 0, type: 'portraitPrimary' },
        });
        await new Promise((r) => setTimeout(r, 400));
        const { data } = await s.send('Page.captureScreenshot', { format: 'png' });
        const dir = resolve(ROOT, 'shots', String(w));
        mkdirSync(dir, { recursive: true });
        const out = join(dir, page.replace(/\.html$/, '') + '.png');
        writeFileSync(out, Buffer.from(data, 'base64'));
        console.log(`    → shots/${w}/${page.replace(/\.html$/, '')}.png`);
      }
    }
  }
  console.log(`\n${findings ? `${findings} finding(s) — look at the screenshots.` : '✓ all clean'}\n`);
} finally {
  try { s.ws.close(); } catch {}
  chrome.kill();
  srv.close();
}
