'use client';

import { useState } from 'react';
import { TodoItem } from '@/app/components/TodoItem';
import { TodoListType, TodoItemType } from '@/types';
import { Button, Card, Label, TextInput, Textarea, Modal } from 'flowbite-react';
import { HiArchive, HiTrash, HiPlus, HiExclamation } from 'react-icons/hi';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteClick = () => {
    // If the list has items, show confirmation dialog
    if (todoList.items && todoList.items.length > 0) {
      setShowDeleteModal(true);
    } else {
      // If the list is empty, delete without confirmation
      onDelete(todoList.id);
    }
  };

  const confirmDelete = () => {
    onDelete(todoList.id);
    setShowDeleteModal(false);
  };

  const generateFriendlyDateTime = () => {
    const now = new Date();
    
    // Format: "Todo - Monday, March 12 at 10:30:45 AM"
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    // Add a unique timestamp suffix to avoid duplicates
    const timestamp = now.getTime().toString().slice(-4);
    return `Todo - ${now.toLocaleDateString('en-US', options)} (${timestamp})`;
  };

  const handleStartAddingItem = () => {
    setNewItemTitle(generateFriendlyDateTime());
    setIsAddingItem(true);
  };

  return (
    <>
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{todoList.title}</h2>
          <div className="flex space-x-2">
            <Button
              color={todoList.isArchived ? "warning" : "yellow"}
              size="sm"
              onClick={() => onArchive(todoList.id)}
              className="flex items-center"
            >
              <HiArchive className="h-5 w-5 mr-2" />
              {todoList.isArchived ? 'Unarchive' : 'Archive'}
            </Button>
            <Button
              color="red"
              size="sm"
              onClick={handleDeleteClick}
              className="flex items-center"
            >
              <HiTrash className="h-5 w-5 mr-2" />
              Delete
            </Button>
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
              <Label htmlFor="newItemTitle" value="Item Title" />
              <TextInput
                id="newItemTitle"
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Item title"
                required
              />
            </div>
            <div>
              <Label htmlFor="newItemDescription" value="Description (optional)" />
              <Textarea
                id="newItemDescription"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="newItemDueDate" value="Due Date (optional)" />
              <TextInput
                id="newItemDueDate"
                type="datetime-local"
                value={newItemDueDate}
                onChange={(e) => setNewItemDueDate(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" color="blue">
                Add Item
              </Button>
              <Button color="gray" onClick={() => setIsAddingItem(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            color="gray"
            onClick={handleStartAddingItem}
            className="w-full flex items-center justify-center"
          >
            <HiPlus className="h-5 w-5 mr-2" />
            Add Item
          </Button>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiExclamation className="mx-auto mb-4 h-14 w-14 text-red-600" />
            <h3 className="mb-2 text-lg font-normal text-gray-900 dark:text-gray-400">
              Are you sure you want to delete this list?
            </h3>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              This list contains <span className="font-semibold">{todoList.items.length}</span> {todoList.items.length === 1 ? 'item' : 'items'} that will also be deleted.
            </p>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={confirmDelete}>
                Yes, delete it
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
} 