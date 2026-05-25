const API_URL = 'http://localhost:5000/api';

export const registerUser = async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
};

export const loginUser = async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
};

export const fetchUsers = async () => (await fetch(`${API_URL}/auth/users`)).json();
export const fetchColumns = async () => (await fetch(`${API_URL}/columns`)).json();
export const fetchTasks = async () => (await fetch(`${API_URL}/tasks`)).json();
export const fetchUserTeams = async (userId) => (await fetch(`${API_URL}/teams/user/${userId}`)).json();

export const createColumn = async (data) => {
    const res = await fetch(`${API_URL}/columns`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
};
export const deleteColumn = async (id) => (await fetch(`${API_URL}/columns/${id}`, { method: 'DELETE' })).json();

export const createTask = async (data) => {
    const res = await fetch(`${API_URL}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
};
export const updateTask = async (id, data) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
};
export const deleteTask = async (id) => (await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })).json();

export const createTeam = async (data) => {
    const res = await fetch(`${API_URL}/teams`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
};


export const deleteTeam = async (id) => {
    const res = await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' });
    return res.json();
};

//  DRAG & DROP
export const moveTask = async (id, destinationColumnId, newPosition) => {
    const res = await fetch(`${API_URL}/tasks/${id}/move`, { 
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ destinationColumnId, newPosition }) 
    });
    return res.json();
};


export const moveColumn = async (id, newPosition) => {
    const res = await fetch(`${API_URL}/columns/${id}/move`, { 
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ newPosition }) 
    });
    return res.json();
};

// Team Invitation
export const addTeamMember = async (teamId, memberId) => {
    const res = await fetch(`${API_URL}/teams/${teamId}/add-member`, { 
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ memberId }) 
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
};

// Promote to admin
export const promoteToAdmin = async (teamId, memberId) => {
    const res = await fetch(`${API_URL}/teams/${teamId}/promote`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
    });
    return res.json();
};

// Rename team
export const updateTeam = async (id, data) => {
    const res = await fetch(`${API_URL}/teams/${id}`, { 
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) 
    });
    return res.json();
};

// Delete member
export const removeTeamMember = async (teamId, memberId) => {
    const res = await fetch(`${API_URL}/teams/${teamId}/remove-member`, { 
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberId }) 
    });
    return res.json();
};

// Rename a column
export const updateColumn = async (id, data) => {
    const res = await fetch(`${API_URL}/columns/${id}`, { 
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) 
    });
    return res.json();
};