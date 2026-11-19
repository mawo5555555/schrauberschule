#!/usr/bin/env python3
"""Verlusttest Spielstand: Fortschritt anlegen, dann Speicher löschen / kaputt machen / durch schlechteren Stand ersetzen
und prüfen, dass die App eine Kopie findet und anbietet. Ende mit Code 1 bei Fehlern.
Aufruf: python3 v2/spielstandtest.py   (Playwright mit Firefox nötig)"""
import os, sys, subprocess, time, socket, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); PORT = 8742
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for _ in range(30):
    try: socket.create_connection(('127.0.0.1', PORT), 1).close(); break
    except OSError: time.sleep(.2)
URL = f'http://localhost:{PORT}/v2/index.html'
GUT = {'points': 400, 'days': ['2026-11-01', '2026-11-02', '2026-11-03'], 'done': {'m1': 1, 'm2': 1, 'm3': 1, 'm4': 1}, 'stars': {}, 'name': 'Test'}
res = []
def check(name, ok): res.append((name, ok)); print(('OK    ' if ok else 'FEHLER'), name)
def start(b, init=None):
    ctx = b.new_context(viewport={'width': 390, 'height': 844}); pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.evaluate("localStorage.setItem('ss_tagesstart',new Date().toDateString())")
    return ctx, pg, errs
def warte(pg, ms=2500): pg.reload(); pg.wait_for_function('typeof go==="function"'); pg.wait_for_timeout(ms)
def dialog(pg): return pg.evaluate("(()=>{const d=document.querySelector('.ss-conf');return d?d.textContent:''})()")
try:
    with sync_playwright() as p:
        b = p.firefox.launch()
        # 1 Speicher komplett gelöscht -> Kopie wird angeboten
        ctx, pg, errs = start(b)
        pg.evaluate("s=>localStorage.setItem('wt-state-v1',s)", json.dumps(GUT)); warte(pg, 3000)
        pg.evaluate("localStorage.removeItem('wt-state-v1')"); warte(pg)
        d = dialog(pg); check('1 gelöscht: Kopie wird angeboten', '400 Punkte' in d)
        pg.click('.ss-conf [data-a=j]'); pg.wait_for_timeout(1500); pg.wait_for_function('typeof go==="function"')
        check('1 Wiederherstellen bringt 400 Punkte zurück', pg.evaluate("JSON.parse(localStorage.getItem('wt-state-v1')).points") == 400)
        check('1 ohne Seitenfehler', not errs); ctx.close()
        # 2 kaputter Text -> Kopie wird angeboten, kaputter Text liegt als defekt-Kopie
        ctx, pg, errs = start(b)
        pg.evaluate("s=>localStorage.setItem('wt-state-v1',s)", json.dumps(GUT)); warte(pg, 3000)
        pg.evaluate("localStorage.setItem('wt-state-v1','kaputt{{')"); warte(pg)
        check('2 kaputt: Kopie wird angeboten', '400 Punkte' in dialog(pg))
        check('2 kaputter Text als Kopie gesichert', pg.evaluate("Object.keys(localStorage).some(k=>k.includes('defekt'))")); check('2 ohne Seitenfehler', not errs); ctx.close()
        # 3 viel schlechterer Stand (z. B. versehentlich zurückgesetzt) -> Kopie wird angeboten, Spiegel wird nicht überschrieben
        ctx, pg, errs = start(b)
        pg.evaluate("s=>localStorage.setItem('wt-state-v1',s)", json.dumps(GUT)); warte(pg, 3000)
        pg.evaluate("localStorage.setItem('wt-state-v1',JSON.stringify({points:5,days:[],done:{}}))"); warte(pg, 3000)
        check('3 viel schlechterer Stand: Kopie wird angeboten', '400 Punkte' in dialog(pg))
        check('3 Spiegel behält besten Stand', pg.evaluate("window.SS_rescue.bestCopy().then(t=>t&&t.state.points)") == 400)
        pg.click('.ss-conf [data-a=n]'); warte(pg, 2500)
        check('3 nach "Jetzigen behalten" keine erneute Frage', dialog(pg) == ''); ctx.close()
        # 4 normaler Fortschritt: keine unnötige Frage
        ctx, pg, errs = start(b)
        pg.evaluate("s=>localStorage.setItem('wt-state-v1',s)", json.dumps(GUT)); warte(pg, 3000)
        g2 = dict(GUT); g2['points'] = 600; pg.evaluate("s=>localStorage.setItem('wt-state-v1',s)", json.dumps(g2)); warte(pg, 3000)
        check('4 normaler Fortschritt: keine Frage', dialog(pg) == ''); ctx.close()
        # 5 Sicherungsliste zeigt Datenbank-Kopien
        ctx, pg, errs = start(b)
        pg.evaluate("s=>localStorage.setItem('wt-state-v1',s)", json.dumps(GUT)); warte(pg, 3000)
        keys = pg.evaluate("window.SS_idb.keys()"); check('5 Datenbank hat state, best und Tagesstand', 'state' in keys and 'best' in keys and any(k.startswith('day-') for k in keys)); ctx.close()
        b.close()
finally:
    srv.terminate()
bad = [n for n, ok in res if not ok]
print('\nAlles in Ordnung.' if not bad else '\nFehlgeschlagen: ' + ', '.join(bad))
sys.exit(1 if bad else 0)
