# 💍 Matrimonio Elena & Davide - Galleria Foto

Benvenuti nel repository ufficiale della galleria foto del nostro matrimonio!
Questo progetto permette agli invitati di condividere le loro foto e video del nostro giorno speciale.

🌐 **Live preview**: [matrimonio-elena-e-davide.netlify.app](https://matrimonio-elena-e-davide.netlify.app)

---

## 📸 Caratteristiche

- **Supporto multilingua** - Disponibile in italiano e rumeno
- **Caricamento semplice** - Condividi foto e video direttamente dal tuo dispositivo
- **Ottimizzato per mobile** - Scatta foto o registra video direttamente dall'app
- **Galleria elegante** - Visualizza tutti i ricordi condivisi in un layout masonry responsive
- **Aggiornamenti in tempo reale** - Visualizza i nuovi contenuti caricati istantaneamente
- **Archiviazione cloud** - Tutti i media sono archiviati in modo sicuro su Cloudinary
- **Interfaccia reattiva** - Design che si adatta perfettamente a qualsiasi dispositivo

Design semplice, elegante e completamente ottimizzato per dispositivi mobili 📱

---

## 🛠️ Tecnologie usate

- [React](https://react.dev) - Libreria UI
- [TypeScript](https://www.typescriptlang.org/) - Sicurezza dei tipi
- [Tailwind CSS](https://tailwindcss.com/) - Stile
- [Vite](https://vitejs.dev) - Strumento di build
- [Cloudinary](https://cloudinary.com/) - Archiviazione e distribuzione media
- [i18next](https://www.i18next.com/) - Internazionalizzazione
- [Vitest](https://vitest.dev/) - Framework di test
- [Netlify](https://www.netlify.com/) - Hosting e deployment continuo
- [ESLint](https://eslint.org/) - Linting del codice

---

## 🚀 Come avviare in locale

> ⚠️ Prerequisito: [Node.js](https://nodejs.org) installato

```pwsh
# Clona il repository
git clone https://github.com/davide-pi/matrimonio-elena-e-davide.git
cd matrimonio-elena-e-davide

# Installa le dipendenze
npm ci

# Avvia il server di sviluppo
npm run dev

# Build per la produzione
npm run build

# Anteprima della build di produzione
npm run preview

# Esegui i test
npm test
```

## 🔧 Variabili d'ambiente

Per eseguire questo progetto, è necessario configurare le seguenti variabili d'ambiente:

- `REACT_APP_CLOUD_NAME` - Il nome del cloud Cloudinary
- `REACT_APP_UPLOAD_PRESET` - Il preset di upload Cloudinary

Per lo sviluppo locale, crea un file `.env` nella root del progetto con queste variabili.

---

## 📦 Componenti principali

- **MediaUpload**: Permette agli utenti di caricare foto e video
- **MediaGallery**: Visualizza i media caricati in un layout masonry
- **LanguageSelector**: Cambia la lingua dell'interfaccia (IT/RO)
- **NotificationSystem**: Fornisce feedback all'utente durante le operazioni

---

## 📄 Licenza

Questo progetto è distribuito con licenza MIT - vedi il file [`LICENSE`](LICENSE) per i dettagli.

---

Ultimo aggiornamento: Giugno 2025