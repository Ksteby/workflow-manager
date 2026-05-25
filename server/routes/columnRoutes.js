const express = require('express');

const router = express.Router();

const { readData, saveData } = require('../utils/dataManager');


// ======================================================
// GET ALL COLUMNS
// ======================================================

router.get('/', (req, res) => {

    const data = readData();

    res.json(data.columns);

});


// ======================================================
// CREATE COLUMN
// ======================================================

router.post('/', (req, res) => {

    const {
        title,
        workspaceId
    } = req.body;

    if (!title || !workspaceId) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const data = readData();

    const workspaceColumns = data.columns.filter(
        col => col.workspaceId === workspaceId
    );

    const newColumn = {

        id: 'column-' + Date.now(),

        workspaceId,

        title,

        position: workspaceColumns.length

    };

    data.columns.push(newColumn);

    saveData(data);

    res.status(201).json(newColumn);

});


// ======================================================
// UPDATE COLUMN
// ======================================================

router.put('/:id', (req, res) => {

    const { id } = req.params;

    const { title } = req.body;

    const data = readData();

    const column = data.columns.find(c => c.id === id);

    if (!column) {
        return res.status(404).json({
            error: 'Column not found'
        });
    }

    if (title !== undefined) {
        column.title = title;
    }

    saveData(data);

    res.json(column);

});


// ======================================================
// MOVE COLUMN
// ======================================================

router.put('/:id/move', (req, res) => {

    const { id } = req.params;

    const { newPosition } = req.body;

    const data = readData();

    const column = data.columns.find(c => c.id === id);

    if (!column) {
        return res.status(404).json({
            error: 'Column not found'
        });
    }

    column.position = newPosition;

    saveData(data);

    res.json({
        message: 'Column moved successfully',
        column
    });

});


// ======================================================
// RENAME A COLUMN
// ======================================================
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const data = readData();
    const column = data.columns.find(c => c.id === id);

    if (!column) return res.status(404).json({ error: 'Column not found' });

    column.title = title;
    saveData(data);
    res.json(column);
});


// ======================================================
// DELETE COLUMN
// ======================================================

router.delete('/:id', (req, res) => {

    const { id } = req.params;

    const data = readData();

    const column = data.columns.find(c => c.id === id);

    if (!column) {
        return res.status(404).json({
            error: 'Column not found'
        });
    }

    // Delete related tasks
    data.tasks = data.tasks.filter(
        task => task.columnId !== id
    );

    // Delete column
    data.columns = data.columns.filter(
        col => col.id !== id
    );

    saveData(data);

    res.json({
        message: 'Column deleted successfully'
    });

});

module.exports = router;