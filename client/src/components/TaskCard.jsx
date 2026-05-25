import { useState } from 'react';
import { styles } from '../styles/styles';

function TaskCard({ task, onClick, assignedUser, getPriorityColor, provided }) {
    // Local state to detect mouse hover
    const [isHovered, setIsHovered] = useState(false);

    const isOverdue = (endDate) => {
        if (!endDate) return false;
        const datePart = endDate.includes('T') ? endDate.split('T')[0] : endDate;
        const [year, month, day] = datePart.split('-');
        const targetDate = new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59);
        return targetDate < new Date();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString;
        const [year, month, day] = datePart.split('-');
        return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString();
    };

    const overdue = isOverdue(task.endDate);

    // We keep the library’s drag-and-drop animation,
   // and add our own hover animations (shadows and colours).
    const baseTransition = provided.draggableProps.style?.transition || '';
    const customTransition = 'box-shadow 0.2s ease, transform 0.2s ease, background-color 0.2s ease';
    const finalTransition = baseTransition ? `${baseTransition}, ${customTransition}` : customTransition;

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                ...styles.taskCard,
                
                borderLeft: `6px solid ${getPriorityColor(task.priority)}`,
                //We use `outline` instead of `border` so as not to override `borderLeft`
                outline: overdue ? '2px solid #e74c3c' : 'none',
                backgroundColor: overdue ? '#ffebee' : styles.taskCard.backgroundColor,
                
                // UX : Lift effect when flying over
                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: isHovered 
                    ? '0 8px 15px rgba(0,0,0,0.1)' 
                    : (overdue ? '0 2px 8px rgba(231, 76, 60, 0.3)' : styles.taskCard.boxShadow),
                
                transition: finalTransition,
                ...provided.draggableProps.style
            }}
            onClick={onClick}
        >
            <h4 style={{ margin: '0 0 10px 0', color: overdue ? '#c0392b' : 'inherit' }}>
                {task.title}
            </h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* UX:avatar  */}
                {assignedUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '50%', 
                            backgroundColor: '#2563eb', color: 'white', 
                            display: 'flex', justifyContent: 'center', alignItems: 'center', 
                            fontSize: '0.75rem', fontWeight: 'bold'
                        }}>
                            {assignedUser.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: overdue ? '#e74c3c' : '#888' }}>
                            {assignedUser.name}
                        </span>
                    </div>
                ) : (
                    <span style={{ fontSize: '0.85rem', color: '#ccc', fontStyle: 'italic' }}>Non assigné</span>
                )}
            </div>
            
            {task.endDate && (
                <div style={{ 
                    marginTop: '10px', padding: '4px 8px', borderRadius: '4px', display: 'inline-block',
                    backgroundColor: overdue ? '#fadbd8' : '#f1f5f9',
                    fontSize: '0.75rem', fontWeight: overdue ? 'bold' : 'normal', 
                    color: overdue ? '#c0392b' : '#64748b' 
                }}>
                    {overdue ? '⚠️ Late' : '📅'} : {formatDate(task.endDate)}
                </div>
            )}
        </div>
    );
}

export default TaskCard;