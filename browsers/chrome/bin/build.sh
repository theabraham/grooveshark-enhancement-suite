#!/bin/sh

PROJ_DIR='../../..'
OUTPUT_FILE='build.js'
FILES="
ges_styles.js
ges_events.js
ges_ui.js
ges_modules.js
modules/dupe_delete.js
modules/bieber_fever.js
modules/lyrics.js
ges.js
"

for file in $FILES 
do
    cat $PROJ_DIR/$file >> result.js
done
 
cat result.js 
