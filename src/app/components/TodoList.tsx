'use client';

import { useState } from 'react';
import { TodoItem } from './TodoItem';
import { TodoListType, TodoItemType } from '@/types';

interface TodoListProps {
  todoList: TodoListType;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onAddItem: (todoListId: string, title: string, description?: string, dueDate?: string) => void;
  onUpdateItem: (id: string, data: Partial<TodoItemType>) => void;
  onDeleteItem: (id: string) => void;
  onAddReminder: (todoItemId: string, reminderAt: string) => void;
}

export function TodoList({
  todoList,
  onArchive,
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddReminder,
}: TodoListProps) {
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemDueDate, setNewItemDueDate] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemTitle.trim()) {
      onAddItem(todoList.id, newItemTitle, newItemDescription, newItemDueDate);
      setNewItemTitle('');
      setNewItemDescription('');
      setNewItemDueDate('');
      setIsAddingItem(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{todoList.title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onArchive(todoList.id)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            {todoList.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={() => onDelete(todoList.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
      
      {todoList.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">{todoList.description}</p>
      )}
      
      <div className="mb-6">
        {todoList.items.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onUpdate={onUpdateItem}
            onDelete={onDeleteItem}
            onAddReminder={onAddReminder}
          />
        ))}
      </div>
      
      {isAddingItem ? (
        <form onSubmit={handleAddItem} className="space-y-3">
          <div>
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Item title"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <textarea
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <input
              type="datetime-local"
              value={newItemDueDate}
              onChange={(e) => setNewItemDueDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingItem(true)}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-center transition"
        >
          + Add Item
        </button>
      )}
    </div>
  );
} 