# 🎸 Green Band - Sito Web Ufficiale (Green Day Tribute Band)

Sito web statico moderno, responsive, ultra-performante e pronto per la pubblicazione su **Netlify**.

---

## ⚡ Caratteristiche Principali

- **Design Punk-Rock Moderno:** Stile underground ispirato all'identità visuale dei Green Day (sfondi scuri `#0a0a0a`, accenti verde acido neon `#00ff66`, tocchi rosso punk `#ff2a4b`, tipografia tagliente con *Bebas Neue*, *Permanent Marker* e *Montserrat*).
- **Logo e Favicon:** Logo orizzontale trasparente in alta risoluzione per la navbar, l'hero e il footer; favicon coordinata per la scheda del browser.
- **Sezione Live & Google Calendar:**
  - Visualizzazione dinamica e interattiva delle date (tab *Prossimi Live* e *Archivio Live*, filtro di ricerca per città/locale, conteggio in tempo reale).
  - Box con pulsante diretto **"Iscriviti al Calendario Google"** per aggiungere automaticamente le nuove date live su smartphone/tablet.
  - Rispetto rigoroso delle specifiche: **Nessun utilizzo della parola "concerto"** (solo "Live") e **nessuna dicitura automatica superflua**.
- **Media & Promo Demo:**
  - Embed ufficiale della Promo Demo YouTube (`JtOJ8NjOqKs`) dal canale `@greenband_greendaytribute`.
  - Link per l'iscrizione immediata al canale YouTube con badge del profilo.
- **Photo Gallery Interattiva:**
  - 9 scatti live in alta risoluzione estratti dagli album ufficiali di Google Photos.
  - Lightbox modale responsive con navigazione touch/frecce tastiera ed effetto zoom.
- **Chi Siamo & Formazione:**
  - Bio punk-rock fedele riadattata dalla scheda ufficiale di *Tribute Nation* e dai canali social della band.
  - Schede dei 4 componenti: Marco (Voce e Chitarra), Luca (Chitarra), Antonio (Basso), Claudio (Batteria).
- **Repertorio:**
  - Scaletta ufficiale di 31 brani con suddivisione fedele degli album: dagli esordi di *39/Smooth* e *Kerplunk*, ai capolavori *Dookie*, *Insomniac*, *Nimrod* e *Warning*, fino ad *American Idiot*, *21st Century Breakdown* e la trilogia *¡Uno!* / *¡Dos!*.
- **Contatti & Booking:**
  - Email di contatto ufficiale: `greenband.greendaytribute@gmail.com`.
  - Tasto rapido "Copia Email negli Appunti".
  - Modulo di contatto/booking con generazione automatica del messaggio precompilato.
  - Link diretti a Instagram, YouTube e Tribute Nation.

---

## 📂 Struttura del Progetto

```text
green-band-website/
├── index.html                   # Struttura HTML5 semantica e accessibile
├── netlify.toml                 # Configurazione Netlify (headers di sicurezza & cache)
├── _redirects                   # Regole per clean routing
├── favicon.ico                  # Icona classica per browser desktop
├── favicon.png                  # Favicon moderna PNG
├── README.md                    # Documentazione del progetto
├── data/
│   └── events.json              # Database date live (sincronizzato con il calendario)
└── assets/
    ├── css/
    │   └── style.css            # Stili moderni, responsive grid, flexbox, animazioni punk
    ├── js/
    │   ├── app.js               # Navigazione mobile, lightbox modale, form booking, animazioni
    │   └── calendar.js          # Gestione date live, filtri, sincronizzazione con Google Calendar
    └── img/
        ├── logo_horizontal_transparent.png  # Logo orizzontale trasparente ufficiale
        ├── logo_square.png                  # Avatar quadrato / badge
        ├── favicon.png                      # Icona tab
        └── photo_band_1.jpg ... 9.jpg       # Foto live in alta risoluzione
```

---

## 🚀 Come Pubblicare su Netlify

### Metodo 1: Drag & Drop (Istantaneo)
1. Accedi alla tua dashboard su [Netlify](https://app.netlify.com/).
2. Vai alla sezione **Sites** e trascina l'intera cartella `green-band-website` nell'area **"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"**.
3. Il sito sarà online in pochi secondi con certificato SSL HTTPS gratuito!

### Metodo 2: Tramite Git (GitHub / GitLab / Bitbucket)
1. Crea un nuovo repository Git e carica i file della cartella `green-band-website`.
2. Su Netlify, seleziona **"Add new site" -> "Import an existing project"**.
3. Collega il repository. Il file `netlify.toml` configurerà automaticamente la cartella `.` come cartella di pubblicazione.
4. Ogni modifica caricata sul repository genererà un nuovo deploy automatico.

---

## 💻 Test in Locale

Per testare il sito sul tuo computer prima della pubblicazione:

### Con Python:
```bash
python -m http.server 8000
```
Apri il browser su: `http://localhost:8000`

### Con Node.js / npx:
```bash
npx serve
```
