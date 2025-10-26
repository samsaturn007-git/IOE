import React, { useState, useEffect } from 'react';
import './TodoList.css';
import config from '../config';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const TODOIST_TOKEN = config.TODOIST_API_TOKEN;

  useEffect(() => {
    // Initial load
    loadTasks();

    // Auto-refresh every 3 minutes
    const interval = setInterval(() => {
      loadTasks();
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadTasks = async () => {
    if (!TODOIST_TOKEN) {
      console.error('Todoist API token not configured');
      setError('Todoist not configured');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
        headers: {
          'Authorization': `Bearer ${TODOIST_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks from Todoist');
      }

      const todoistTasks = await response.json();
      
      // Convert Todoist format to our format
      const formattedTasks = todoistTasks.slice(0, 15).map(task => ({
        id: task.id,
        title: task.content,
        isCompleted: task.is_completed || false,
        importance: task.priority >= 3 ? 'high' : task.priority === 2 ? 'normal' : 'low',
        createdAt: new Date(task.created_at).getTime(),
        dueDate: task.due ? task.due.date : null
      }));

      // Sort: incomplete first, then by priority and date
      const sortedTasks = formattedTasks.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return priorityOrder[a.importance] - priorityOrder[b.importance];
      });

      setTasks(sortedTasks);
      setError(null);
      setLastSync(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Todoist error:', err);
      setError('Failed to sync with Todoist');
      setLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const response = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}/close`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TODOIST_TOKEN}`
        }
      });

      if (response.ok) {
        // Update local state immediately for responsiveness
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, isCompleted: true } : task
          )
        );
        // Reload after a short delay
        setTimeout(loadTasks, 1000);
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const getImportanceIcon = (importance) => {
    switch(importance) {
      case 'high': return '⭐';
      case 'normal': return '📌';
      case 'low': return '📝';
      default: return '📌';
    }
  };

  const formatSyncTime = () => {
    if (!lastSync) return '';
    const now = new Date();
    const diff = Math.floor((now - lastSync) / 1000); // seconds
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const incompleteTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  if (loading && tasks.length === 0) {
    return (
      <div className="todo-container todo-compact">
        <div className="todo-header">
          <h2 className="todo-title">📋 Tasks</h2>
        </div>
        <div className="todo-loading">Syncing...</div>
      </div>
    );
  }

  return (
    <div className="todo-container todo-compact">
      <div className="todo-header">
        <h2 className="todo-title">📋 Tasks</h2>
        <button 
          className="todo-refresh-btn" 
          onClick={loadTasks}
          disabled={loading}
          title="Refresh tasks"
        >
          {loading ? '⟳' : '🔄'}
        </button>
      </div>

      {error && (
        <div className="todo-error">
          ⚠️ {error}
        </div>
      )}

      {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="todo-empty">
          <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📝</div>
          <div style={{ fontSize: '0.85rem' }}>No tasks</div>
          <p className="todo-empty-hint">Add tasks in Todoist app</p>
        </div>
      ) : (
        <div className="todo-list">
          {/* Incomplete Tasks */}
          {incompleteTasks.map((task) => (
            <div key={task.id} className={`todo-item ${task.importance}`}>
              <div className="todo-checkbox">
                <input 
                  type="checkbox" 
                  checked={false}
                  onChange={() => toggleTask(task.id)}
                  className="todo-checkbox-input"
                />
              </div>
              <div className="todo-content">
                <span className="todo-importance">{getImportanceIcon(task.importance)}</span>
                <span className="todo-text">{task.title}</span>
              </div>
            </div>
          ))}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <>
              <div className="todo-divider"></div>
              {completedTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="todo-item completed">
                  <div className="todo-checkbox">
                    <input 
                      type="checkbox" 
                      checked={true}
                      readOnly
                      className="todo-checkbox-input"
                    />
                  </div>
                  <div className="todo-content">
                    <span className="todo-text">{task.title}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <div className="todo-footer">
        <span className="todo-count">
          {incompleteTasks.length} task{incompleteTasks.length !== 1 ? 's' : ''} remaining
        </span>
        <span className="todo-sync-status" title={lastSync ? lastSync.toLocaleTimeString() : ''}>
          ☁️ {formatSyncTime()}
        </span>
      </div>
    </div>
  );
};

export default TodoList;
