#!/bin/bash
# Konsistenztest Prüfstand-Messrechner: ./v2/pst-test.sh  (Ausgabe "PSTTEST OK ..." und Liste; sonst FEHLER + Zeilen)
cd "$(dirname "$0")/.." || exit 1
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; T=$(mktemp -d)
"$CH" --headless=new --disable-gpu --allow-file-access-from-files --user-data-dir="$T/p" --virtual-time-budget=60000 --window-size=390,844 --dump-dom "file://$PWD/v2/index.html#shot=pst-test" 2>/dev/null | sed -n '/<pre id="pst-test">/,/<\/pre>/p' | sed 's/<[^>]*>//g'
