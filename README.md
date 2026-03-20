# Calipso — Web Agency Genova

Sito istituzionale di **Calipso Web Agency**, ospitato su GitHub Pages.

## Struttura del progetto

```
/
├── index.html       → Pagina principale
├── privacy.html     → Privacy Policy (GDPR)
├── cookie.html      → Cookie Policy
├── 404.html         → Pagina errore personalizzata
├── robots.txt       → Istruzioni per i crawler SEO
├── sitemap.xml      → Mappa del sito per i motori di ricerca
├── manifest.json    → Manifest PWA (installazione mobile)
├── .nojekyll        → Disabilita il processing Jekyll di GitHub
└── README.md        → Questo file
```

## Hosting

Il sito è ospitato su **GitHub Pages**. Per aggiornarlo basta fare push sul branch `main` (o quello configurato nelle impostazioni del repository).

## Configurazione GitHub Pages

1. Vai su **Settings → Pages** nel repository
2. Source: **Deploy from a branch**
3. Branch: `main` → `/ (root)`
4. Salva

Il sito sarà disponibile all'indirizzo `https://<username>.github.io/<repo>/`

## Dominio personalizzato (opzionale)

Per usare un dominio custom (es. `www.calipso.it`):
1. Crea un file `CNAME` nella root con il tuo dominio
2. Configura i record DNS del tuo dominio:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME www` → `<username>.github.io`
3. Attiva HTTPS nelle impostazioni GitHub Pages

## Aggiornare il sito

Dopo aver modificato i file:
```bash
git add .
git commit -m "Update: descrizione modifica"
git push
```

Il sito si aggiorna automaticamente in pochi minuti.

## Contatto

genovaagencydesign@gmail.com
