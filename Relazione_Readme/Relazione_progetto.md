**Titolo:** Relazione di Progetto: Sviluppo di una piattaforma collaborativa per la gestione delle attività.

**Studenti:** KEMO TOUOHOU STEBY & FOUEZE MERVEILLE

**Corso:** Tecnologie Internet

#### 1. Introduzione

Il presente documento descrive l'architettura, le funzionalità e le scelte implementative relative al progetto "Workflow Manager". L'obiettivo è stato quello di sviluppare un'applicazione Single Page Application (SPA) per la gestione collaborativa di task, ispirata alle moderne piattaforme di project management lavorativo. L'applicativo supporta sia un uso individuale (Espace Personale) sia un uso collaborativo (Team), garantendo sicurezza, consistenza dei dati e un'esperienza utente (UX) fluida.

#### 2. Architettura di Sistema

Il sistema è stato sviluppato seguendo un'architettura Client-Server:
* **Frontend (Client):** Sviluppato in React.js, gestisce lo stato dell'applicazione in modo reattivo. Per simulare la reattività in tempo reale è stato implementato un meccanismo di *Polling* (intervallo di 5 secondi) che sincronizza costantemente l'interfaccia con il database.
* **Backend (Server):** Implementato con Node.js ed Express. Fornisce un'API RESTful per la gestione delle risorse (Utenti, Team, Colonne, Task).
* **Persistenza dei Dati:** Per mantenere il progetto leggero ed eseguibile in qualsiasi ambiente senza dipendenze esterne, si è optato per un database basato su file system (`data.json`). L'accesso al file è gestito tramite un modulo dedicato (`dataManager.js`) per prevenire corruzioni dei dati.

#### 3. Funzionalità e Controllo degli Accessi 

Un focus particolare è stato posto sulla sicurezza e sui permessi. È stato implementato un sistema di *Role-Based Access Control*:
* **Gestione Team:** Il creatore di un team diventa automaticamente *Owner*. L'Owner può promuovere altri membri al ruolo di *Admin*, espellere membri, o eliminare l'intero team.
* **Privilegi sulle Task:** Nei progetti di team, le task possono essere modificate o eliminate solo dagli amministratori o dall'utente specificamente assegnato a quella task. Per gli altri membri, la task viene presentata in una modalità "Sola Lettura" (Read-Only) per preservare l'integrità del flusso di lavoro.
* **Isolamento dei Dati:** Gli utenti standard non possono visualizzare la lista globale degli iscritti all'applicazione, ma unicamente i membri appartenenti ai propri team, garantendo così la privacy.

#### 4. Sfide Tecniche e Soluzioni Implementative
Durante lo sviluppo, sono state affrontate e risolte diverse sfide tecniche di livello avanzato:

1.  **Gestione delle "Race Conditions" nel flusso di invito:**
    Inizialmente, l'ingresso di un nuovo utente tramite "Invite Link" causava problemi di asincronia tra la creazione dell'account e l'inserimento nel team. La soluzione definitiva ha previsto l'ingegnerizzazione della rotta API `/register` e `/login` affinché elaborassero il *token di invito* nella medesima transazione lato server, garantendo l'aggiunta al team e la restituzione dei dati aggiornati in un'unica risposta sincrona.
2.  **Calcolo accurato delle scadenze (Timezone Bug):**
    Il confronto delle date di scadenza (Deadlines) presentava criticità dovute all'interpretazione in formato UTC da parte di JavaScript, che sfalsava il riconoscimento del ritardo. Si è risolto analizzando ("parsing") manualmente la stringa YYYY-MM-DD e istanziando l'oggetto 'Date' forzandolo al fuso orario locale dell'utente.
3.  **Ottimizzazione della UX e Feedback Asincrono:**
    Per evitare il sovraccarico cognitivo dell'interfaccia, le azioni secondarie (gestione membri, cambio tema, logout) sono state incapsulate in un menu a tendina intelligente che implementa il pattern *click-outside* per la chiusura automatica. Inoltre, per fornire un feedback immediato sulle operazioni CRUD (creazione, modifica, eliminazione) e sui processi di autenticazione, è stata integrata la libreria `react-toastify`. Questo sistema di notifiche "Toast" comunica all'utente l'esito delle richieste al server (successo o errore) in modo elegante e non bloccante, elevando la percezione qualitativa dell'applicativo agli standard professionali.

#### 5. Sviluppi Futuri
Sebbene l'applicazione sia completa, futuri sviluppi potrebbero includere la migrazione del database su un sistema relazionale (es. PostgreSQL) o NoSQL (es. MongoDB) per supportare un'elevata concorrenza, e l'integrazione di WebSockets (es. Socket.io) in sostituzione al Polling per un aggiornamento in tempo reale più efficiente.

#### 6. Conclusioni
Il progetto "Workflow Manager" si presenta come una soluzione solida, scalabile e sicura. Le scelte progettuali adottate dimostrano una comprensione approfondita del ciclo di vita dei dati, della sicurezza lato server e della gestione reattiva delle interfacce utente in React.
