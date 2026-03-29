#!/bin/bash
# Esegui questo script nella cartella del tuo progetto (dove c'è index.html)
# Comando: bash FIX_index.sh

FILE="index.html"
OLD="https://calipso-agency.github.io/"
NEW="https://lucaa06.github.io/calipso/"

if [ ! -f "$FILE" ]; then
  echo "❌ index.html non trovato. Assicurati di eseguire lo script nella cartella giusta."
  exit 1
fi

# Backup
cp "$FILE" "${FILE}.backup"
echo "✅ Backup creato: index.html.backup"

# Sostituzione
sed -i "s|$OLD|$NEW|g" "$FILE"

COUNT=$(grep -c "$NEW" "$FILE")
echo "✅ Sostituzione completata: trovate e corrette $COUNT occorrenze."
echo ""
echo "Verifica con: grep -n 'canonical\|og:url\|schema.org' index.html"
