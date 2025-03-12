'use client';

import { useState } from 'react';
import { TodoItem } from '@/app/components/TodoItem';
import { TodoListType, TodoItemType } from '@/types';
import { Button, Card, Label, TextInput, Textarea, Modal, Badge, Tooltip } from 'flowbite-react';
import { HiArchive, HiTrash, HiPlus, HiExclamation, HiCheck, HiClock } from 'react-icons/hi';

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
  const [expandedView, setExpandedView] = useState(false);

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

  // Calculate completion stats
  const completedItems = todoList.items.filter(item => item.isCompleted).length;
  const totalItems = todoList.items.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  // Get upcoming due items
  const now = new Date();
  const upcomingDueItems = todoList.items.filter(item => 
    !item.isCompleted && item.dueDate && new Date(item.dueDate) > now
  ).length;

  return (
    <>
      <Card className="h-full flex flex-col min-w-[300px] max-w-full">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold truncate max-w-[80%]">{todoList.title}</h2>
          <div className="flex space-x-1">
            <button
              onClick={() => onArchive(todoList.id)}
              className="p-1.5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              title={todoList.isArchived ? "Unarchive" : "Archive"}
            >
              <HiArchive className="h-4 w-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              title="Delete"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {todoList.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm line-clamp-2">{todoList.description}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Tooltip content={`${completedItems} of ${totalItems} items completed`}>
              <div className="flex items-center">
                <HiCheck className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
            </Tooltip>
          </div>
          
          {upcomingDueItems > 0 && (
            <Tooltip content={`${upcomingDueItems} upcoming due ${upcomingDueItems === 1 ? 'item' : 'items'}`}>
              <Badge color="yellow" className="flex items-center">
                <HiClock className="h-3 w-3 mr-1" />
                <span>{upcomingDueItems}</span>
              </Badge>
            </Tooltip>
          )}
          
          <Badge color={todoList.isArchived ? "purple" : "blue"}>
            {todoList.isArchived ? 'Archived' : `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
          </Badge>
        </div>
        
        <div className="mb-3 flex-grow overflow-hidden">
          {expandedView ? (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              {todoList.items.map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  onUpdate={onUpdateItem}
                  onDelete={onDeleteItem}
                  onAddReminder={onAddReminder}
                />
              ))}
              {todoList.items.length > 3 && (
                <Button 
                  color="light" 
                  size="xs" 
                  className="w-full mt-1"
                  onClick={() => setExpandedView(false)}
                >
                  Show less
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-hidden">
              {todoList.items.slice(0, 3).map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  onUpdate={onUpdateItem}
                  onDelete={onDeleteItem}
                  onAddReminder={onAddReminder}
                />
              ))}
              {todoList.items.length > 3 && (
                <Button 
                  color="light" 
                  size="xs" 
                  className="w-full mt-1"
                  onClick={() => setExpandedView(true)}
                >
                  Show {todoList.items.length - 3} more items
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          {isAddingItem ? (
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <Label htmlFor={`newItemTitle-${todoList.id}`} value="Item Title" />
                <TextInput
                  id={`newItemTitle-${todoList.id}`}
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`newItemDescription-${todoList.id}`} value="Description (optional)" />
                <Textarea
                  id={`newItemDescription-${todoList.id}`}
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor={`newItemDueDate-${todoList.id}`} value="Due Date (optional)" />
                <TextInput
                  id={`newItemDueDate-${todoList.id}`}
                  type="datetime-local"
                  value={newItemDueDate}
                  onChange={(e) => setNewItemDueDate(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" color="blue" size="sm">
                  Add Item
                </Button>
                <Button color="gray" size="sm" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button
              color="gray"
              size="sm"
              onClick={handleStartAddingItem}
              className="w-full flex items-center justify-center"
            >
              <HiPlus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )}
        </div>
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