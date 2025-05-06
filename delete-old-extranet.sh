
#!/bin/bash

echo "Suppression des anciens fichiers"
rm -rf asset-manifest.json
rm -rf assets
rm -rf css
rm favicon.ico
rm fonts
rm -rf images
rm index.html
rm logo192.png
rm logo512.png
rm manifest.json
rm robots.txt
rm -rf stat

echo "copie du contenu de dossier extranet à la racine"
cp -r /extranet/* .