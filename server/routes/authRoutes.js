const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { readData, saveData } = require('../utils/dataManager');

router.post('/register', (req, res) => {
    // 1. On récupère "invite" directement dans le formulaire
    const { name, password, invite } = req.body; 
    const data = readData();

    const userExists = data.users.find(u => u.name === name);
    if (userExists) return res.status(400).json({ error: 'Username already exists' });

    if (!password || password.length < 8) return res.status(400).json({ error: 'Password too short' });

    const newUser = {
        id: Date.now(),
        name,
        password: bcrypt.hashSync(password, 10),
        role: data.users.length === 0 ? 'admin' : 'user'
    };

    data.users.push(newUser);

    // =========================================================
    // IMMEDIATE ADDITION TO THE SERVER-SIDE TEAM
    // =========================================================
    let joinedTeamId = null;
    if (invite) {
        const team = data.workspaces.find(w => w.id === invite && w.type === 'team');
        if (team) {
            if (!team.members) team.members = [team.ownerId];
            if (!team.members.includes(newUser.id)) {
                team.members.push(newUser.id);
                joinedTeamId = invite;
            }
        }
    }

    // Back up the team and the user in a single step
    saveData(data); 

    const { password: hiddenPassword, ...safeUser } = newUser;
    if (joinedTeamId) safeUser.joinedTeamId = joinedTeamId; // On renvoie l'info au front
    
    res.status(201).json(safeUser);
});

router.post('/login', (req, res) => {
    const { name, password, invite } = req.body;
    const data = readData();

    const user = data.users.find(u => u.name === name);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    let joinedTeamId = null;
    if (invite) {
        const team = data.workspaces.find(w => w.id === invite && w.type === 'team');
        if (team) {
            if (!team.members) team.members = [team.ownerId];
            if (!team.members.includes(user.id)) {
                team.members.push(user.id);
                joinedTeamId = invite;
                saveData(data); // Save the team addition
            } else {
                joinedTeamId = invite; 
            }
        }
    }

    const { password: hiddenPassword, ...safeUser } = user;
    if (joinedTeamId) safeUser.joinedTeamId = joinedTeamId;
    
    res.json(safeUser);
});

router.get('/users', (req, res) => {
    const data = readData();
    res.json(data.users.map(u => ({ id: u.id, name: u.name, role: u.role })));
});

module.exports = router;