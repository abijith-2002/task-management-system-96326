import React, { useMemo, useState, useCallback } from 'react';
import '../styles/common.css';
import '../styles/Todo.css';

/**
 * PUBLIC_INTERFACE
 * TodoList
 * This component renders the Figma-accurate Todo screen and implements core todo functionality:
 * - List todos with styled cards
 * - Toggle complete/incomplete with accessible checkbox
 * - Add new todos via floating action button (FAB)
 * - Edit todo title (double-click title to edit, Enter to save, Esc to cancel, blur to save)
 * - Delete todo using the right-side action square
 *
 * Accessibility:
 * - Checkboxes use role="checkbox" with proper aria-checked handling and keyboard support (Space/Enter)
 * - Static heading and dynamic counts are announced via text content
 */
function TodoList() {
  // Initialize with the three tasks from the Figma example (second is completed)
  const [todos, setTodos] = useState([
    { id: 1, title: 'Implement Figma design', completed: false, editing: false },
    { id: 2, title: 'Add SVG icons', completed: true, editing: false },
    { id: 3, title: 'Test the UI', completed: false, editing: false },
  ]);

  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);

  const toggleComplete = useCallback((id) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const startEditing = useCallback((id) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, editing: true } : t))
    );
  }, []);

  const saveTitle = useCallback((id, newTitle) => {
    setTodos(prev => {
      const trimmed = newTitle.trim();
      if (trimmed.length === 0) {
        // Remove the task if title is empty on save
        return prev.filter(t => t.id !== id);
      }
      return prev.map(t => (t.id === id ? { ...t, title: trimmed, editing: false } : t));
    });
  }, []);

  const cancelEditing = useCallback((id) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, editing: false } : t))
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const addTodo = useCallback(() => {
    setTodos(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(t => t.id)) + 1 : 1;
      const newTodo = { id: nextId, title: 'New Task', completed: false, editing: true };
      return [...prev, newTodo];
    });
  }, []);

  // Compute top positions to match Figma vertical spacing (303, 521, 739 => +218 each)
  const topForIndex = (index) => 303 + index * 218;

  return (
    <main className="screen-todo" role="main" aria-label="Todo Screen">
      {/* Header */}
      <header className="todo-header">
        <h1 className="todo-title typo-4">Tasks</h1>
        <div className="todo-subtitle typo-5">
          <span aria-live="polite" id="completedCount">{completedCount}</span>
          <span>of</span>
          <span aria-live="polite" id="totalCount">{todos.length}</span>
          <span>completed</span>
        </div>
      </header>

      {/* Task items */}
      {todos.map((todo, index) => {
        const top = topForIndex(index);
        const checkboxClass = `checkbox${todo.completed ? ' checked' : ''}`;

        return (
          <article
            key={todo.id}
            className="task-card"
            data-task
            style={{ left: 380, top }}
            aria-label={`Task ${index + 1}: ${todo.title}`}
          >
            {/* Accessible checkbox */}
            <button
              className={checkboxClass}
              role="checkbox"
              aria-checked={todo.completed ? 'true' : 'false'}
              aria-label="Toggle task completion"
              onClick={() => toggleComplete(todo.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleComplete(todo.id);
                }
              }}
            />

            {/* Title or input depending on editing state */}
            {todo.editing ? (
              <input
                autoFocus
                className="task-input typo-6"
                defaultValue={todo.title}
                onBlur={(e) => saveTitle(todo.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveTitle(todo.id, e.currentTarget.value);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEditing(todo.id);
                  }
                }}
              />
            ) : (
              <h2
                className="task-title typo-6"
                title="Double-click to edit"
                onDoubleClick={() => startEditing(todo.id)}
              >
                {todo.title}
              </h2>
            )}

            {/* Right-side action box - use for delete */}
            <button
              className="task-action"
              aria-label="Delete task"
              title="Delete task"
              onClick={() => deleteTodo(todo.id)}
            />
          </article>
        );
      })}

      {/* Add Button (FAB) */}
      <button className="fab-add" aria-label="Add new task" onClick={addTodo}>
        <span className="plus" aria-hidden="true" />
      </button>
    </main>
  );
}

export default TodoList;
