import React, { useState, useEffect } from 'react';
import './TodoList.css';
import config from '../config';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncMethod, setSyncMethod] = useState('local'); // 'local', 'todoist', 'microsoft'
  const [showSettings, setShowSettings] = useState(false);
  const [todoistToken, setTodoistToken] = useState('');

  useEffect(() => {
    // Load sync method preference
    const savedMethod = localStorage.getItem('todoSyncMethod') || 'local';
    setSyncMethod(savedMethod);
    
    // Load tasks based on sync method
    loadTasks(savedMethod);

    // Auto-refresh for cloud services
    const interval = setInterval(() => {
      if (syncMethod === 'todoist' || syncMethod === 'microsoft') {
        loadTasks(syncMethod);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [syncMethod]);

  // LOCAL STORAGE METHODS
  const loadLocalTasks = () => {
    setLoading(true);
    try {
      const savedTasks = localStorage.getItem('localTodoTasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        // Initialize with sample tasks
        const initialTasks = [
          { id: '1', title: 'Try the local To-Do list', isCompleted: false, importance: 'high', createdAt: Date.now() },
          { id: '2', title: 'Click settings to sync with Todoist', isCompleted: false, importance: 'normal', createdAt: Date.now() },
          { id: '3', title: 'Add tasks by editing localStorage', isCompleted: false, importance: 'low', createdAt: Date.now() }
        ];
        setTasks(initialTasks);
        localStorage.setItem('localTodoTasks', JSON.stringify(initialTasks));
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load local tasks');
      setLoading(false);
    }
  };

  const saveLocalTasks = (newTasks) => {
    localStorage.setItem('localTodoTasks', JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const addLocalTask = (title, importance = 'normal') => {
    const newTask = {
      id: Date.now().toString(),
      title,
      isCompleted: false,
      importance,
      createdAt: Date.now()
    };
    const newTasks = [...tasks, newTask];
    saveLocalTasks(newTasks);
  };

  const toggleLocalTask = (taskId) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    saveLocalTasks(newTasks);
  };

  const deleteLocalTask = (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    saveLocalTasks(newTasks);
  };

  // TODOIST METHODS
  const loadTodoistTasks = async () => {
    setLoading(true);
    const token = localStorage.getItem('todoistApiToken');
    
    if (!token) {
      setError('Todoist API token not set');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Todoist tasks');
      }

      const todoistTasks = await response.json();
      
      // Convert Todoist format to our format
      const formattedTasks = todoistTasks.slice(0, 10).map(task => ({
        id: task.id,
        title: task.content,
        isCompleted: task.is_completed || false,
        importance: task.priority >= 3 ? 'high' : task.priority === 2 ? 'normal' : 'low',
        createdAt: new Date(task.created_at).getTime()
      }));

      setTasks(formattedTasks);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Todoist error:', err);
      setError('Failed to fetch Todoist tasks');
      setLoading(false);
      // Fallback to local
      loadLocalTasks();
    }
  };

  const toggleTodoistTask = async (taskId) => {
    const token = localStorage.getItem('todoistApiToken');
    if (!token) return;

    try {
      await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}/close`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      loadTodoistTasks();
    } catch (err) {
      console.error('Failed to toggle Todoist task:', err);
    }
  };

  // LOAD TASKS DISPATCHER
  const loadTasks = (method) => {
    switch(method) {
      case 'local':
        loadLocalTasks();
        break;
      case 'todoist':
        loadTodoistTasks();
        break;
      case 'microsoft':
        // Keep existing Microsoft implementation
        loadLocalTasks(); // Fallback for now
        break;
      default:
        loadLocalTasks();
    }
  };

  // SYNC METHOD SWITCHER
  const changeSyncMethod = (method) => {
    setSyncMethod(method);
    localStorage.setItem('todoSyncMethod', method);
    loadTasks(method);
    setShowSettings(false);
  };

  const saveTodoistToken = () => {
    if (todoistToken.trim()) {
      localStorage.setItem('todoistApiToken', todoistToken.trim());
      changeSyncMethod('todoist');
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

  const incompleteTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  if (loading) {
    return (
      <div className="todo-container">
        <div className="todo-header">
          <h2 className="todo-title">📋 My Tasks</h2>
        </div>
        <div className="todo-loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2 className="todo-title">📋 My Tasks</h2>
        <button 
          className="todo-auth-btn" 
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️ {syncMethod === 'local' ? 'Local' : syncMethod === 'todoist' ? 'Todoist' : 'Microsoft'}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="todo-settings">
          <h3 className="todo-settings-title">Sync Method</h3>
          
          <div className="todo-sync-option">
            <input
              type="radio"
              id="sync-local"
              name="sync"
              checked={syncMethod === 'local'}
              onChange={() => changeSyncMethod('local')}
            />
            <label htmlFor="sync-local">
              <strong>💾 Local Storage</strong>
              <span>No account needed, data stays on this device</span>
            </label>
          </div>

          <div className="todo-sync-option">
            <input
              type="radio"
              id="sync-todoist"
              name="sync"
              checked={syncMethod === 'todoist'}
              onChange={() => {}}
            />
            <label htmlFor="sync-todoist">
              <strong>✅ Todoist</strong>
              <span>Free & open API, sync across devices</span>
            </label>
            {syncMethod === 'todoist' || true ? (
              <div className="todo-token-input">
                <input
                  type="password"
                  placeholder="Enter Todoist API Token"
                  value={todoistToken}
                  onChange={(e) => setTodoistToken(e.target.value)}
                  className="todo-input"
                />
                <button onClick={saveTodoistToken} className="todo-save-btn">
                  Save
                </button>
                <a 
                  href="https://todoist.com/app/settings/integrations/developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="todo-help-link"
                >
                  Get Token
                </a>
              </div>
            ) : null}
          </div>

          <button className="todo-close-btn" onClick={() => setShowSettings(false)}>
            Close
          </button>
        </div>
      )}

      {error && (
        <div className="todo-error">
          ⚠️ {error}
        </div>
      )}

      {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="todo-empty">
          ✅ No tasks found!
          {syncMethod === 'local' && (
            <p className="todo-empty-hint">Tasks are stored locally on this device</p>
          )}
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
                  onChange={() => {
                    if (syncMethod === 'local') toggleLocalTask(task.id);
                    else if (syncMethod === 'todoist') toggleTodoistTask(task.id);
                  }}
                  className="todo-checkbox-input"
                />
              </div>
              <div className="todo-content">
                <span className="todo-importance">{getImportanceIcon(task.importance)}</span>
                <span className="todo-text">{task.title}</span>
              </div>
              {syncMethod === 'local' && (
                <button 
                  className="todo-delete-btn"
                  onClick={() => deleteLocalTask(task.id)}
                  title="Delete task"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <>
              <div className="todo-divider"></div>
              {completedTasks.slice(0, 2).map((task) => (
                <div key={task.id} className="todo-item completed">
                  <div className="todo-checkbox">
                    <input 
                      type="checkbox" 
                      checked={true}
                      onChange={() => {
                        if (syncMethod === 'local') toggleLocalTask(task.id);
                      }}
                      className="todo-checkbox-input"
                    />
                  </div>
                  <div className="todo-content">
                    <span className="todo-text">{task.title}</span>
                  </div>
                  {syncMethod === 'local' && (
                    <button 
                      className="todo-delete-btn"
                      onClick={() => deleteLocalTask(task.id)}
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  )}
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
        {syncMethod === 'local' && (
          <span className="todo-sync-status">💾 Local</span>
        )}
        {syncMethod === 'todoist' && (
          <span className="todo-sync-status">☁️ Synced</span>
        )}
      </div>
    </div>
  );
};

export default TodoList;
