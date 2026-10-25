#!/bin/sh
# usage: render_puml.sh name   (run from images/diagrams/src)
S=${DIAGRAM_TOOLS:-/private/tmp/claude-502/-Users-mac-Development-riaya-voice/ccf364d3-e672-4b9c-813d-a5b919b25020/scratchpad}
export PATH=/opt/homebrew/bin:$PATH  # Graphviz (dot) is needed for use case layouts: brew install graphviz
java -Djava.awt.headless=true -jar $S/plantuml.jar -tpng -o .. "$1.puml"
