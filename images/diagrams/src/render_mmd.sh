#!/bin/sh
# usage: render_mmd.sh name   (run from images/diagrams/src). Renders at natural size, 2x.
S=/private/tmp/claude-502/-Users-mac-Development-riaya-voice/ccf364d3-e672-4b9c-813d-a5b919b25020/scratchpad
M=$S/tools/node_modules/.bin/mmdc
$M -q -p $S/puppeteer.json -i "$1.mmd" -o "$S/$1.svg" -c mermaid_config.json -C mermaid_theme.css -b white
SIZE=$(python3 -c "import re;v=re.search(r'viewBox=\"([^\"]+)\"',open('$S/$1.svg').read()).group(1).split();print(int(max(float(v[2]),float(v[3])))+2)")
echo "natural max dim: $SIZE"
$M -q -p $S/puppeteer.json -i "$1.mmd" -o "../$1.png" -c mermaid_config.json -C mermaid_theme.css -s 2 --size $SIZE -b white
