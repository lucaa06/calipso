#!/usr/bin/env python3
import json, re, os

LANG_DIR = '/home/luca/Scaricati/calipso-main (2)/lang'
JS_FILE = '/home/luca/Scaricati/calipso-main (2)/i18n.js'
HTML_FILE = '/home/luca/Scaricati/calipso-main (2)/index.html'

NEW_KEYS = {
    "proof.stat1": { "it": "Aziende servite", "en": "Companies served", "fr": "Entreprises servies", "de": "Bediente Unternehmen", "es": "Empresas atendidas" },
    "proof.stat2": { "it": "Progetti completati", "en": "Completed projects", "fr": "Projets complétés", "de": "Abgeschlossene Projekte", "es": "Proyectos completados" },
    "proof.stat3": { "it": "% Clienti soddisfatti", "en": "% Satisfied clients", "fr": "% Clients satisfaits", "de": "% Zufriedene Kunden", "es": "% Clientes satisfechos" },
    
    "proof.rev1.qt": { "it": "\"Calipso ha trasformato la nostra presenza online. In 3 mesi il traffico organico è triplicato e le richieste di preventivo raddoppiate.\"", "en": "\"Calipso transformed our online presence. In 3 months, organic traffic tripled and quote requests doubled.\"", "fr": "\"Calipso a transformé notre présence en ligne. En 3 mois, le trafic organique a triplé et les demandes de devis ont doublé.\"", "de": "\"Calipso hat unsere Online-Präsenz transformiert. In 3 Monaten hat sich der organische Traffic verdreifacht und die Angebotsanfragen verdoppelt.\"", "es": "\"Calipso ha transformado nuestra presencia online. En 3 meses el tráfico orgánico se ha triplicado y las solicitudes de presupuesto se han duplicado.\"" },
    "proof.rev1.who": { "it": "Marco R. &mdash; CEO, Fashion E-commerce", "en": "Marco R. &mdash; CEO, Fashion E-commerce", "fr": "Marco R. &mdash; PDG, E-commerce de Mode", "de": "Marco R. &mdash; CEO, Fashion E-Commerce", "es": "Marco R. &mdash; CEO, Fashion E-commerce" },

    "proof.rev2.qt": { "it": "\"Professionali, veloci e con un'attenzione maniacale ai dettagli. Il sito è un capolavoro sia esteticamente che tecnicamente.\"", "en": "\"Professional, fast, and with an obsessive attention to detail. The site is a masterpiece both aesthetically and technically.\"", "fr": "\"Professionnels, rapides et avec une attention obsessionnelle aux détails. Le site est un chef-d'œuvre tant esthétiquement que techniquement.\"", "de": "\"Professionell, schnell und mit einer obsessiven Liebe zum Detail. Die Website ist sowohl ästhetisch als auch technisch ein Meisterwerk.\"", "es": "\"Profesionales, rápidos y con una atención obsesiva a los detalles. El sitio es una obra maestra tanto estética como técnicamente.\"" },
    "proof.rev2.who": { "it": "Laura S. &mdash; Fondatrice, Studio Architettura", "en": "Laura S. &mdash; Founder, Architecture Studio", "fr": "Laura S. &mdash; Fondatrice, Studio d'Architecture", "de": "Laura S. &mdash; Gründerin, Architekturbüro", "es": "Laura S. &mdash; Fundadora, Estudio de Arquitectura" },

    "proof.rev3.qt": { "it": "\"Finalmente un'agenzia che capisce il business, non solo il codice. ROI chiaro fin dal primo mese dopo il lancio.\"", "en": "\"Finally an agency that understands business, not just code. Clear ROI from the very first month after launch.\"", "fr": "\"Enfin une agence qui comprend le business, pas seulement le code. Un ROI clair dès le premier mois après le lancement.\"", "de": "\"Endlich eine Agentur, die das Geschäft versteht, nicht nur den Code. Klarer ROI schon im ersten Monat nach dem Start.\"", "es": "\"Por fin una agencia que entiende el negocio, no solo el código. ROI claro desde el primer mes después del lanzamiento.\"" },
    "proof.rev3.who": { "it": "Andrea B. &mdash; Direttore Marketing, B2B SaaS", "en": "Andrea B. &mdash; Marketing Director, B2B SaaS", "fr": "Andrea B. &mdash; Directeur Marketing, SaaS B2B", "de": "Andrea B. &mdash; Marketingleiter, B2B SaaS", "es": "Andrea B. &mdash; Director de Marketing, B2B SaaS" }
}

