#!/bin/bash
# Konsolenprüfung: ./v2/ctest.sh <shotname> ... gibt Fehlerzeilen aus (leer = 0 Fehler)
cd "$(dirname "$0")/.." || exit 1
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; T=$(mktemp -d)
for k in "$@"; do echo "== $k"; "$CH" --headless=new --disable-gpu $CHX --allow-file-access-from-files --user-data-dir="$T/$k" --enable-logging=stderr --v=0 --virtual-time-budget=5000 --window-size=390,844 --dump-dom "file://$PWD/v2/index.html#shot=$k" 2>&1 >/dev/null | grep -i "CONSOLE" | grep -iv "favicon" ; done
