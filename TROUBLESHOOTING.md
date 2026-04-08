# 🔧 Troubleshooting Firebase

## Errore: "Missing or insufficient permissions"

### Sintomo

```
Error fetching questions: FirebaseError: Missing or insufficient permissions.
```

### Causa

Le Firestore Security Rules non sono configurate correttamente o manca un indice.

### Soluzione Rapida (5 minuti)

#### 1. Aggiorna le Security Rules

Vai su **Firebase Console → Firestore Database → Rules**

Copia e incolla questo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workshop-responses/{document=**} {
      allow read: if true;
      allow create: if request.resource.data.name is string
                    && request.resource.data.answer is string
                    && request.resource.data.questionId is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 50
                    && request.resource.data.answer.size() > 0
                    && request.resource.data.answer.size() <= 1000;
      allow update, delete: if false;
    }

    match /workshop-questions/{document=**} {
      allow read: if true;
      allow create: if request.resource.data.question is string
                    && request.resource.data.author is string
                    && request.resource.data.question.size() > 0
                    && request.resource.data.question.size() <= 500
                    && request.resource.data.author.size() > 0
                    && request.resource.data.author.size() <= 50
                    && request.resource.data.createdAt is timestamp
                    && request.resource.data.isPredefined is bool;
      allow update, delete: if false;
    }
  }
}
```

Clicca **"Publish"**

#### 2. Verifica Indici Single-Field

Vai su **Firebase Console → Firestore Database → Indexes → Single field**

Cerca la collection `workshop-questions` e verifica che `createdAt` abbia:

- **Collection scope:** Enabled (attivato)
- **Ascending/Descending:** Enabled (almeno uno attivo)

ℹ️ Gli indici single-field sono generalmente creati automaticamente. Se mancano, abilitali dalla stessa pagina cliccando sul campo e attivando l'indicizzazione.

#### 3. Verifica

Ricarica l'app. Dovresti vedere:

- ✅ Il pannello Copilot si carica senza errori
- ✅ Puoi aggiungere domande
- ✅ Le domande appaiono in tempo reale

---

## FAQ: Come Funzionano le Domande

### Perché non vedo le 24 domande predefinite in Firestore?

**È normale!** Le domande predefinite vengono salvate in Firebase **solo quando qualcuno risponde per la prima volta**.

**Esempio:**

```
1. Apri l'app → vedi tutte le 24 domande nel dropdown
2. Controlli Firestore → collection "workshop-questions" è vuota
3. Qualcuno risponde alla domanda #7
4. Il sistema crea automaticamente la domanda #7 in Firestore
5. Ora la domanda #7 esiste in Firestore con isPredefined: true
```

**Vantaggi:**

- Database più pulito (solo domande con risposte reali)
- Nessun setup manuale richiesto
- Salvi spazio e query

### Perché alcune domande hanno ID numerico e altre alfanumerico?

- **ID numerico (es. "5")** = Domanda predefinita salvata quando qualcuno ha risposto
- **ID alfanumerico (es. "abc123")** = Domanda custom aggiunta da un partecipante

Internamente, tutti gli ID sono convertiti a stringa per consistenza.

### Come distinguo domande predefinite da custom?

Nel database Firebase, controlla il campo `isPredefined`:

```javascript
{
  isPredefined: true; // Domanda dalle 24 predefinite
  isPredefined: false; // Domanda custom del partecipante
}
```

Nella UI, le domande custom hanno l'emoji 🆕 nel dropdown.

---

## Errore: "Firebase not initialized"

### Sintomo

Il pannello Copilot mostra un warning rosso.

### Soluzione

Verifica che `.env.local` contenga tutte le variabili:

```bash
# Controlla che il file esista
ls -la .env.local

# Verifica il contenuto (senza esporre i valori)
grep "NEXT_PUBLIC_FIREBASE" .env.local
```

Dovresti vedere 6 variabili. Se mancano:

1. Copia da `.env.example`
2. Compila con i valori dalla Firebase Console
3. Riavvia il server: `npm run dev`

---

## Errore: "The query requires an index"

### Sintomo

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

### Soluzione

Clicca direttamente sul link nell'errore. Firebase creerà l'indice automaticamente.

Oppure segui i passi in "Crea l'Indice Composite" sopra.

---

## Performance con 10+ Utenti Simultanei

### ✅ Sì, funziona perfettamente

Firebase Firestore è progettato per questo:

**Capacità:**

- ✅ **1 milione di connessioni simultanee** per progetto
- ✅ **50.000 letture/giorno** nel free tier
- ✅ **20.000 scritture/giorno** nel free tier
- ✅ **Real-time updates** < 1 secondo

**Per 10 partecipanti:**

- Scritture: ~40-80 (4-8 risposte/domande ciascuno)
- Letture: ~500-1000 (aggiornamenti real-time)
- Latenza: <500ms

**Nessun problema fino a 100+ partecipanti contemporanei.**

### Ottimizzazioni Già Implementate

1. **Listener real-time singoli** - Non polling, solo updates
2. **Indici ottimizzati** - Query veloci anche con 1000+ documenti
3. **Validazione lato Security Rules** - Previene spam/abusi
4. **Client-side caching** - React hooks con state management

### Se Superi i Limiti

Firebase mostra errori chiari:

```
FirebaseError: Quota exceeded
```

Soluzioni:

1. **Blaze Plan** (pay-as-you-go) - primi 50k read gratis comunque
2. **Rate limiting** nelle Security Rules
3. **Batch operations** per export massivo

---

## Test di Carico

Per testare con utenti simulati:

```javascript
// test-concurrent-users.js
async function simulateUsers(count) {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(
      addResponse(1, "Test Question", `User ${i}`, `Answer from user ${i}`),
    );
  }
  await Promise.all(promises);
}

// Simula 10 utenti che rispondono simultaneamente
simulateUsers(10);
```

---

## Monitoraggio Live

Durante il workshop:

1. **Firebase Console → Firestore Database**
   - Vedi i documenti aggiunti in tempo reale
   - Monitora il numero di letture/scritture

2. **Pannello Admin (`/admin`)**
   - Statistiche risposte
   - Contatore domande
   - Export immediato

3. **Browser DevTools → Console**
   - Eventuali errori Firebase
   - Network tab per latenza

---

## Checklist Pre-Workshop

Prima di iniziare con i partecipanti:

- [ ] Security Rules pubblicate
- [ ] Indice `workshop-questions` creato (stato: "Enabled")
- [ ] `.env.local` configurato
- [ ] Testato aggiunta domanda
- [ ] Testato aggiunta risposta
- [ ] Pannello `/admin` funzionante
- [ ] Export JSON/CSV testato

**Test rapido:**

```bash
# 1. Avvia app
npm run dev

# 2. Apri 2 browser (normale + incognito)
# 3. Aggiungi domanda in uno
# 4. Verifica che appaia nell'altro istantaneamente
# 5. Aggiungi risposta
# 6. Controlla /admin
```

Se tutto funziona → **sei pronto! 🚀**

---

## Contatti Utili

- [Firebase Status](https://status.firebase.google.com/)
- [Firestore Pricing Calculator](https://firebase.google.com/pricing)
- [Security Rules Playground](https://firebase.google.com/docs/rules/simulator)
