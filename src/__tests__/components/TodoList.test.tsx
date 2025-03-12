import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { TodoList } from '@/app/components/TodoList';
import { TodoListType } from '@/types';

describe('TodoList Component', () => {
  const mockOnArchive = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnAddItem = jest.fn();
  const mockOnUpdateItem = jest.fn();
  const mockOnDeleteItem = jest.fn();
  const mockOnAddReminder = jest.fn();
  
  const mockTodoList: TodoListType = {
    id: 'list-1',
    title: 'Test List',
    description: 'Test List Description',
    createdAt: '2023-01-01T12:00:00.000Z',
    updatedAt: '2023-01-01T12:00:00.000Z',
    isArchived: false,
    items: [
      {
        id: 'item-1',
        title: 'Test Item 1',
        description: 'Test Item Description',
        isCompleted: false,
        dueDate: '2023-12-31T12:00:00.000Z',
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z',
        todoListId: 'list-1',
        reminders: []
      }
    ]
  };

  beforeEach(() => {
    mockOnArchive.mockClear();
    mockOnDelete.mockClear();
    mockOnAddItem.mockClear();
    mockOnUpdateItem.mockClear();
    mockOnDeleteItem.mockClear();
    mockOnAddReminder.mockClear();
  });

  it('renders the todo list with correct information', () => {
    render(
      <TodoList 
        todoList={mockTodoList}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
        onAddItem={mockOnAddItem}
        onUpdateItem={mockOnUpdateItem}
        onDeleteItem={mockOnDeleteItem}
        onAddReminder={mockOnAddReminder}
      />
    );
    
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('Test List Description')).toBeInTheDocument();
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
    
    // Find the header section and look for the Delete button within it
    const header = screen.getByText('Test List').closest('div');
    expect(within(header).getByText('Delete')).toBeInTheDocument();
    
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('calls onArchive when archive button is clicked', () => {
    render(
      <TodoList 
        todoList={mockTodoList}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
        onAddItem={mockOnAddItem}
        onUpdateItem={mockOnUpdateItem}
        onDeleteItem={mockOnDeleteItem}
        onAddReminder={mockOnAddReminder}
      />
    );
    
    fireEvent.click(screen.getByText('Archive'));
    
    expect(mockOnArchive).toHaveBeenCalledTimes(1);
    expect(mockOnArchive).toHaveBeenCalledWith('list-1');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoList 
        todoList={mockTodoList}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
        onAddItem={mockOnAddItem}
        onUpdateItem={mockOnUpdateItem}
        onDeleteItem={mockOnDeleteItem}
        onAddReminder={mockOnAddReminder}
      />
    );
    
    // Find the header section and click the Delete button within it
    const header = screen.getByText('Test List').closest('div');
    fireEvent.click(within(header).getByText('Delete'));
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('list-1');
  });

  it('shows add item form when add item button is clicked', () => {
    render(
      <TodoList 
        todoList={mockTodoList}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
        onAddItem={mockOnAddItem}
        onUpdateItem={mockOnUpdateItem}
        onDeleteItem={mockOnDeleteItem}
        onAddReminder={mockOnAddReminder}
      />
    );
    
    fireEvent.click(screen.getByText('Add Item'));
    
    expect(screen.getByLabelText('Item Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onAddItem when add item form is submitted', () => {
    render(
      <TodoList 
        todoList={mockTodoList}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
        onAddItem={mockOnAddItem}
        onUpdateItem={mockOnUpdateItem}
        onDeleteItem={mockOnDeleteItem}
        onAddReminder={mockOnAddReminder}
      />
    );
    
    fireEvent.click(screen.getByText('Add Item'));
    
    fireEvent.change(screen.getByLabelText('Item Title'), { 
      target: { value: 'New Item' } 
    });
    fireEvent.change(screen.getByLabelText('Description (optional)'), { 
      target: { value: 'New Item Description' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Add Item' }));
    
    expect(mockOnAddItem).toHaveBeenCalledTimes(1);
    expect(mockOnAddItem).toHaveBeenCalledWith(
      'list-1', 
      'New Item', 
      'New Item Description', 
      ''
    );
  });

  it('renders archived list with unarchive button', () => {
    const archivedList = {
      ...mockTodoList,
      isArchived: true
    };
    
    render(
      <TodoList 
        todoList={archivedList}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
        onAddItem={mockOnAddItem}
        onUpdateItem={mockOnUpdateItem}
        onDeleteItem={mockOnDeleteItem}
        onAddReminder={mockOnAddReminder}
      />
    );
    
    expect(screen.getByText('Unarchive')).toBeInTheDocument();
  });
}); 