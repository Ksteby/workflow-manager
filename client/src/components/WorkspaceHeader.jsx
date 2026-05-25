import { useState, useRef, useEffect } from 'react';
import { styles } from '../styles/styles';

function WorkspaceHeader({ user, teams = [], users = [], selectedTeam, setSelectedTeam, onCreateTeam, onDeleteTeam, onPromoteMember, onRemoveMember, onRenameTeam, onLogout, darkMode, setDarkMode }) {
    
    // Manage the menu's open status
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Privilege verification
    const isTeamAdmin = selectedTeam && (
        selectedTeam.ownerId === user.id || 
        (selectedTeam.admins && selectedTeam.admins.includes(user.id))
    );

    // UX : Close the menu if you click outside it
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        // Adds an event listener to the entire document
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={{ ...styles.header, background: darkMode ? '#1e293b' : '#2563eb', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                    <h2 style={{margin: 0}}>Workflow Manager</h2>
                    <p style={{marginTop: '5px', opacity: 0.8}}>Hey {user?.name}</p>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    
                    {/* Team Selector and Creation */}
                    <select 
                        style={{ padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                        value={selectedTeam?.id || "personal"}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "personal") setSelectedTeam(null);
                            else setSelectedTeam(teams.find(t => t.id === val));
                        }}
                    >
                        <option value="personal">🏠Personal Workspace</option>
                        {teams.map(t => <option key={t.id} value={t.id}>👥 {t.name}</option>)}
                    </select>

                    <button onClick={onCreateTeam} style={{...styles.button, background: '#10b981'}}>
                        + Team
                    </button>

                    {/* Drop-down menu container */}
                    <div ref={menuRef} style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            style={{...styles.button, background: 'rgba(255,255,255,0.2)'}}
                        >
                            ⚙️ Options
                        </button>

                        {/* The menu box (visible only if isMenuOpen is true) */}
                        {isMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '120%', 
                                background: darkMode ? '#334155' : 'white',
                                color: darkMode ? 'white' : '#334155',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                borderRadius: '12px',
                                padding: '15px',
                                width: '260px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                zIndex: 1000 // Ensures that the menu overlays the rest
                            }}>
                                
                                {/* Team section (if a team is selected) */}
                                {selectedTeam && (
                                    <>
                                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', fontWeight: 'bold' }}>
                                            Team management
                                        </div>
                                        
                                        <button 
                                            onClick={() => {
                                                const url = `${window.location.origin}${window.location.pathname}?invite=${selectedTeam.id}`;
                                                navigator.clipboard.writeText(url);
                                                alert("Invitation link copied !");
                                                setIsMenuOpen(false); // Close the menu after the action
                                            }} 
                                            style={{...styles.button, background: '#8e44ad', textAlign: 'left'}}
                                        >
                                            🔗 Invitation link
                                        </button>

                                        {isTeamAdmin && (
                                            <>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>👑 Appoint an admin :</div>
                                                <select 
                                                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                                                    defaultValue=""
                                                    onChange={async (e) => {
                                                        const val = e.target.value;
                                                        if (val) {
                                                            if (window.confirm("Appoint this member as an administrator ?")) {
                                                                await onPromoteMember(selectedTeam.id, Number(val));
                                                            }
                                                            e.target.value = "";
                                                            setIsMenuOpen(false);
                                                        }
                                                    }}
                                                >
                                                    <option value="">-- Choose a member --</option>
                                                    {users
                                                        .filter(u => selectedTeam.members.includes(u.id) && u.id !== user.id && !(selectedTeam.admins && selectedTeam.admins.includes(u.id)))
                                                        .map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                                                    }
                                                </select>

                                               
<button 
    onClick={async () => {
        const newName = prompt("New name of the team :", selectedTeam.name);
        if (newName && newName !== selectedTeam.name) {
            
            alert("Please refresh the page to see the new name.");
        }
        setIsMenuOpen(false);
    }} 
    style={{...styles.button, background: '#f39c12', textAlign: 'left'}}
>
    ✏️ Rename team
</button>

<div style={{ fontSize: '0.85rem', fontWeight: '500', marginTop: '10px' }}>👢 Expel a member :</div>
<select 
    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
    defaultValue=""
    onChange={async (e) => {
        const val = e.target.value;
        if (val) {
            if (window.confirm("Are you sure you want to remove this team member ?")) {
                
                if (typeof onRemoveMember === 'function') {
                    await onRemoveMember(selectedTeam.id, Number(val));
                }
            }
            e.target.value = "";
            setIsMenuOpen(false);
        }
    }}
>
    <option value="">-- Choose a member --</option>
    {users
        .filter(u => selectedTeam.members.includes(u.id) && u.id !== selectedTeam.ownerId)
        .map(u => <option key={u.id} value={u.id}>{u.name}</option>)
    }
</select>

                                                <button 
                                                    onClick={() => { onDeleteTeam(); setIsMenuOpen(false); }} 
                                                    style={{...styles.button, background: '#e74c3c', textAlign: 'left'}}
                                                >
                                                    🗑️ Delete team
                                                </button>
                                            </>
                                        )}
                                        <hr style={{ border: 'none', borderTop: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`, margin: '5px 0' }} />
                                    </>
                                )}

                                {/* General Preferences section */}
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', fontWeight: 'bold' }}>
                                    Préférences
                                </div>
                                
                                <button 
                                    onClick={() => { setDarkMode(!darkMode); setIsMenuOpen(false); }} 
                                    style={{...styles.button, background: darkMode ? '#475569' : '#f1f5f9', color: darkMode ? 'white' : '#111', textAlign: 'left'}}
                                >
                                    {darkMode ? '☀ Switch to Light mode' : '🌙 Switch to Dark Mode'}
                                </button>
                                
                                <button 
                                    onClick={() => { onLogout(); setIsMenuOpen(false); }} 
                                    style={{...styles.button, background: '#34495e', textAlign: 'left'}}
                                >
                                    🚪 Logout
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkspaceHeader;