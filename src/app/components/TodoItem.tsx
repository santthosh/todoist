'use client';

import React, { useState } from 'react';
import { TodoItemType } from '@/types';
import { Button, Checkbox, Label, TextInput, Textarea } from 'flowbite-react';
import { HiPencil, HiTrash, HiClock } from 'react-icons/hi';
import { formatDate } from '@/lib/utils';

interface TodoItemProps {
  item: TodoItemType;
  onUpdate: (id: string, data: Partial<TodoItemType>) => void;
  onDelete: (id: string) => void;
  onAddReminder: (todoItemId: string, reminderAt: string) => void;
}

export function TodoItem({ item, onUpdate, onDelete, onAddReminder }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [dueDate, setDueDate] = useState(item.dueDate || '');
  const [reminderDate, setReminderDate] = useState('');

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
    if (reminderDate) {
      onAddReminder(item.id, reminderDate);
      setReminderDate('');
      setIsAddingReminder(false);
    }
  };

  const isPastDue = item.dueDate && new Date(item.dueDate) < new Date();

  return (
    <div className={`p-2 rounded-lg border border-gray-200 dark:border-gray-700 ${item.isCompleted ? 'bg-gray-50 dark:bg-gray-800 opacity-70' : 'bg-white dark:bg-gray-700'}`}>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-2">
          <div>
            <Label htmlFor={`title-${item.id}`} value="Title" className="text-xs" />
            <TextInput
              id={`title-${item.id}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sizing="sm"
            />
          </div>
          <div>
            <Label htmlFor={`description-${item.id}`} value="Description (optional)" className="text-xs" />
            <Textarea
              id={`description-${item.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor={`dueDate-${item.id}`} value="Due Date (optional)" className="text-xs" />
            <TextInput
              id={`dueDate-${item.id}`}
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              sizing="sm"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" color="blue" size="xs">
              Save
            </Button>
            <Button color="gray" size="xs" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-grow min-w-0">
              <Checkbox
                checked={item.isCompleted}
                onChange={handleToggleComplete}
                className="mt-1 flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className={`font-medium truncate text-sm ${item.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                {item.dueDate && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center">
                    <span className="font-semibold mr-1">Due:</span> 
                    <span className={`truncate ${isPastDue ? 'text-red-500' : ''}`}>
                      {formatDate(item.dueDate)}
                    </span>
                  </p>
                )}
                
                {item.reminders && item.reminders.length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center">
                      <HiClock className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {item.reminders.length > 1 
                          ? `${item.reminders.length} reminders` 
                          : formatDate(item.reminders[0].reminderAt)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-1 flex-shrink-0 ml-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                title="Edit"
              >
                <HiPencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                title="Delete"
              >
                <HiTrash className="h-3.5 w-3.5" />
              </button>
              {(!item.reminders || item.reminders.length === 0) && (
                <button
                  onClick={() => setIsAddingReminder(true)}
                  className="p-1 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  title="Add Reminder"
                >
                  <HiClock className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          
          {isAddingReminder && (
            <form onSubmit={handleAddReminder} className="mt-3 space-y-2">
              <div>
                <Label htmlFor={`reminderDate-${item.id}`} value="Reminder Date & Time" className="text-xs" />
                <TextInput
                  id={`reminderDate-${item.id}`}
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                  sizing="sm"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" color="green" size="xs">
                  Set
                </Button>
                <Button color="gray" size="xs" onClick={() => setIsAddingReminder(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
} 