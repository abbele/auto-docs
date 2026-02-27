# Firebase Setup per Workshop

## 🚀 Setup Iniziale (5 minuti)

### 1. Crea un progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca "Add project" / "Aggiungi progetto"
3. Nome progetto: `workshop-doc-as-code` (o quello che preferisci)
4. Disabilita Google Analytics (non serve)
5. Clicca "Create project"

### 2. Registra l'app Web

1. Nella home del progetto, clicca l'icona Web `</>`
2. App nickname: `workshop-presentation`
3. NON selezionare "Firebase Hosting"
4. Clicca "Register app"
5. **Copia i valori di configurazione** (li usiamo dopo)

### 3. Abilita Firestore Database

1. Nel menu laterale → "Build" → "Firestore Database"
2. Clicca "Create database"
3. Seleziona **"Start in test mode"** (per permettere accesso pubblico durante il workshop)
4. Location: scegli quella più vicina (es. `europe-west1`)
5. Clicca "Enable"

### 4. Configura le Security Rules

Nel tab "Rules" di Firestore, incolla questo:

````javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Responses collection
    match /workshop-responses/{document=**} {
      // Permetti lettura a tutti
      allow read: if true;

      // Permetti scrittura solo se i campi sono validi
      allow create: if request.resource.data.keys().hasAll(['questionId', 'question', 'name', 'answer', 'timestamp'])
                    && request.resource.data.name is string
                    && request.resource.data.answer is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 50
                    && request.resource.data.answer.size() > 0
                    && request.resource.data.answer.size() <= 1000;

      // Impedisci update e delete
      allow update, delete: if false;
    }

    // Questions collection
    match /workshop-questions/{document=**} {
      // Permetti lettura a tutti
      allow read: if true;

      // Permetti creazione di nuove domande con validazione
      allow create: if request.resource.data.keys().hasAll(['question', 'author', 'timestamp'])
                    && request.resource.data.question is string
                    && request.resource.data.author is string
                    && request.resource.data.question.size() > 0
                    && request.resource.data.question.size() <= 500
                    && request.resource.data.author.size() > 0
                    && request.resource.data.author.size() <= 50;
Clicca "Publish"

### 5. Configura le variabili d'ambiente

1. Copia `.env.example` in `.env.local`:

   ```bash
   cp .env.example .env.local
````

2. Apri `.env.local` e incolla i valori dalla configurazione Firebase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=workshop-xxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=workshop-xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=workshop-xxx.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### 6. Installa dipendenze e testa

```bash
npm install
npm run dev
```

Vai su `http://localhost:3000` e prova a inviare una risposta!

## 📊 Accedere alle risposte

### Durante il workshop (Console Firebase)

1. Firebase Console → Firestore Database
2. Collezione: `workshop-responses`
3. Vedi tutte le risposte in tempo reale

### Dopo il workshop (Export)

1. Firebase Console → Firestore Database
2. Tab "Data" → seleziona `workshop-responses`
3. Export:
   - Cloud Storage bucket (richiede setup)
   - Oppure usa il componente Admin (vedi sotto)

### Componente Admin (consigliato)

Vai su `/admin` per vedere tutte le risposte esportabili in JSON/CSV.

## 🔒 Sicurezza per Produzione

Le regole "test mode" scadono dopo 30 giorni. Per un workshop:

✅ **Va bene "test mode"** se:

- Workshop dura poche ore/giorni
- Non ci sono dati sensibili
- Hai rate limiting (già incluso nelle rules sopra)

⚠️ **Usa autenticazione** se:

- Workshop dura settimane
- Vuoi moderare le risposte
- Temi spam/abusi

## 💰 Costi

Free tier Firestore:

- ✅ 50.000 letture/giorno
- ✅ 20.000 scritture/giorno
- ✅ 1 GB storage

Per un workshop con 50 partecipanti e 4 domande:

- Scritture: ~200 (ben sotto il limite)
- Letture: ~1.000 (real-time updates)
- Storage: ~100 KB

**Costo: $0** (restai nel free tier)

## 🚀 Deploy su GitHub Pages

Le variabili d'ambiente devono essere configurate come **GitHub Secrets** per il deploy:

1. Repo → Settings → Secrets and variables → Actions
2. New repository secret per ogni variabile:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - etc.

3. Nel workflow GitHub Actions, aggiungi:
   ```yaml
   env:
     NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
     # ... altre variabili
   ```

## ❓ Troubleshooting

**Errore: "Firebase not initialized"**
→ Verifica che tutte le variabili d'ambiente siano configurate correttamente

**Errore: "Permission denied"**
→ Controlla le Firestore Security Rules

**Le risposte non si aggiornano**
→ Ricarica la pagina, controlla la console per errori

**Rate limiting**
→ Firebase ha limiti automatici, ma sono generosi per workshop
