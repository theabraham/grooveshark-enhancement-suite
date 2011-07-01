#!/bin/sh

PROJ_DIR='../../..'
PREFILES="
ges_styles.js
ges_events.js
ges_ui.js
ges_modules.js
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

find ${PROJ_DIR}/modules -name "*.js"  | while read FILENAME;
do
    cat $FILENAME >> combined.js
    echo " > ${FILENAME}"
done 

for file in $POSTFILES
do
    cat $PROJ_DIR/$file >> combined.js
    echo " > ${file}"
done 

sed -e '/CODEGOESHEREOKAY/ r combined.js' < contentscript.temp.js > contentscript.js
mv contentscript.js ../contentscript.js
rm combined.js
echo "Build Complete."
