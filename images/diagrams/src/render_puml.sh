#!/bin/sh
# usage: render_puml.sh name   (run from images/diagrams/src)
S=/private/tmp/claude-502/-Users-mac-Development-riaya-voice/ccf364d3-e672-4b9c-813d-a5b919b25020/scratchpad
java -Djava.awt.headless=true -jar $S/plantuml.jar -tpng -o .. "$1.puml"
