import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { useTaskFilters } from '../hooks/useTaskFilters';

export function TaskList() {
  const { tasks, reorderTasks } = useTasks();
  const { config } = useReality();
  const { filteredTasks } = useTaskFilters();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderTasks(items);
  };

  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      {incompleteTasks.length > 0 && (
        <div>
          <h2 className={`text-xl font-semibold mb-4 text-${config.theme.primary}-700`}>
            Active Tasks ({incompleteTasks.length})
          </h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  <AnimatePresence>
                    {incompleteTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? 'z-50' : ''}`}
                          >
                            <TaskCard task={task} index={index} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h2 className={`text-xl font-semibold mb-4 text-${config.theme.primary}-600`}>
            Completed Tasks ({completedTasks.length})
          </h2>
          <div className="space-y-3 opacity-75">
            <AnimatePresence>
              {completedTasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  index={incompleteTasks.length + index} 
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center py-12 ${config.theme.card} border-2 border-dashed rounded-lg`}
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className={`text-xl font-medium text-${config.theme.primary}-600 mb-2`}>
            No tasks yet
          </h3>
          <p className={`text-${config.theme.primary}-500`}>
            Create your first parallel reality task to get started!
          </p>
        </motion.div>
      )}
    </div>
  );
}
