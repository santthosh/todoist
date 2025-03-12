'use client';

import { useState } from 'react';
import { TodoItemType } from '@/types';

interface TodoItemProps {
  item: TodoItemType;
  onUpdate: (id: string, data: Partial<TodoItemType>) => void;
  onDelete: (id: string) => void;
  onAddReminder: (todoItemId: string, reminderAt: string) => void;
}

export function TodoItem({ item, onUpdate, onDelete, onAddReminder }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [dueDate, setDueDate] = useState(item.dueDate || '');
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [reminderAt, setReminderAt] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(item.id, { title, description, dueDate });
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate(item.id, { isCompleted: !item.isCompleted });
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (reminderAt) {
      onAddReminder(item.id, reminderAt);
      setReminderAt('');
      setIsAddingReminder(false);
    }
  };

  const formatDate = (dateString?: string, isReminder = false) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleString(undefined, options);
  };

  return (
    <div className={`border-b pb-4 mb-4 ${item.isCompleted ? 'opacity-60' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Description (optional)"
            />
          </div>
          <div>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={item.isCompleted}
                onChange={handleToggleComplete}
                className="mt-1"
              />
              <div>
                <h3 className={`font-medium ${item.isCompleted ? 'line-through' : ''}`}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {item.description}
                  </p>
                )}
                {item.dueDate && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center">
                    <span className="font-semibold mr-1">Due Date:</span> 
                    <span className={`${new Date(item.dueDate) < new Date() ? 'text-red-500' : ''}`}>
                      {formatDate(item.dueDate)}
                    </span>
                  </p>
                )}
                
                {item.reminders && item.reminders.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Reminder{item.reminders.length > 1 ? 's' : ''}:</p>
                    <ul className="text-xs text-gray-500 dark:text-gray-400 ml-4 list-disc">
                      {item.reminders.map((reminder) => (
                        <li key={reminder.id}>{formatDate(reminder.reminderAt, true)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
          
          {!isAddingReminder ? (
            (() => {
              const hasNoReminders = !item.reminders || !Array.isArray(item.reminders) || item.reminders.length === 0;
               
              return hasNoReminders ? (
                <button
                  onClick={() => setIsAddingReminder(true)}
                  className="mt-2 text-sm text-green-500 hover:text-green-700 transition"
                >
                  + Add Reminder
                </button>
              ) : null;
            })()
          ) : (
            <form onSubmit={handleAddReminder} className="mt-3 space-y-3">
              <div>
                <input
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(e) => setReminderAt(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Set Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingReminder(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
} 