#!/usr/bin/env python3
"""Vorab-Test vor dem Hochladen: startet einen lokalen Server, öffnet alle Ansichten in hoch und quer,
sammelt JavaScript-Fehler, fehlende Dateien (404) und fehlgeschlagene Ladevorgänge. Ende mit Code 1, wenn etwas auffällt.
Aufruf: python3 v2/vorabtest.py   (Playwright mit Firefox nötig)"""
import os, sys, subprocess, time, socket
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); PORT = 8741
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for _ in range(30):
    try: socket.create_connection(('127.0.0.1', PORT), 1).close(); break
    except OSError: time.sleep(.2)
probs = []
try:
    with sync_playwright() as p:
        b = p.firefox.launch()
        for w, h, tag in [(390, 844, 'hoch'), (844, 390, 'quer')]:
            pg = b.new_page(viewport={'width': w, 'height': h})
            pg.on('pageerror', lambda e, t=tag: probs.append(f'[{t}] Skriptfehler: {e}'))
            pg.on('response', lambda r, t=tag: probs.append(f'[{t}] {r.status} {r.url}') if r.status >= 400 and 'favicon' not in r.url else None)
            pg.on('requestfailed', lambda r, t=tag: probs.append(f'[{t}] nicht geladen: {r.url}') if 'mp4' not in r.url else None)
            pg.goto(f'http://localhost:{PORT}/v2/index.html'); pg.evaluate("localStorage.setItem('ss_tagesstart',new Date().toDateString())")
            pg.wait_for_function('typeof go==="function"'); pg.wait_for_timeout(1500)
            for v in ['home', 'missions', 'garage', 'parents', 'pr', 'w2']:
                pg.evaluate(f"go('{v}')"); pg.wait_for_timeout(900); pg.evaluate("document.querySelectorAll('.an,.rt').forEach(x=>x.remove())")
            for fn in ["LACK.open('s51')", "WASCH.open('s51')"]:
                try: pg.evaluate(fn); pg.wait_for_timeout(900)
                except Exception as e: probs.append(f'[{tag}] {fn}: {str(e)[:80]}')
            pg.close()
        b.close()
finally:
    srv.terminate()
probs = sorted(set(probs))
print('\n'.join(probs) if probs else 'Alles in Ordnung: keine Fehler, keine fehlenden Dateien.')
sys.exit(1 if probs else 0)
