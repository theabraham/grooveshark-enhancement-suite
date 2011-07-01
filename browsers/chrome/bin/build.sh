#!/bin/sh

PROJ_DIR='../../..'
FILES="
ges_styles.js
ges_events.js
ges_ui.js
ges_modules.js
modules/dupe_delete.js
modules/lyrics.js
modules/shortcuts.js
ges_db.js
ges.js
"
echo "Build Starting."

for file in $FILES 
do
    cat $PROJ_DIR/$file >> combined.js
    echo " > ${file}"
done

sed -e '/CODEGOESHEREOKAY/ r combined.js' < contentscript.temp.js > contentscript.js
mv contentscript.js ../contentscript.js
rm combined.js
echo "Build Complete."
