#!/bin/bash
# ./v2/p9shot.sh <hook> [<W>x<H> ...]  -> v2/shots/p9-<hook>-<W>x<H>.png (ohne Größen: die sieben Standardgrößen)
# Schmale Größen laufen in einem iframe (Chrome headless hat sonst mindestens 500 px Fensterbreite).
cd "$(dirname "$0")/.." || exit 1
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; T=$(mktemp -d); mkdir -p v2/shots
k=$1; shift; S="${@:-320x568 390x844 430x932 768x1024 1024x1366 1280x800 1920x1080}"
for sz in $S; do w=${sz%x*}; h=${sz#*x}; ww=$(( w < 500 ? 500 : w )); sc=2; [ $w -ge 1000 ] && sc=1
  echo "<body style='margin:0;background:#000'><iframe src='file://$PWD/v2/index.html#shot=$k' style='border:0;width:${w}px;height:${h}px;position:absolute;left:0;top:0'></iframe>" > "$T/w$sz.html"
  "$CH" --headless=new --disable-gpu --hide-scrollbars $CHX --force-prefers-no-reduced-motion --allow-file-access-from-files --user-data-dir="$T/p$sz" --window-size=$ww,$h --force-device-scale-factor=$sc --virtual-time-budget=${VT:-6000} --screenshot="$T/$sz.png" "file://$T/w$sz.html" >/dev/null 2>&1
  python3 -c "from PIL import Image;import sys;Image.open('$T/$sz.png').crop((0,0,$w*$sc,$h*$sc)).save('v2/shots/p9-$k-$sz.png')"
done