# 1. Update JSON files
bundled = {}
for lang_code in ['it', 'en', 'es', 'fr', 'de']:
    fpath = os.path.join(LANG_DIR, f'{lang_code}.json')
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for key, translations in NEW_KEYS.items():
            if key not in data:
                data[key] = translations.get(lang_code, translations.get('en', ''))
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        bundled[lang_code] = data

# 2. Bundle into i18n.js
bundled_str = json.dumps(bundled, ensure_ascii=False)
with open(JS_FILE, 'r', encoding='utf-8') as f:
    js_content = f.read()

new_content = re.sub(
    r'const BUNDLED_TRANSLATIONS = \{.*?\};',
    f'const BUNDLED_TRANSLATIONS = {bundled_str};',
    js_content
)
with open(JS_FILE, 'w', encoding='utf-8') as f:
    f.write(new_content)

# 3. Patch HTML File
with open(HTML_FILE, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<span class="proof-lbl">Aziende servite</span>', '<span class="proof-lbl" data-i18n="proof.stat1">Aziende servite</span>')
html = html.replace('<span class="proof-lbl">Progetti completati</span>', '<span class="proof-lbl" data-i18n="proof.stat2">Progetti completati</span>')
html = html.replace('<span class="proof-lbl">% Clienti soddisfatti</span>', '<span class="proof-lbl" data-i18n="proof.stat3">% Clienti soddisfatti</span>')

# reviews
qt1 = '"Calipso ha trasformato la nostra presenza online. In 3 mesi il traffico organico &egrave; triplicato e le richieste di preventivo raddoppiate."'
html = html.replace(qt1, qt1.replace('"', '', 2).replace('Calipso', '"Calipso', 1)[:-1] + '" data-i18n="proof.rev1.qt">"Calipso ha trasformato la nostra presenza online. In 3 mesi il traffico organico &egrave; triplicato e le richieste di preventivo raddoppiate."')

html = html.replace('<p class="proof-qt">"Calipso ha trasformato', '<p class="proof-qt" data-i18n="proof.rev1.qt">"Calipso ha trasformato')
html = html.replace('<span class="proof-who">Marco R. &mdash; CEO, Fashion E-commerce</span>', '<span class="proof-who" data-i18n="proof.rev1.who">Marco R. &mdash; CEO, Fashion E-commerce</span>')

html = html.replace('<p class="proof-qt">"Professionali, veloci e con un\'attenzione', '<p class="proof-qt" data-i18n="proof.rev2.qt">"Professionali, veloci e con un\'attenzione')
html = html.replace('<span class="proof-who">Laura S. &mdash; Fondatrice, Studio Architettura</span>', '<span class="proof-who" data-i18n="proof.rev2.who">Laura S. &mdash; Fondatrice, Studio Architettura</span>')

html = html.replace('<p class="proof-qt">"Finalmente un\'agenzia che capisce il', '<p class="proof-qt" data-i18n="proof.rev3.qt">"Finalmente un\'agenzia che capisce il')
html = html.replace('<span class="proof-who">Andrea B. &mdash; Direttore Marketing, B2B SaaS</span>', '<span class="proof-who" data-i18n="proof.rev3.who">Andrea B. &mdash; Direttore Marketing, B2B SaaS</span>')

with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

print("Proof section translations applied successfully!")
