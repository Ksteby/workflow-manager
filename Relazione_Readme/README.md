# Workflow Manager


Une application web complète pour la gestion des projets et des tâches professionnelles, inspirée d'outils tels que Trello et Jira. Elle permet aux utilisateurs d'organiser leurs tâches, de collaborer en équipe, de définir des échéances et de gérer les autorisations en temps réel.


## Principales fonctionnalités


* **Gestion des utilisateurs et sécurité :** Authentification complète (connexion/inscription) avec gestion sécurisée des sessions (« sessionStorage ») pour éviter la perte de données lors du rafraîchissement de la page.
* **Espaces de travail personnels et d'équipe :** Chaque utilisateur dispose d'un espace personnel et peut créer ou rejoindre des espaces de travail partagés.
* **Système d'invitation par lien :** Processus d'invitation continu et sans interruption. Les nouveaux utilisateurs peuvent s'inscrire via un lien d'invitation et rejoindre directement l'équipe appropriée.
* **Contrôle d'accès (RBAC) :** Privilèges granulaires. Seuls les administrateurs peuvent supprimer des équipes, nommer des co-administrateurs ou exclure des membres. Mode « Lecture seule » pour les membres non autorisés à modifier des tâches spécifiques.
* **Gestion avancée des tâches :** Glisser-déposer intuitif pour déplacer les tâches entre les colonnes. Définition des priorités et des échéances.
* **Notifications visuelles intelligentes :** Signalisation visuelle immédiate des tâches en retard, avec une gestion précise des fuseaux horaires locaux.
* **Collaboration en temps réel :** Section de commentaires intégrée pour les tâches d'équipe et mise à jour automatique de l'interface (polling) pour refléter les modifications apportées par les autres membres.
* **UI/UX Premium :** Mode clair/foncé, menus déroulants à fermeture automatique (clic en dehors), effets de survol fluides et design responsive.
* **Retour visuel instantané :** Utilisation de notifications « Toast » non intrusives pour informer l'utilisateur en temps réel du résultat des opérations (succès, erreurs de validation, invitations) sans interrompre le flux de travail.


## Technologies utilisées


* **Frontend :** React.js, Framer Motion (pour les animations), @hello-pangea/dnd (pour le glisser-déposer), React-Toastify (pour le système de notifications).
* **Backend :** Node.js, Express.js.
* **Base de données :** JSON basé sur le système de fichiers (« data.json ») pour un stockage léger et portable, géré via un module personnalisé (`dataManager.js`).
* **Sécurité :** Bcrypt.js pour le hachage des mots de passe.


## Installation et démarrage


1. **Clonez le dépôt :**
``bash
git clone [https://github.com/Ksteby/workflow-manager.git](https://github.com/Ksteby/workflow-manager.git)
cd workflow-manager


2. **Démarrez le backend (serveur)
cd server
npm install
node server.js
Le serveur écoutera sur le port 5000


3. **Démarrez le frontend (client)
cd client
npm install
npm run dev
L'application sera accessible à l'adresse http://localhost:5173
