#!/bin/sh

PROJ_DIR='../..'
PREFILES="
ges_styles.js
ges_events.js
ges_ui.js
ges_modules.js
"
MODULES="
dupe_delete.js
lyrics.js
shortcuts.js
"
POSTFILES="
ges_db.js
ges.js
"

for file in $PREFILES 
do
    cat $PROJ_DIR/$file >> combined.js
    echo " > ${file}"
done

for file in $MODULES
do
    cat $PROJ_DIR/modules/$file >> combined.js
    echo " > ${file}"
done

for file in $POSTFILES
do
    cat $PROJ_DIR/$file >> combined.js
    echo " > ${file}"
done 

sed -e '/CODEGOESHEREOKAY/ r combined.js' < contentscript.temp.js > contentscript.js
mv contentscript.js ../chrome/contentscript.js
rm combined.js
echo "Build Complete."
