#!/bin/bash
# Erzeugt img/manifest.js aus den vorhandenen Dateien (KI-Bilder kommen nach und nach dazu: Datei ablegen, Skript starten).
cd "$(dirname "$0")/img" || exit 1
l(){ ls "$1" 2>/dev/null | grep -E "\.$2$" | sed -E "s/\.$2$//" | sed "s/.*/'&'/" | paste -sd, -; }
echo "window.IMGS={ki:[$(l ki jpg)],foto:[$(l foto jpg)],teile:[$(l teile jpg)]};" > manifest.js
# Bilder der App-Wurzel (cover, Missions-Bilder m-*, foto) für das Offline-Paket
cd ../.. || exit 1
r="$(ls img/cover/*.jpg img/m-*.jpg img/foto/*.jpg 2>/dev/null | sed "s/.*/'&'/" | paste -sd, -)"
echo "window.IMGS_ROOT=[$r];" >> v2/img/manifest.js
cat v2/img/manifest.js
