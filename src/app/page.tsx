'use client';

import { useState, useEffect } from 'react';
import { TodoList } from './components/TodoList';
import { CreateTodoList } from './components/CreateTodoList';
import { TodoListType, TodoItemType } from '@/types';

export default function Home() {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  // Fetch todo lists
  const fetchTodoLists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todo-lists');
      if (!response.ok) {
        throw new Error('Failed to fetch todo lists');
      }
      const data = await response.json();
      console.log('📋 Fetched todo lists:', JSON.stringify(data, null, 2));
      setTodoLists(data);
      setError(null);
    } catch (err) {
      setError('Error loading todo lists. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoLists();
  }, []);

  // Create a new todo list
  const handleCreateList = async (title: string, description?: string) => {
    try {
      const response = await fetch('/api/todo-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Todoist</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your tasks and reminders</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {showArchived ? 'Show Active Lists' : 'Show Archived Lists'}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {showArchived ? 'Viewing archived lists' : 'Viewing active lists'}
          </span>
        </div>

        <CreateTodoList onCreateList={handleCreateList} />

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredTodoLists.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {showArchived
              ? 'No archived todo lists found.'
              : 'No active todo lists found. Create one to get started!'}
          </div>
        ) : (
          filteredTodoLists.map(todoList => (
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
          ))
        )}
      </div>
    </div>
  );
}
