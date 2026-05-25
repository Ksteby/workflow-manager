const express = require('express');

const router = express.Router();

const { readData, saveData } = require('../utils/dataManager');


// ======================================================
// GET ALL TASKS
// ======================================================

router.get('/', (req, res) => {

    const data = readData();

    res.json(data.tasks);

});


// ======================================================
// CREATE TASK
// ======================================================

router.post('/', (req, res) => {

    const {
        title,
        columnId,
        workspaceId,
        createdBy
    } = req.body;

    if (!title || !columnId || !workspaceId) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const data = readData();

    const tasksInColumn = data.tasks.filter(
        task => task.columnId === columnId
    );

    const newTask = {

        id: 'task-' + Date.now(),

        workspaceId,

        columnId,

        title,

        description: '',

        priority: 'Medium',

        startDate: null,

        endDate: null,

        assigneeId: null,

        createdBy,

        position: tasksInColumn.length,

        comments: []

    };

    data.tasks.push(newTask);

    saveData(data);

    res.status(201).json(newTask);

});


// ======================================================
// UPDATE TASK
// ======================================================

router.put('/:id', (req, res) => {

    const { id } = req.params;

    const data = readData();

    const task = data.tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    const {
        title,
        description,
        priority,
        startDate,
        endDate,
        assigneeId
    } = req.body;

    if (title !== undefined) task.title = title;

    if (description !== undefined) {
        task.description = description;
    }

    if (priority !== undefined) {
        task.priority = priority;
    }

    if (startDate !== undefined) {
        task.startDate = startDate;
    }

    if (endDate !== undefined) {
        task.endDate = endDate;
    }

    if (assigneeId !== undefined) {
        task.assigneeId = assigneeId;
    }

    saveData(data);

    res.json(task);

});


// ======================================================
// MOVE TASK (DRAG & DROP)
// ======================================================

router.put('/:id/move', (req, res) => {

    const { id } = req.params;

    const {
        destinationColumnId,
        newPosition
    } = req.body;

    const data = readData();

    const task = data.tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    task.columnId = destinationColumnId;

    task.position = newPosition;

    saveData(data);

    res.json({
        message: 'Task moved successfully',
        task
    });

});


// ======================================================
// DELETE TASK
// ======================================================

router.delete('/:id', (req, res) => {

    const { id } = req.params;

    const data = readData();

    const taskExists = data.tasks.find(t => t.id === id);

    if (!taskExists) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    data.tasks = data.tasks.filter(t => t.id !== id);

    saveData(data);

    res.json({
        message: 'Task deleted successfully'
    });

});


// ======================================================
// ADD COMMENT
// ======================================================

router.post('/:id/comments', (req, res) => {

    const { id } = req.params;

    const {
        text,
        authorId
    } = req.body;

    if (!text) {
        return res.status(400).json({
            error: 'Comment text required'
        });
    }

    const data = readData();

    const task = data.tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    const newComment = {

        id: 'comment-' + Date.now(),

        authorId,

        text,

        date: new Date().toISOString()

    };

    task.comments.push(newComment);

    saveData(data);

    res.status(201).json(newComment);

});

module.exports = router;