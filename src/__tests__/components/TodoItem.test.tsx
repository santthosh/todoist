import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '@/app/components/TodoItem';
import { TodoItemType } from '@/types';

describe('TodoItem Component', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnAddReminder = jest.fn();
  
  const mockItem: TodoItemType = {
    id: '1',
    title: 'Test Item',
    description: 'Test Description',
    isCompleted: false,
    dueDate: '2023-12-31T12:00:00.000Z',
    createdAt: '2023-01-01T12:00:00.000Z',
    updatedAt: '2023-01-01T12:00:00.000Z',
    todoListId: 'list-1',
    reminders: []
  };

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnDelete.mockClear();
    mockOnAddReminder.mockClear();
  });

  it('renders the todo item with correct information', () => {
    render(
      <TodoItem 
        item={mockItem} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
        onAddReminder={mockOnAddReminder} 
      />
    );
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Due Date:')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('+ Add Reminder')).toBeInTheDocument();
  });

  it('calls onUpdate when checkbox is clicked', () => {
    render(
      <TodoItem 
        item={mockItem} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
        onAddReminder={mockOnAddReminder} 
      />
    );
    
    fireEvent.click(screen.getByRole('checkbox'));
    
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith('1', { isCompleted: true });
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem 
        item={mockItem} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
        onAddReminder={mockOnAddReminder} 
      />
    );
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('shows edit form when edit button is clicked', () => {
    render(
      <TodoItem 
        item={mockItem} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
        onAddReminder={mockOnAddReminder} 
      />
    );
    
    fireEvent.click(screen.getByText('Edit'));
    
    // Check if form inputs are displayed with correct values
    const titleInput = screen.getByDisplayValue('Test Item');
    const descriptionInput = screen.getByDisplayValue('Test Description');
    
    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('updates item when edit form is submitted', () => {
    render(
      <TodoItem 
        item={mockItem} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
        onAddReminder={mockOnAddReminder} 
      />
    );
    
    // Open edit form
    fireEvent.click(screen.getByText('Edit'));
    
    // Change values
    const titleInput = screen.getByDisplayValue('Test Item');
    const descriptionInput = screen.getByDisplayValue('Test Description');
    
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith('1', { 
      title: 'Updated Title', 
      description: 'Updated Description',
      dueDate: '2023-12-31T12:00:00.000Z'
    });
  });

  it('shows reminder form when add reminder button is clicked', () => {
    render(
      <TodoItem 
        item={mockItem} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
        onAddReminder={mockOnAddReminder} 
      />
    );
    
    fireEvent.click(screen.getByText('+ Add Reminder'));
    
    expect(screen.getByText('Set Reminder')).toBeInTheDocument();
    expect(screen.queryByText('+ Add Reminder')).not.toBeInTheDocument();
  });

  it('does not show add reminder button when item already has reminders', () => {
    const itemWithReminders = {
      ...mockItem,
      reminders: [
        {
          id: 'reminder-1',
          reminderAt: '2023-12-30T12:00:00.000Z',
          createdAt: '2023-01-01T12:00:00.000Z',
          updatedAt: '2023-01-01T12:00:00.000Z',
          todoItemId: '1'
        }
      ]
    };
    
    render(
      <TodoItem 
        item={itemWithReminders} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
        onAddReminder={mockOnAddReminder} 
      />
    );
    
    expect(screen.queryByText('+ Add Reminder')).not.toBeInTheDocument();
    expect(screen.getByText('Reminder:')).toBeInTheDocument();
  });
}); 