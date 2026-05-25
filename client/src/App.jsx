import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import AuthForm from './components/AuthForm';
import WorkspaceHeader from './components/WorkspaceHeader';
import BoardColumn from './components/BoardColumn';
import TaskModal from './components/TaskModal';
import { styles } from './styles/styles';
import { showSuccess, showError } from './utils/toast';

import {
    fetchTasks, fetchColumns, fetchUsers, fetchUserTeams,
    createTask, updateTask, deleteTask,
    createColumn, updateColumn, deleteColumn, createTeam, deleteTeam,
    moveTask, moveColumn, addTeamMember, promoteToAdmin,removeTeamMember, updateTeam
} from './utils/api';

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem("flowUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState([]);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    const activeWorkspaceId = selectedTeam ? selectedTeam.id : (user ? `workspace-${user.id}` : null);

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light";
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    
    const loadData = async () => {
        if (!user || !user.id) return;
        try {
            const [t, c, u, tm] = await Promise.all([
                fetchTasks(), fetchColumns(), fetchUsers(), fetchUserTeams(user.id)
            ]);
            setTasks(t);
            setColumns(c);
            setUsers(u);
            setTeams(tm);
            return { tm };
        } catch (error) {
            console.error("Erreur chargement:", error);
        }
    };

    // INIT AND REAL-TIME
    useEffect(() => {
        if (user) {
            const init = async () => {
                const dataObj = await loadData();
                
                // AUTO-SELECTION : If the user has just logged in via AuthForm
                if (dataObj && dataObj.tm && user.joinedTeamId) {
                    const targetTeam = dataObj.tm.find(t => t.id === user.joinedTeamId);
                    if (targetTeam) setSelectedTeam(targetTeam);

                    //We clear the session so that it no longer forces the selection on subsequent refreshes
                    const updatedUser = { ...user };
                    delete updatedUser.joinedTeamId;
                    setUser(updatedUser);
                    sessionStorage.setItem("flowUser", JSON.stringify(updatedUser));
                }
            };
            init();

            const interval = setInterval(loadData, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // =========================================================
    // We update "selectedTeam" silently if its data changes in the background
    // =========================================================
    useEffect(() => {
        if (selectedTeam && teams.length > 0) {
            const freshTeam = teams.find(t => t.id === selectedTeam.id);
            // If the team has any new members or admins, we’ll make sure it’s updated!
            if (freshTeam && JSON.stringify(freshTeam) !== JSON.stringify(selectedTeam)) {
                setSelectedTeam(freshTeam);
            }
        }
    }, [teams]); 

    // MANAGING CLICKS ON INVITATION LINKS (IF ALREADY LOGGED IN)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const inviteTeamId = params.get('invite');

        if (inviteTeamId) {
            window.history.replaceState({}, document.title, window.location.pathname);
            
            if (user) {
                addTeamMember(inviteTeamId, user.id)
                    .then(() => {
                        showSuccess("You have been added to the team!");
                        loadData().then(({ tm }) => {
                            const targetTeam = tm.find(t => t.id === inviteTeamId);
                            if (targetTeam) setSelectedTeam(targetTeam);
                        });
                    })
                    .catch(() => {});
            } else {
                sessionStorage.setItem("pendingInvite", inviteTeamId);
            }
        }
    }, [user]);

    

    const getPriorityColor = (priority) => {
        if (priority === 'High') return '#e74c3c';
        if (priority === 'Medium') return '#f39c12';
        return '#2ecc71';
    };

    const handleAddTask = async (columnId) => {
        const title = prompt('Title of the task :');
        if (!title) return;
        await createTask({ title, columnId, workspaceId: activeWorkspaceId, createdBy: user.id });
        loadData();
    };

    const handleSaveTask = async (task) => {
        await updateTask(task.id, task);
        setSelectedTask(null);
        loadData();
    };

    const handleDeleteTask = async (taskId) => {
        await deleteTask(taskId);
        setSelectedTask(null);
        loadData();
    };

    const handleAddColumn = async () => {
        const title = prompt('Name of the column:');
        if (!title) return;
        await createColumn({ title, workspaceId: activeWorkspaceId });
        loadData();
    };

    const handleDeleteColumn = async (columnId) => {
        if(window.confirm("Delete this column and all its tasks?")) {
            await deleteColumn(columnId);
            loadData();
        }
    };

    const handleDeleteTeam = async () => {
        if(window.confirm("Are you sure you want to delete this team?")) {
            await deleteTeam(selectedTeam.id);
            setSelectedTeam(null);
            loadData();
            showSuccess("Team deleted !");
        }
    };

    const handleRenameColumn = async (columnId, newTitle) => {
        await updateColumn(columnId, { title: newTitle });
        loadData(); // The screen is refreshed immediately
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

        if (type === "column") {
            await moveColumn(draggableId, destination.index);
        } else {
            await moveTask(draggableId, destination.droppableId, destination.index);
        }
        loadData();
    };

    if (!user) return <AuthForm onLogin={setUser} />;

    return (
        <div style={styles.app}>
            <WorkspaceHeader
                user={user}
                teams={teams}
                users={users}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                onCreateTeam={async () => {
                    const name = prompt('Name of the team:');
                    if(name) { 
                        const newTeam = await createTeam({name, ownerId: user.id}); 
                        await loadData(); 
                        setSelectedTeam(newTeam);
                    }
                }}
                onDeleteTeam={handleDeleteTeam}
                onPromoteMember={async (teamId, memberId) => {
                    try {
                        await promoteToAdmin(teamId, memberId);
                        const data = await loadData();
                        if (data && data.tm) {
                            const updated = data.tm.find(t => t.id === teamId);
                            if (updated) setSelectedTeam(updated);
                        }
                    } catch (err) {
                        showError("Error promotion.");
                    }
                }}

                onRemoveMember={async (teamId, memberId) => {
        try {
            await removeTeamMember(teamId, memberId);
            showSuccess("Membre retiré de l'équipe.");
            const dataObj = await loadData();
            if (dataObj && dataObj.tm) {
                const updated = dataObj.tm.find(t => t.id === teamId);
                if (updated) setSelectedTeam(updated);
            }
        } catch (err) {
            showError("Error during eviction.");
        }
    }}
    onRenameTeam={async (teamId, newName) => {
        try {
            await updateTeam(teamId, { name: newName });
            showSuccess("team renamed !");
            const dataObj = await loadData();
            if (dataObj && dataObj.tm) {
                const updated = dataObj.tm.find(t => t.id === teamId);
                if (updated) setSelectedTeam(updated);
            }
        } catch(err) {
            showError("Error during rename.");
        }
    }}

                onLogout={() => { setUser(null); sessionStorage.removeItem("flowUser"); }}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="board" direction="horizontal" type="column">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} style={styles.board}>
                            {columns.filter(c => c.workspaceId === activeWorkspaceId)
                                    .sort((a,b) => a.position - b.position)
                                    .map((column, index) => (
                                <BoardColumn
                                    key={column.id}
                                    index={index}
                                    column={column}
                                    users={users}
                                    tasks={tasks.filter(t => t.columnId === column.id).sort((a,b) => a.position - b.position)}
                                    onTaskClick={setSelectedTask}
                                    onAddTask={handleAddTask}
                                    onDeleteColumn={handleDeleteColumn}
                                    onRenameColumn={handleRenameColumn}
                                    getPriorityColor={getPriorityColor}
                                />
                            ))}
                            {provided.placeholder}
                            <button style={{...styles.button, height: '50px', minWidth: '200px'}} onClick={handleAddColumn}>+ Ajouter colonne</button>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    users={users}
                    user={user}
                    selectedTeam={selectedTeam}
                    setSelectedTask={setSelectedTask}
                    handleUpdateTask={handleSaveTask}
                    handleDeleteTask={handleDeleteTask}
                />
            )}
            <ToastContainer />
        </div>
    );
}

export default App;