const express = require('express');
const router = express.Router();
const { readData, saveData } = require('../utils/dataManager');

// ======================================================
// GET ALL TEAMS
// ======================================================
router.get('/', (req, res) => {
    const data = readData();
    const teams = data.workspaces.filter(w => w.type === 'team');
    res.json(teams);
});

// ======================================================
// CREATE TEAM
// ======================================================
router.post('/', (req, res) => {
    const { name, ownerId } = req.body;

    if (!name || !ownerId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = readData();

    const newTeam = {
        id: 'team-' + Date.now(),
        type: 'team',
        ownerId,
        name,
        members: [ownerId],
        admins: [ownerId] // Le créateur est le premier administrateur
    };

    if (!data.workspaces) data.workspaces = [];
    data.workspaces.push(newTeam);
    saveData(data);

    res.status(201).json(newTeam);
});

// ======================================================
// GET USER TEAMS
// ======================================================
router.get('/user/:userId', (req, res) => {
    const userId = Number(req.params.userId);
    const data = readData();

    const userTeams = (data.workspaces || []).filter(workspace =>
        workspace.type === 'team' && workspace.members.includes(userId)
    );

    res.json(userTeams);
});

// ======================================================
// ADD MEMBER TO TEAM
// ======================================================
// Remplace la route 'add-member' dans TeamRoutes.js
// Remplace uniquement la route 'add-member' dans TeamRoutes.js
router.put('/:id/add-member', (req, res) => {
    const { id } = req.params;
    const memberId = Number(req.body.memberId);
    
    console.log("--- REQUÊTE AJOUT MEMBRE REÇUE ---");
    console.log("ID Équipe reçu :", id);
    console.log("ID Membre reçu :", memberId);

    const data = readData();
    const team = data.workspaces.find(w => w.id === id && w.type === 'team');

    if (!team) {
        console.error("ERREUR : Équipe non trouvée avec l'ID", id);
        return res.status(404).json({ error: 'Team not found' });
    }

    if (!team.members) team.members = [team.ownerId];

    if (team.members.includes(memberId)) {
        console.log("INFO : Utilisateur déjà présent dans l'équipe");
        return res.json(team);
    }

    console.log("ACTION : Ajout de", memberId, "à l'équipe", team.name);
    team.members.push(memberId);
    
    saveData(data); // Si le log "SUCCÈS" de dataManager s'affiche, c'est bon.

    res.json(team);
});
// ======================================================
// PROMOTE MEMBER TO ADMIN (WhatsApp style)
// ======================================================
router.put('/:id/promote', (req, res) => {
    const { id } = req.params;
    // FIX STRICT : On force la conversion en nombre
    const memberId = Number(req.body.memberId);

    const data = readData();
    const team = data.workspaces.find(w => w.id === id && w.type === 'team');

    if (!team) {
        return res.status(404).json({ error: 'Team not found' });
    }

    if (!team.admins) team.admins = [team.ownerId];

    if (team.admins.includes(memberId)) {
        return res.status(400).json({ error: 'User is already an admin' });
    }

    team.admins.push(memberId);
    saveData(data);

    res.json(team);
});

// ======================================================
// DELETE TEAM
// ======================================================
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();

    const team = data.workspaces.find(w => w.id === id && w.type === 'team');

    if (!team) {
        return res.status(404).json({ error: 'Team not found' });
    }

    data.tasks = data.tasks.filter(task => task.workspaceId !== id);
    data.columns = data.columns.filter(column => column.workspaceId !== id);
    data.workspaces = data.workspaces.filter(workspace => workspace.id !== id);

    saveData(data);
    res.json({ message: 'Team deleted successfully' });
});

// ======================================================
// RENAME A TEAM
// ======================================================
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const data = readData();
    const team = data.workspaces.find(w => w.id === id && w.type === 'team');

    if (!team) return res.status(404).json({ error: 'Team not found' });
    
    team.name = name;
    saveData(data);
    res.json(team);
});

// ======================================================
// REMOVE A MEMBER (Admin only)
// ======================================================
router.put('/:id/remove-member', (req, res) => {
    const { id } = req.params;
    const memberId = Number(req.body.memberId);
    const data = readData();
    const team = data.workspaces.find(w => w.id === id && w.type === 'team');

    if (!team) return res.status(404).json({ error: 'Team not found' });

    // On ne peut pas supprimer le créateur de l'équipe
    if (team.ownerId === memberId) {
        return res.status(403).json({ error: 'Cannot remove the team owner' });
    }

    team.members = team.members.filter(m => m !== memberId);
    // S'il était admin, on le retire aussi des admins
    if (team.admins) {
        team.admins = team.admins.filter(m => m !== memberId);
    }
    
    saveData(data);
    res.json(team);
});

module.exports = router;