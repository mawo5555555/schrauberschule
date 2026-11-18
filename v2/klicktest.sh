#!/bin/bash
# Klicktest: Server muss laufen (cd sprachfoerderung && python3 -m http.server 8731). Aufruf: ./v2/klicktest.sh
cd "$(dirname "$0")" || exit 1
curl -sfI http://localhost:8731/v2/ >/dev/null || { (cd .. && python3 -m http.server 8731 >/dev/null 2>&1 &) ; sleep 2; }
python3 klicktest.py "$@"
