# Workshop VSCode - Sistema Risposte

## 🎯 Soluzione Implementata: Firebase Firestore

### Perché Firebase?

**✅ Vantaggi per il tuo caso d'uso:**

1. **Real-time sync** - Tutti i partecipanti vedono le risposte istantaneamente
2. **No backend** - Funziona perfettamente con GitHub Pages (solo frontend)
3. **Scalabile** - Gestisce facilmente centinaia di partecipanti simultanei
4. **Gratis** - Free tier più che sufficiente per workshop
5. **Facile accesso** - Console web + pagina admin custom + export JSON/CSV

### Come funziona

```
Partecipante 1 → Aggiunge una domanda → Firebase Firestore
                                            ↓
Partecipante 2 → Vede la domanda IN TEMPO REALE nel dropdown
                                            ↓
Partecipante 3 → Risponde alla nuova domanda
                                            ↓
         Tu (organizzatore) → Accedi via console o /admin → Export
```

**Due collezioni Firebase:**

- `workshop-responses` - Tutte le risposte dei partecipanti
- `workshop-questions` - Tutte le domande (predefinite + custom)

**Come funzionano le domande:**

1. **Domande predefinite (24)** - Esistono nel codice ma vengono salvate in Firebase **solo quando qualcuno risponde per la prima volta**
2. **Domande custom** - Create dai partecipanti tramite il pannello "Aggiungi Domanda", salvate immediatamente in Firebase
3. **Sincronizzazione automatica** - Il dropdown mostra sempre le domande predefinite (non ancora salvate) + tutte le domande da Firebase

## 🚀 Quick Start

### 1. Installa dipendenze

```bash
npm install
```

### 2. Setup Firebase (5 minuti)

Segui la guida completa in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**TL;DR:**

1. Crea progetto su [Firebase Console](https://console.firebase.google.com/)
2. Abilita Firestore Database (test mode)
3. Copia credenziali in `.env.local`

### 3. Avvia l'app

```bash
npm run dev
```

Vai su `http://localhost:3000`

## 📊 Accedere alle Risposte

### Opzione 1: Pagina Admin (consigliata)

```
http://localhost:3000/admin
```

- Statistiche per domanda
- Export JSON
- Export CSV
- Filtra per domanda

### Opzione 2: Firebase Console

```
Firebase Console → Firestore Database → Collection: workshop-responses
```

- Real-time updates
- Export batch
- Query avanzate

### Opzione 3: Programmaticamente

```javascript
import { useAllResponses } from "./lib/useWorkshopResponses";
import { useWorkshopQuestions } from "./lib/useWorkshopQuestions";

function MyComponent() {
  const { allResponses, loading } = useAllResponses();
  const { allQuestions } = useWorkshopQuestions();

  // allResponses contiene:
  // [
  //   {
  //     id: "abc123",
  //     questionId: "5",  // Sempre stringa
  //     question: "Per chi documentiamo?",
  //     name: "Mario Rossi",
  //     answer: "Per gli agenti AI principalmente...",
  //     timestamp: Timestamp,
  //     timestampISO: "2026-02-26T10:30:00.000Z"
  //   },
  //   ...
  // ]

  // allQuestions contiene:
  // [
  //   {
  //     id: 5,  // Numero per predefinite, stringa per custom
  //     question: "Per chi documentiamo?",
  //     author: "Workshop",
  //     isPredefined: true,
  //     isCustom: false,
  //     createdAt: Timestamp
  //   },
  //   {
  //     id: "xyz789",
  //     question: "Come gestiamo...?",
  //     author: "Luigi Bianchi",
  //     isPredefined: false,
  //     isCustom: true,
  //     createdAt: Timestamp
  //   }
  // ]
}
```

## 🔒 Sicurezza

Le Firestore Security Rules permettono:

- ✅ **Lettura**: chiunque (per vedere le risposte)
- ✅ **Scrittura**: solo risposte valide (max 50 char nome, 1000 char risposta)
- ❌ **Update/Delete**: nessuno (immutabilità)

## 📁 Struttura File

```
src/
├── app/
│   ├── admin/
│   │   └── page.js              # Pagina admin per visualizzare/esportare
│   └── WorkshopPresentation.jsx # Componente principale con Copilot panel
├── lib/
│   ├── firebase.js              # Configurazione Firebase
│   └── useWorkshopResponses.js  # Hook per gestire le risposte
.env.local                        # Credenziali Firebase (NON committare!)
.env.example                      # Template credenziali
FIREBASE_SETUP.md                 # Guida setup completa
```

## 🎨 Features Copilot Panel

### Modalità Rispondi

- ✨ Dropdown per selezionare domanda (predefinite + custom)
- 📝 Form nome + risposta
- 🔄 Aggiornamento real-time
- ⏱️ Timestamp automatico
- 🚫 Validazione campi
- 📊 Contatore risposte
- 🎯 Filtro per domanda

### Modalità Aggiungi Domanda (NUOVO!)

- ➕ Proponi nuove domande durante il workshop
- 👥 Tutte le domande custom visibili a tutti in tempo reale
- 🔄 Sincronizzazione automatica
- 📋 Lista delle ultime 5 domande aggiunte
- ✅ Le nuove domande appaiono immediatamente nel dropdown

### Toggle tra modalità

- 💬 **Rispondi** - Seleziona e rispondi alle domande
- ➕ **Aggiungi Domanda** - Proponi nuove domande al gruppo

## 🌐 Deploy su GitHub Pages

1. **Configura GitHub Secrets:**

   ```
   Settings → Secrets → Actions → New repository secret

   Aggiungi:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID
   ```

2. **Modifica il workflow GitHub Actions:**

   ```yaml
   - name: Build
     env:
       NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
       NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
       NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
       NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
       NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
       NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
     run: npm run build
   ```

3. **Push e deploy:**
   ```bash
   git push origin main
   ```

## 🆚 Alternative Considerate

| Soluzione         | Pro                           | Contro                 |
| ----------------- | ----------------------------- | ---------------------- |
| **Firebase** ✅   | Real-time, no backend, facile | Vendor lock-in         |
| localStorage      | Semplicissimo                 | Solo locale, no sync   |
| Supabase          | Open source, PostgreSQL       | Più complesso setup    |
| GitHub Issues API | Nativo GitHub                 | Rate limits stringenti |
| Google Sheets     | Facilissimo                   | Rate limits, lento     |

## 💡 Tips

**Durante il workshop:**

- Tieni aperto `/admin` in un tab per monitorare live
- Condividi lo schermo `/admin` per mostrare le risposte in tempo reale

**Dopo il workshop:**

- Export CSV per analisi (Excel, Google Sheets)
- Export JSON per processing automatico
- Backup dalla Firebase Console

**Moderazione:**

- Se necessario, filtra/elimina risposte dalla Firebase Console
- Per workshop privati, considera l'autenticazione (vedi FIREBASE_SETUP.md)

## 🐛 Troubleshooting

**"Firebase not initialized"**
→ Verifica `.env.local` con tutti i valori corretti

**Le risposte non si vedono**
→ Controlla le Firestore Rules, dovrebbero essere in "test mode"

**Errore CORS**
→ Assicurati che il dominio sia autorizzato in Firebase Console → Authentication → Settings

---

**Pronto per il workshop! 🚀**

Domande? Controlla [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) per la guida completa.
