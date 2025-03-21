'use client';

import { useState, useEffect, useCallback } from 'react';
import { TodoList } from './components/TodoList';
import { CreateTodoList } from './components/CreateTodoList';
import { TodoListType, TodoItemType } from '@/types';
import { Button, Alert, Spinner, ButtonGroup } from 'flowbite-react';
import { HiArchive, HiInbox, HiPlus } from 'react-icons/hi';
import { getSessionId } from '@/lib/session';
import Image from 'next/image';

export default function Home() {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Get or create a session ID
    const sid = getSessionId();
    setSessionId(sid);
  }, []);

  // Wrap fetchTodoLists in useCallback
  const fetchTodoLists = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/todo-lists', {
        headers: {
          'x-session-id': sessionId
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch todo lists');
      }
      
      const data = await response.json();
      setTodoLists(data);
    } catch (err) {
      console.error('Error fetching todo lists:', err);
      setError('Failed to load todo lists. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchTodoLists();
    }
  }, [fetchTodoLists, sessionId]);

  // Create a new todo list
  const handleCreateList = async (title: string, description?: string) => {
    try {
      const response = await fetch('/api/todo-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo list');
      }

      fetchTodoLists();
    } catch (err) {
      setError('Error creating todo list. Please try again.');
      console.error(err);
    }
  };

  // Archive/unarchive a todo list
  const handleArchiveList = async (id: string) => {
    try {
      const todoList = todoLists.find(list => list.id === id);
      if (!todoList) return;

      const response = await fetch(`/api/todo-lists/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ isArchived: !todoList.isArchived }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo list');
      }

      fetchTodoLists();
    } catch (err) {
      setError('Error updating todo list. Please try again.');
      console.error(err);
    }
  };

  // Delete a todo list
  const handleDeleteList = async (id: string) => {
    try {
      const response = await fetch(`/api/todo-lists/${id}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo list');
      }

      fetchTodoLists();
    } catch (err) {
      setError('Error deleting todo list. Please try again.');
      console.error(err);
    }
  };

  // Add a todo item
  const handleAddItem = async (todoListId: string, title: string, description?: string, dueDate?: string) => {
    try {
      const response = await fetch('/api/todo-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ title, description, dueDate, todoListId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo item');
      }

      fetchTodoLists();
    } catch (err) {
      setError('Error creating todo item. Please try again.');
      console.error(err);
    }
  };

  // Update a todo item
  const handleUpdateItem = async (id: string, data: Partial<TodoItemType>) => {
    try {
      const response = await fetch(`/api/todo-items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo item');
      }

      fetchTodoLists();
    } catch (err) {
      setError('Error updating todo item. Please try again.');
      console.error(err);
    }
  };

  // Delete a todo item
  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/todo-items/${id}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo item');
      }

      fetchTodoLists();
    } catch (err) {
      setError('Error deleting todo item. Please try again.');
      console.error(err);
    }
  };

  // Add a reminder
  const handleAddReminder = async (todoItemId: string, reminderAt: string) => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ todoItemId, reminderAt }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reminder');
      }

      fetchTodoLists();
    } catch (err) {
      setError('Error creating reminder. Please try again.');
      console.error(err);
    }
  };

  // Filter todo lists based on archived status
  const filteredTodoLists = todoLists.filter(list => showArchived ? list.isArchived : !list.isArchived);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container-fluid mx-auto py-8 px-6">
        {error && (
          <Alert color="failure" className="mb-6 max-w-7xl mx-auto">
            {error}
          </Alert>
        )}

        <div className="mb-6 flex justify-between items-center max-w-7xl mx-auto">
          <Button
            color="blue"
            onClick={() => document.getElementById('createListBtn')?.click()}
            className="flex items-center"
          >
            <HiPlus className="h-4 w-4 mr-2" />
            New List
          </Button>
           
          <ButtonGroup>
            <Button
              color={!showArchived ? "blue" : "gray"}
              onClick={() => setShowArchived(false)}
            >
              <HiInbox className="h-4 w-4 mr-2" />
              Active
            </Button>
            <Button
              color={showArchived ? "blue" : "gray"}
              onClick={() => setShowArchived(true)}
            >
              <HiArchive className="h-4 w-4 mr-2" />
              Archived
            </Button>
          </ButtonGroup>
        </div>

        <div className="max-w-7xl mx-auto">
          <CreateTodoList onCreateList={handleCreateList} />
          
          {loading ? (
            <div className="flex justify-center my-12">
              <Spinner size="xl" />
            </div>
          ) : filteredTodoLists.length === 0 ? (
            <div className="text-center my-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex flex-col items-center justify-center">
                <Image 
                  src={showArchived ? "/empty-archive.svg" : "/empty-list.svg"} 
                  alt={showArchived ? "No archived lists" : "No active lists"} 
                  width={256}
                  height={256}
                  className="mb-4 opacity-80"
                  onError={(e) => {
                    // Fallback to a default SVG if the image fails to load
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDcwQzg0LjUgNzAgNzIgODIuNSA3MiA5OEM3MiAxMTMuNSA4NC41IDEyNiAxMDAgMTI2QzExNS41IDEyNiAxMjggMTEzLjUgMTI4IDk4QzEyOCA4Mi41IDExNS41IDcwIDEwMCA3MFpNMTAwIDExOEM4OS4xIDE1MCA3OS41IDExOCA3OS41IDk4Qzc5LjUgODYuNiA4OC42IDc3LjUgMTAwIDc3LjVDMTExLjQgNzcuNSAxMjAuNSA4Ni42IDEyMC41IDk4QzEyMC41IDEwOS40IDExMS40IDExOCAxMDAgMTE4WiIgZmlsbD0iIzZCNzI4MCIvPjxwYXRoIGQ9Ik0xMDAgODVDOTMuMSA4NSA4Ny41IDkwLjYgODcuNSA5Ny41Qzg3LjUgMTA0LjQgOTMuMSAxMTAgMTAwIDExMEMxMDYuOSAxMTAgMTEyLjUgMTA0LjQgMTEyLjUgOTcuNUMxMTIuNSA5MC42IDEwNi45IDg1IDEwMCA4NVoiIGZpbGw9IiM2QjcyODAiLz48cGF0aCBkPSJNMTQwIDUwSDYwQzU0LjUgNTAgNTAgNTQuNSA1MCA2MFYxNDBDNTAgMTQ1LjUgNTQuNSAxNTAgNjAgMTUwSDE0MEMxNDUuNSAxNTAgMTUwIDE0NS41IDE1MCAxNDBWNjBDMTUwIDU0LjUgMTQ1LjUgNTAgMTQwIDUwWk0xNDIuNSAxNDBDMTQyLjUgMTQxLjQgMTQxLjQgMTQyLjUgMTQwIDE0Mi41SDYwQzU4LjYgMTQyLjUgNTcuNSAxNDEuNCA1Ny41IDE0MFY2MEM1Ny41IDU4LjYgNTguNiA1Ny41IDYwIDU3LjVIMTQwQzE0MS40IDU3LjUgMTQyLjUgNTguNiAxNDIuNSA2MFYxNDBaIiBmaWxsPSIjNkI3MjgwIi8+PC9zdmc+"
                  }}
                />
                <h3 className="text-xl font-semibold mb-2">
                  {showArchived ? 'No archived lists' : 'No todo lists yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {showArchived 
                    ? 'You don\'t have any archived lists.' 
                    : 'Click the "New List" button to create your first todo list.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTodoLists.map((todoList) => (
                <TodoList
                  key={todoList.id}
                  todoList={todoList}
                  onArchive={handleArchiveList}
                  onDelete={handleDeleteList}
                  onAddItem={handleAddItem}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onAddReminder={handleAddReminder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
