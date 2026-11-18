#!/usr/bin/env python3
"""Klicktest Schrauberschule v2 (Handyformat 375x812). Aufruf: ./klicktest.sh [URL]
Prüft: Konsolenfehler, 404/Netzfehler, kaputte Bilder, tote Buttons, sichtbares Ziel. Ausgabe OK/FEHLER, Exit 1 bei Fehler."""
import sys, re, json
from playwright.sync_api import sync_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8731/v2/"
res = []; errs = []
def rec(name, ok, info=""): res.append((name, ok, info)); print(("OK     " if ok else "FEHLER ") + name + (("  – " + info) if info and not ok else ""), flush=True)
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    ctx = b.new_context(viewport={'width': 375, 'height': 812}, has_touch=True, is_mobile=True)
    pg = ctx.new_page(); pg.on("dialog", lambda d: d.accept())
    pg.on("console", lambda m: errs.append("console: " + m.text[:160]) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append("JS: " + str(e)[:160]))
    pg.on("response", lambda r: errs.append("HTTP %d %s" % (r.status, r.url)) if r.status >= 400 else None)
    pg.on("requestfailed", lambda r: errs.append("NETZ " + r.url) if "ERR_ABORTED" not in str(r.failure) else None)
    def take():
        e = list(errs); errs.clear(); return e
    def settle(ms=450): pg.wait_for_timeout(ms)
    def clean():  # Installationshinweis/Toasts wegräumen (eigene Prüfung unten)
        pg.evaluate("document.querySelectorAll('.inst-pill,.inst-bk,.ss-news,.ss-bk').forEach(e=>e.remove())")
    def state(): return pg.evaluate("[typeof view!='undefined'?view:'', (document.querySelector('#app')||{}).innerHTML?.length||0, document.body.children.length, (document.querySelector('#app')||{innerText:''}).innerText.slice(0,2000)]")
    def screen_ok(name):
        v = pg.evaluate("""(()=>{const a=document.querySelector('#app'); if(!a) return 'kein #app'; const t=a.innerText.trim();
          if(t.length<15) return 'leer'; if(/undefined|NaN|\\[object/.test(t)) return 'Text enthält undefined/NaN'; 
          const bad=[...a.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0&&i.offsetParent).map(i=>i.getAttribute('src')); return bad.length?'kaputte Bilder: '+bad.slice(0,3).join(', '):''})()""")
        return v
    pg.goto(URL, wait_until="networkidle"); settle(2500)
    e = take(); rec("Start ohne Konsolenfehler/404", not e, "; ".join(e[:4]))
    # Installationshinweis darf Karten nicht blockieren: Pille muss schmal+breit genug sein
    pill = pg.evaluate("(()=>{const e=document.querySelector('.inst-pill'); if(!e) return null; const r=e.getBoundingClientRect(); return [r.width,r.height]})()")
    rec("Installationshinweis ist eine flache Leiste (kein Klecks)", pill is None or (pill[0] > 280 and pill[1] < 90), str(pill))
    clean()
    # --- Dateien, die Browser/Handy von allein anfragen + Service-Worker-Liste + Manifest
    base = URL.split("/v2/")[0] + "/"
    sw = ctx.request.get(base + "v2/sw.js").text(); core = re.findall(r"'([^']+)'", re.search(r"CORE_FILES = \[(.*?)\];", sw, re.S).group(1))
    man = ctx.request.get(base + "v2/manifest.webmanifest").json(); mi = ["v2/" + i["src"] if not i["src"].startswith("../") else i["src"][3:] for i in man["icons"]]
    miss = [f for f in ["favicon.ico", "apple-touch-icon.png", "apple-touch-icon-precomposed.png"] + core + mi if ctx.request.get(base + f).status >= 400]
    rec("Auto-Anfragen (favicon, touch-icon), Service-Worker-Liste (%d), Manifest-Icons vorhanden" % len(core), not miss, "fehlt: " + ", ".join(miss[:5]))
    # --- 5 Tabs
    tabs = [("Start", "home"), ("Werkstatt", "w2"), ("Prüfstand", "pr"), ("Lernen", "missions"), ("Garage", "garage")]
    for label, v in tabs:
        pg.locator("#tab button", has_text=label).tap(); settle(700); clean()
        cur = pg.evaluate("view"); why = screen_ok(label); e = take()
        rec("Tab %s öffnet (view=%s)" % (label, v), cur == v and not why and not e, "view=%s %s %s" % (cur, why, "; ".join(e[:3])))
    # --- Garage: jedes Fahrzeug, frisch (gesperrt) und freigeschaltet
    ids = pg.evaluate("GARAGE.map(g=>[g.id,g.name])")
    for pts in (0, 99999):
        for gid, gname in ids:
            pg.evaluate("S.points=%d;go('garage')" % pts); settle(300); clean()
            c = pg.locator(".gk[onclick*=\"'%s'\"]" % gid); c.scroll_into_view_if_needed(); c.tap(); settle(900)
            cur = pg.evaluate("view"); why = screen_ok(gname); e = take()
            ok = cur == "veh" and not why and not e
            if ok:  # Zurück-Button der Fahrzeugseite
                bk = pg.locator("#app .back, #app button:has-text('‹')").first
                if bk.count(): bk.tap(); settle(500); ok = pg.evaluate("view") == "garage"; why = "" if ok else "Zurück führt nicht zur Garage"
            rec("Garage (%s Punkte): %s öffnen + zurück" % ("0" if pts == 0 else "alle", gname), ok, "view=%s %s %s" % (cur, why, "; ".join(e[:3])))
    pg.evaluate("S.points=0")
    # --- Lernen: jede Fachkarte, jede Mission
    miss = pg.evaluate("MISSIONS.map(m=>[m.id,m.subject,m.title])")
    subs = sorted(set(m[1] for m in miss), key=lambda s: [m[1] for m in miss].index(s))
    for s in subs:
        pg.evaluate("S.subj='%s';go('missions')" % s); settle(300); clean()
        n = pg.locator("#app button.item[onclick^='start(']").count(); bad = []
        for i in range(n):
            pg.evaluate("S.subj='%s';go('missions')" % s); settle(120)
            c = pg.locator("#app button.item[onclick^='start(']").nth(i); oc = c.get_attribute("onclick")
            pg.evaluate("(i)=>{[...document.querySelectorAll('#app button.item[onclick^=\"start(\"]')][i].scrollIntoView({block:'center'})}", i); settle(150)
            bb = c.bounding_box(); pg.touchscreen.tap(bb['x'] + bb['width'] - 8, bb['y'] + bb['height'] / 2)  # rechter Kartenrand, nicht der Titel
            settle(350); cur = pg.evaluate("view"); why = screen_ok(oc); e = take()
            lk = pg.evaluate("(()=>{const m=MISSIONS.find(x=>x.id==='%s'); return m&&typeof mLock==='function'?mLock(m):''})()" % re.search(r"'([^']+)'", oc).group(1))
            if lk: cur = "run" if (cur == "missions" and pg.evaluate("!!document.querySelector('.toast')")) else cur  # gesperrt: Hinweis statt Start ist richtig
            if cur != "run" or why or e: bad.append("%s: view=%s %s %s" % (oc, cur, why, "; ".join(e[:2])))
        rec("Lernen/%s: %d Karten (Tap am Kartenrand startet Mission)" % (s, n), not bad and n > 0, " | ".join(bad[:3]))
    # --- Jede Mission direkt starten (alle IDs) + ersten Schritt rendern
    bad = []
    for mid, subj, title in miss:
        pg.evaluate("go('missions');start('%s')" % mid); settle(150); why = screen_ok(mid); e = take()
        lk = pg.evaluate("(()=>{const m=MISSIONS.find(x=>x.id==='%s'); return typeof mLock==='function'?mLock(m):''})()" % mid)
        if lk and pg.evaluate("view") == "missions": continue  # gesperrt (Hinweis-Toast), kein Fehler
        if pg.evaluate("view") != "run" or why or e: bad.append("%s: %s %s" % (mid, why, "; ".join(e[:2])))
    rec("Alle %d Missionen starten (start(id))" % len(miss), not bad, " | ".join(bad[:4]))
    # --- Generischer Crawler: jeder Button auf den Hauptbildschirmen
    def crawl(name, setup):
        pg.evaluate(setup); settle(500); clean()
        n = pg.evaluate("document.querySelectorAll('#app button, #app [onclick]').length"); dead = []; bad = []
        for i in range(n):
            pg.evaluate(setup); settle(250); clean(); take()
            r = pg.evaluate("""(i)=>{const el=[...document.querySelectorAll('#app button, #app [onclick]')][i]; if(!el) return null; return [el.innerText.slice(0,25).replace(/\\n/g,' '), el.getAttribute('onclick')||'', !!el.disabled, el.offsetParent===null]}""", i)
            if not r or r[2] or r[3]: continue
            before = state()
            pg.evaluate("(i)=>{[...document.querySelectorAll('#app button, #app [onclick]')][i].click()}", i); settle(350)
            after = state(); e = take()
            if e: bad.append("'%s' → %s" % (r[0], "; ".join(e[:2])))
            elif before == after and not r[1].startswith(('egg(','vBlip')) and 'ZURÜCKSETZEN' not in r[0].upper() and not pg.evaluate("!!document.querySelector('.toast,.ss-bk,.inst-bk,.ss-news,.confetti,.coinpill,.sh,.sheet,.modal')") and 'toggle' not in r[1]:
                dead.append(r[0] or r[1][:25])
            if after[0] == 'run': pg.evaluate("go('home')")
        rec("Crawler %s: %d Elemente, keine Fehler" % (name, n), not bad, " | ".join(bad[:4]))
        rec("Crawler %s: keine toten Buttons" % name, not dead, "tot: " + ", ".join(dead[:6]))
    crawl("Start", "go('home')")
    crawl("Werkstatt", "go('w2')")
    crawl("Prüfstand", "go('pr')")
    crawl("Garage", "S.points=99999;go('garage')")
    crawl("Interaktive Missionen", "go('hub')")
    crawl("Eltern", "go('parents')")
    crawl("Fahrzeugseite S51", "S.points=99999;openVeh('g1')")
    crawl("Fahrzeugseite Rasentraktor", "S.points=99999;openVeh('g2')")
    pg.evaluate("S.points=50;save();go('parents')"); settle(300)
    pg.evaluate("[...document.querySelectorAll('#app button')].find(b=>/ZURÜCKSETZEN/i.test(b.innerText)).click()"); settle(600)
    e = take(); rec("Eltern: Fortschritt zurücksetzen setzt Punkte auf 0", pg.evaluate("S.points") == 0 and not e, "Punkte=%s %s" % (pg.evaluate("S.points"), e))
    fails = [r for r in res if not r[1]]
    print("\n== %d OK, %d FEHLER" % (len(res) - len(fails), len(fails)))
    b.close(); sys.exit(1 if fails else 0)
