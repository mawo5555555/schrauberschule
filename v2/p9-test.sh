#!/bin/bash
# Selbsttest Spielstand/Migration: ./v2/p9-test.sh  -> Ausgabe der OK/FEHL-Zeilen (IndexedDB ist im Headless-Test langsam, Lauf dauert ca. 1-2 Min.)
cd "$(dirname "$0")/.." || exit 1
python3 v2/p9-slow.py 18777 & SP=$!; sleep 1
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --allow-file-access-from-files --user-data-dir=$(mktemp -d) --virtual-time-budget=${VT:-200000} --dump-dom "file://$PWD/v2/index.html#shot=migtest&slow=18777" 2>/dev/null | python3 -c "
import sys,re,html;h=sys.stdin.read();m=re.search(r'<pre id=\"p9res\"[^>]*>(.*?)</pre>',h,re.S);print('\n'.join(l[:200] for l in html.unescape(m.group(1)).split('\n')) if m else 'KEIN ERGEBNIS')"
kill $SP
