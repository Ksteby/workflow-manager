const fs = require('fs');
const path = require('path');

// we use path.resolve to ensure the absolute path
const DATA_FILE = path.resolve(__dirname, '../data.json');

const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.error("ERREUR : data.json introuvable à", DATA_FILE);
            return { users: [], workspaces: [], columns: [], tasks: [] };
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("ERREUR DE LECTURE JSON :", error);
        return { users: [], workspaces: [], columns: [], tasks: [] };
    }
};

const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log("SUCCESS : Data saved to", DATA_FILE);
    } catch (error) {
        console.error("CRITICAL BACKUP ERROR 💥:", error);
    }
};

module.exports = { readData, saveData };