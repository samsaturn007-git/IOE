import React, { useState, useEffect } from 'react';
import './TodoList.css';
import config from '../config';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Microsoft Graph API configuration
  const CLIENT_ID = config.MS_TODO_CLIENT_ID;
  const REDIRECT_URI = window.location.origin;
  const SCOPES = config.MS_TODO_SCOPES;

  useEffect(() => {
    // Check if we have an access token in localStorage
    const accessToken = localStorage.getItem('msAccessToken');
    const tokenExpiry = localStorage.getItem('msTokenExpiry');
    
    if (accessToken && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
      setIsAuthenticated(true);
      fetchTasks(accessToken);
    } else {
      // Check for token in URL hash (OAuth redirect)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const token = hashParams.get('access_token');
      const expiresIn = hashParams.get('expires_in');
      
      if (token) {
        const expiryTime = new Date().getTime() + parseInt(expiresIn) * 1000;
        localStorage.setItem('msAccessToken', token);
        localStorage.setItem('msTokenExpiry', expiryTime.toString());
        setIsAuthenticated(true);
        window.history.replaceState({}, document.title, window.location.pathname);
        fetchTasks(token);
      } else {
        setLoading(false);
        // Load mock data for demonstration
        loadMockData();
      }
    }

    // Refresh tasks every 5 minutes
    const interval = setInterval(() => {
      const token = localStorage.getItem('msAccessToken');
      if (token) {
        fetchTasks(token);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadMockData = () => {
    // Mock data for demonstration
    setTasks([
      { id: '1', title: 'Morning workout', isCompleted: false, importance: 'high' },
      { id: '2', title: 'Review project proposal', isCompleted: false, importance: 'high' },
      { id: '3', title: 'Team meeting at 2 PM', isCompleted: false, importance: 'normal' },
      { id: '4', title: 'Buy groceries', isCompleted: false, importance: 'low' },
      { id: '5', title: 'Call dentist', isCompleted: true, importance: 'normal' }
    ]);
    setLoading(false);
  };

  const fetchTasks = async (accessToken) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch default task list
      const listsResponse = await fetch('https://graph.microsoft.com/v1.0/me/todo/lists', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!listsResponse.ok) {
        throw new Error('Failed to fetch task lists');
      }

      const listsData = await listsResponse.json();
      const defaultList = listsData.value.find(list => list.wellknownListName === 'defaultList') || listsData.value[0];

      if (defaultList) {
        // Fetch tasks from the default list
        const tasksResponse = await fetch(
          `https://graph.microsoft.com/v1.0/me/todo/lists/${defaultList.id}/tasks?$top=10&$orderby=importance desc,createdDateTime desc`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!tasksResponse.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const tasksData = await tasksResponse.json();
        setTasks(tasksData.value.map(task => ({
          id: task.id,
          title: task.title,
          isCompleted: task.status === 'completed',
          importance: task.importance
        })));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      setLoading(false);
      // Load mock data as fallback
      loadMockData();
    }
  };

  const handleLogin = () => {
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${CLIENT_ID}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SCOPES)}` +
      `&response_mode=fragment`;
    
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem('msAccessToken');
    localStorage.removeItem('msTokenExpiry');
    setIsAuthenticated(false);
    setTasks([]);
    loadMockData();
  };

  const getImportanceIcon = (importance) => {
    switch(importance) {
      case 'high': return '⭐';
      case 'normal': return '📌';
      case 'low': return '📝';
      default: return '📌';
    }
  };

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

  const incompleteTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2 className="todo-title">📋 My Tasks</h2>
        {!isAuthenticated ? (
          <button className="todo-auth-btn" onClick={handleLogin}>
            Connect Microsoft To-Do
          </button>
        ) : (
          <button className="todo-auth-btn todo-logout" onClick={handleLogout}>
            Disconnect
          </button>
        )}
      </div>

      {error && (
        <div className="todo-error">
          ⚠️ {error}
          <div className="todo-error-note">Showing demo data</div>
        </div>
      )}

      {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="todo-empty">
          ✅ No tasks found!
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
                  readOnly
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
              {completedTasks.slice(0, 2).map((task) => (
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
      </div>
    </div>
  );
};

export default TodoList;
