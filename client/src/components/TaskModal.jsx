import { useState } from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles/styles';

function TaskModal({ task, setSelectedTask, handleUpdateTask, handleDeleteTask, users = [], user, selectedTeam }) {
    const [newComment, setNewComment] = useState("");

    if (!task) return null;

    // Calculation of applicable roles and privileges
    const isPersonalSpace = !selectedTeam;
    const isTeamAdmin = selectedTeam && (
        selectedTeam.ownerId === user.id || 
        (selectedTeam.admins && selectedTeam.admins.includes(user.id))
    );
    const isAssignee = task.assigneeId === user.id;
    
    // If you are neither an admin nor a designated user, you are in "Read-only" mode
    const canEdit = isPersonalSpace || isTeamAdmin || isAssignee;

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            text: newComment,
            authorId: user.id,
            date: new Date().toISOString()
        };
        
        // We update the task with the new comment
        const updatedTask = { 
            ...task, 
            comments: [...(task.comments || []), comment] 
        };
        setSelectedTask(updatedTask);
        handleUpdateTask(updatedTask);
        setNewComment("");
    };

    return (
        <div style={styles.modalOverlay}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{...styles.modal, maxHeight: '90vh', overflowY: 'auto'}}>
                
                {!canEdit && (
                    <div style={{ background: '#fef3c7', color: '#92400e', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' }}>
                        🔒 <strong> Read-OnlyMode :</strong> You must be assigned to this task or be an administrator to edit it.
                    </div>
                )}

                <div style={styles.modalField}>
                    <label>Title</label>
                    <input type="text" style={styles.input} value={task.title} disabled={!canEdit} onChange={(e) => setSelectedTask({ ...task, title: e.target.value })} />
                </div>

                <div style={styles.modalField}>
                    <label>Description</label>
                    <textarea rows="3" style={styles.input} value={task.description || ''} disabled={!canEdit} onChange={(e) => setSelectedTask({ ...task, description: e.target.value })} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{...styles.modalField, flex: 1}}>
                        <label>Start</label>
                        <input type="date" style={styles.input} value={task.startDate || ''} disabled={!canEdit} onChange={(e) => setSelectedTask({ ...task, startDate: e.target.value })} />
                    </div>
                    <div style={{...styles.modalField, flex: 1}}>
                        <label>End</label>
                        <input type="date" style={styles.input} value={task.endDate || ''} disabled={!canEdit} onChange={(e) => setSelectedTask({ ...task, endDate: e.target.value })} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{...styles.modalField, flex: 1}}>
                        <label>Priority</label>
                        <select style={styles.input} value={task.priority || 'Medium'} disabled={!canEdit} onChange={(e) => setSelectedTask({ ...task, priority: e.target.value })}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {selectedTeam && (
                        <div style={{...styles.modalField, flex: 1}}>
                            <label>Assigned to</label>
                            {isTeamAdmin ? (
                                <select style={styles.input} value={task.assigneeId || ''} onChange={(e) => setSelectedTask({ ...task, assigneeId: e.target.value ? Number(e.target.value) : null })}>
                                    <option value="">Nobody</option>
                                    {users.filter(u => selectedTeam.members.includes(u.id)).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            ) : (
                                <input type="text" style={styles.input} disabled value={users.find(u => u.id === task.assigneeId)?.name || 'Personne'} />
                            )}
                        </div>
                    )}
                </div>

                {/* =========================================
                     COMMENTS  SECTION (TEAM)
                    ========================================= */}
                {selectedTeam && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}>💬 Comments</h4>
                        
                        <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(task.comments || []).length === 0 ? (
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No comments yet. Be the first!</span>
                            ) : (
                                task.comments.map(comment => {
                                    const author = users.find(u => u.id === comment.authorId);
                                    return (
                                        <div key={comment.id} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <strong style={{ color: '#0369a1' }}>{author ? author.name : 'Utilisateur inconnu'}</strong>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(comment.date).toLocaleDateString()} {new Date(comment.date).getHours()}h{String(new Date(comment.date).getMinutes()).padStart(2, '0')}</span>
                                            </div>
                                            <div style={{ color: '#334155' }}>{comment.text}</div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                                type="text" 
                                style={{ ...styles.input, marginBottom: 0 }} 
                                placeholder="Write an comment ..." 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <button onClick={handleAddComment} style={{ ...styles.button, background: '#2563eb', margin: 0, padding: '0 15px' }}>
                                send
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ ...styles.modalActions, marginTop: '20px' }}>
                    {/* The save button is only displayed if the task can be edited*/}
                    {canEdit && (
                        <button style={styles.saveBtn} onClick={() => handleUpdateTask(task)}>Sauvegarder</button>
                    )}
                    
                    {canEdit && (
                        <button style={styles.deleteBtn} onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
                    )}
                    
                    <button style={styles.closeBtn} onClick={() => setSelectedTask(null)}>Fermer</button>
                </div>
            </motion.div>
        </div>
    );
}

export default TaskModal;