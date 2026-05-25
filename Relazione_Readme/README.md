#  Workflow Manager

Un'applicazione web completa per la gestione dei progetti e delle attività lavorative, ispirata a strumenti come Trello e Jira. Permette agli utenti di organizzare compiti, collaborare in team, impostare scadenze e gestire i permessi in tempo reale.

##  Caratteristiche Principali

* **Gestione degli Utenti e Sicurezza:** Autenticazione completa (Login/Registrazione) con gestione sicura delle sessioni ('sessionStorage') per evitare la perdita di dati al refresh della pagina.
* **Aree di Lavoro Personali e di Team:** Ogni utente ha uno spazio personale e può creare o unirsi a spazi di lavoro condivisi.
* **Sistema di Invito Tramite Link:** Flusso di invito continuo e senza interruzioni. I nuovi utenti possono registrarsi tramite un link di invito e atterrare direttamente nel team corretto.
* **Controllo degli Accessi (RBAC):** Privilegi granulari. Solo gli amministratori possono eliminare team, nominare co-amministratori o espellere membri. Modalità "Sola Lettura" per i membri non autorizzati alla modifica di task specifici.
* **Gestione Task Avanzata:** Drag & Drop intuitivo per spostare i task tra le colonne. Impostazione di priorità e scadenze.
* **Notifiche Visive Intelligenti:** Segnalazione visiva immediata per le task in ritardo, con gestione accurata dei fusi orari locali.
* **Collaborazione in Tempo Reale:** Sezione commenti integrata per le task di team e aggiornamento automatico dell'interfaccia (Polling) per riflettere le modifiche fatte da altri membri.
* **UI/UX Premium:** Modalità Chiaro/Scuro, menu a tendina a scomparsa automatica (click outside), effetti di hover fluidi e design responsivo.
* **Feedback Visivo Istantaneo:** Utilizzo di notifiche "Toast" non intrusive per informare l'utente in tempo reale sull'esito delle operazioni (successo, errori di validazione, inviti) senza interrompere il flusso di lavoro.

## Tecnologie Utilizzate

* **Frontend:** React.js, Framer Motion (per le animazioni), @hello-pangea/dnd (per il Drag & Drop), React-Toastify (per il sistema di notifiche).
* **Backend:** Node.js, Express.js.
* **Database:** JSON basato su file system ('data.json') per uno storage leggero e portabile, gestito tramite un modulo custom (`dataManager.js`).
* **Sicurezza:** Bcrypt.js per l'hashing delle password.

## ⚙️ Installazione e Avvio

1. **Clona il repository:**
   ```bash
   git clone [https://github.com/Ksteby/workflow-manager.git](https://github.com/Ksteby/workflow-manager.git)
   cd workflow-manager

2. **Avvia il Backend (server)
    cd server
    npm install
    node server.js   
    Il server sarà in ascolto sulla porta 5000

3. **Avvia il Frontend (client)
     cd client
     npm install
     npm run dev
     L'applicazione sarà accessibile all'indirizzo http://localhost:5173
 
     


