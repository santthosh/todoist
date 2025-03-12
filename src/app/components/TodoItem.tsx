'use client';

import { useState } from 'react';
import { TodoItemType } from '@/types';
import { Button, Card, Checkbox, Label, TextInput, Textarea } from 'flowbite-react';
import { HiPencil, HiTrash, HiPlus, HiClock } from 'react-icons/hi';

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

  const isPastDue = item.dueDate && new Date(item.dueDate) < new Date();

  return (
    <Card className={`mb-4 ${item.isCompleted ? 'opacity-60' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description" value="Description (optional)" />
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="dueDate" value="Due Date (optional)" />
            <TextInput
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" color="blue">
              Save
            </Button>
            <Button color="gray" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <Checkbox
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
                    <span className="font-semibold mr-1">Due:</span> 
                    <span className={isPastDue ? 'text-red-500' : ''}>
                      {formatDate(item.dueDate)}
                    </span>
                  </p>
                )}
                
                {item.reminders && item.reminders.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center">
                      <HiClock className="mr-1" />
                      Reminder{item.reminders.length > 1 ? 's' : ''}:
                    </p>
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
              <Button size="xs" color="blue" pill onClick={() => setIsEditing(true)}>
                <HiPencil className="mr-1" />
                Edit
              </Button>
              <Button size="xs" color="red" pill onClick={() => onDelete(item.id)}>
                <HiTrash className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          {!isAddingReminder ? (
            (() => {
              const hasNoReminders = !item.reminders || !Array.isArray(item.reminders) || item.reminders.length === 0;
               
              return hasNoReminders ? (
                <Button
                  size="xs"
                  color="green"
                  pill
                  className="mt-2"
                  onClick={() => setIsAddingReminder(true)}
                >
                  <HiPlus className="mr-1" />
                  Add Reminder
                </Button>
              ) : null;
            })()
          ) : (
            <form onSubmit={handleAddReminder} className="mt-3 space-y-3">
              <div>
                <Label htmlFor="reminderAt" value="Reminder Date & Time" />
                <TextInput
                  id="reminderAt"
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(e) => setReminderAt(e.target.value)}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" color="green" size="sm">
                  Set Reminder
                </Button>
                <Button color="gray" size="sm" onClick={() => setIsAddingReminder(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Card>
  );
} 