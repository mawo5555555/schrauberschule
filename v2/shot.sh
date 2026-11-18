#!/bin/bash
# Screenshots: ./v2/shot.sh <name> [...]  -> v2/shots/<name>.png (Hochformat 390x844) und <name>-quer.png (Querformat 844x390), 2-fach Auflösung
# Namen: home sel auftrag dis asm shop dyno pr cert task mix garage missions gal alb lbd
# Optional: CHX=--force-prefers-no-reduced-motion ./v2/shot.sh ... (Mac mit "Bewegung reduzieren" sonst ohne Animationen)
cd "$(dirname "$0")/.." || exit 1
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; T=$(mktemp -d); mkdir -p v2/shots
for k in "$@"; do
  for m in "390,844,$k" "844,390,$k-quer" "1280,800,$k-desk"; do IFS=, read w h n <<< "$m"
    ww=$(( w < 500 ? 500 : w )); lx=$(( (ww - w) / 2 ))
    echo "<body style='margin:0;background:#000'><iframe src='file://$PWD/v2/index.html#shot=$k' style='border:0;width:${w}px;height:${h}px;position:absolute;left:${lx}px;top:0'></iframe>" > "$T/w$n.html"
    "$CH" --headless=new --disable-gpu --hide-scrollbars $CHX --allow-file-access-from-files --user-data-dir="$T/p$n" --window-size=$ww,$h --force-device-scale-factor=2 --virtual-time-budget=6000 --screenshot="$T/$n.png" "file://$T/w$n.html" >/dev/null 2>&1
    sips -c $((h*2)) $((w*2)) "$T/$n.png" --out "v2/shots/$n.png" >/dev/null
  done
done
