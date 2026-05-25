const express = require('express');
const cors = require('cors');

// 1. IMPORT ALL ROUTES
const authRoutes = require('./routes/authRoutes');
const columnRoutes = require('./routes/columnRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| ROUTES 
|--------------------------------------------------------------------------
*/
app.use('/api/auth', authRoutes);
app.use('/api/columns', columnRoutes);  
app.use('/api/tasks', taskRoutes);      
app.use('/api/teams', teamRoutes);      

/*
|--------------------------------------------------------------------------
| TEST ROUTE
|--------------------------------------------------------------------------
*/
app.get('/', (req, res) => {
    res.send('API WORKING');
});

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});