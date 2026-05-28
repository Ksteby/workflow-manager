**Titre :** Rapport de projet : Développement d'une plateforme collaborative pour la gestion des tâches.

**Étudiants :** KEMO TOUOHOU STEBY 

**Cours :** Technologies Internet

#### 1. Introduction

Le présent document décrit l'architecture, les fonctionnalités et les choix de mise en œuvre relatifs au projet « Workflow Manager ». L'objectif était de développer une application monopage (SPA) pour la gestion collaborative des tâches, inspirée des plateformes modernes de gestion de projets professionnels. L'application prend en charge à la fois une utilisation individuelle (Espace Personnel) et une utilisation collaborative (Équipe), garantissant la sécurité, la cohérence des données et une expérience utilisateur (UX) fluide.

#### 2. Architecture du système

Le système a été développé selon une architecture client-serveur :
* **Frontend (client) :** développé en React.js, il gère l'état de l'application de manière réactive. Pour simuler la réactivité en temps réel, un mécanisme de *polling* (intervalle de 5 secondes) a été mis en place afin de synchroniser en permanence l'interface avec la base de données.
* **Backend (serveur) :** Implémenté avec Node.js et Express. Il fournit une API RESTful pour la gestion des ressources (utilisateurs, équipes, colonnes, tâches).
* **Persistance des données :** Afin de conserver un projet léger et exécutable dans n'importe quel environnement sans dépendances externes, le choix s'est porté sur une base de données basée sur le système de fichiers (`data.json`). L'accès au fichier est géré via un module dédié (`dataManager.js`) afin d'éviter toute corruption des données.

#### 3. Fonctionnalités et contrôle d'accès 

Une attention particulière a été accordée à la sécurité et aux autorisations. Un système de *contrôle d'accès basé sur les rôles* a été mis en place :
* **Gestion des équipes :** Le créateur d'une équipe devient automatiquement *propriétaire*. Le propriétaire peut promouvoir d'autres membres au rôle d'*administrateur*, exclure des membres ou supprimer l'équipe entière.
* **Privilèges sur les tâches :** Dans les projets d'équipe, les tâches ne peuvent être modifiées ou supprimées que par les administrateurs ou par l'utilisateur spécifiquement affecté à cette tâche. Pour les autres membres, la tâche est présentée en mode « lecture seule » (Read-Only) afin de préserver l'intégrité du flux de travail.
* **Isolation des données :** Les utilisateurs standard ne peuvent pas consulter la liste globale des inscrits à l'application, mais uniquement les membres appartenant à leurs propres équipes, garantissant ainsi la confidentialité.

#### 4. Défis techniques et solutions de mise en œuvre
Au cours du développement, plusieurs défis techniques de haut niveau ont été relevés et résolus :

1.  **Gestion des « conditions de concurrence » dans le flux d'invitation :**
    Au départ, l'arrivée d'un nouvel utilisateur via un « lien d'invitation » entraînait des problèmes d'asynchronisme entre la création du compte et l'intégration dans l'équipe. La solution définitive a consisté à réorganiser les routes API `/register` et `/login` afin qu'elles traitent le *token d'invitation* dans la même transaction côté serveur, garantissant ainsi l'ajout à l'équipe et le renvoi des données mises à jour en une seule réponse synchrone.
2.  **Calcul précis des échéances (bug de fuseau horaire) :**
    La comparaison des dates d'échéance (Deadlines) présentait des problèmes dus à l'interprétation au format UTC par JavaScript, ce qui faussait la reconnaissance du retard. Le problème a été résolu en analysant (« parsing ») manuellement la chaîne YYYY-MM-DD et en instanciant l'objet « Date » en le forçant au fuseau horaire local de l'utilisateur.
3.  **Optimisation de l'expérience utilisateur et retour d'information asynchrone :**
    Afin d'éviter la surcharge cognitive de l'interface, les actions secondaires (gestion des membres, changement de thème, déconnexion) ont été regroupées dans un menu déroulant intelligent qui utilise le modèle *click-outside* pour la fermeture automatique. De plus, afin de fournir un retour d'information immédiat sur les opérations CRUD (création, modification, suppression) et les processus d'authentification, la bibliothèque `react-toastify` a été intégrée. Ce système de notifications « Toast » communique à l'utilisateur le résultat des requêtes adressées au serveur (succès ou erreur) de manière élégante et non bloquante, élevant ainsi la perception qualitative de l'application aux standards professionnels.

#### 5. Évolutions futures
Bien que l'application soit complète, les évolutions futures pourraient inclure la migration de la base de données vers un système relationnel (par exemple PostgreSQL) ou NoSQL (par exemple MongoDB) pour faire face à une forte concurrence, et l'intégration de WebSockets (par exemple Socket.io) en remplacement du polling, afin d'assurer une mise à jour en temps réel plus efficace.

#### 6. Conclusions
Le projet « Workflow Manager » s'impose comme une solution robuste, évolutive et sécurisée. Les choix techniques retenus témoignent d'une compréhension approfondie du cycle de vie des données, de la sécurité côté serveur et de la gestion réactive des interfaces utilisateur sous React.
