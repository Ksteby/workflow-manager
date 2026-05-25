import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { styles } from '../styles/styles';

function BoardColumn({ index, column, users, tasks, onTaskClick, onAddTask, onDeleteColumn,onRenameColumn, getPriorityColor }) {
    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{ ...styles.column, ...provided.draggableProps.style }}
                >
                    {/* Column header (drag-and-drop area for the column) */}
                    <div style={styles.columnHeader} {...provided.dragHandleProps}>
                       <h3 
    style={{ margin: 0, padding: '10px', background: '#e2e8f0', borderRadius: '8px 8px 0 0', cursor: 'pointer' }}
    onClick={() => {
        const newTitle = prompt("New name of the column :", column.title);
        //If the user has entered a name and it is different from the old one
        if (newTitle && newTitle !== column.title) {
            onRenameColumn(column.id, newTitle); 
        }
    }}
    title="Cliquez pour renommer"
>
    {column.title}
</h3>
                        <button style={styles.btnIcon} onClick={() => onDeleteColumn(column.id)}>
                            🗑️
                        </button>
                    </div>

                    {/* Task Drop Zone */}
                    <Droppable droppableId={column.id} type="task">
                        {(providedTask) => (
                            <div
                                ref={providedTask.innerRef}
                                {...providedTask.droppableProps}
                                style={styles.tasksContainer}
                            >
                                {tasks.map((task, taskIndex) => {
                                    // Find the user assigned to this task
                                    const assignedUser = users.find(u => u.id === task.assigneeId);
                                    
                                    return (
                                        <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                            {(providedCard) => (
                                                <TaskCard
                                                    task={task}
                                                    onClick={() => onTaskClick(task)}
                                                    assignedUser={assignedUser}
                                                    getPriorityColor={getPriorityColor}
                                                    provided={providedCard}
                                                />
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {providedTask.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Bouton to add a task */}
                    <button style={styles.button} onClick={() => onAddTask(column.id)}>
                        + Add a task
                    </button>
                </div>
            )}
        </Draggable>
    );
}

export default BoardColumn;