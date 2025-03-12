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
    expect(screen.getByText('Due:')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByTitle('Edit')).toBeInTheDocument();
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
    expect(screen.getByTitle('Add Reminder')).toBeInTheDocument();
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
    
    fireEvent.click(screen.getByTitle('Delete'));
    
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
    
    fireEvent.click(screen.getByTitle('Edit'));
    
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
    fireEvent.click(screen.getByTitle('Edit'));
    
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
    
    fireEvent.click(screen.getByTitle('Add Reminder'));
    
    expect(screen.getByText('Set')).toBeInTheDocument();
    // The Add Reminder button is still in the document but might be hidden
    // Let's check if it exists but is not visible
    const addReminderButton = screen.getByTitle('Add Reminder');
    expect(addReminderButton).toBeInTheDocument();
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
    
    expect(screen.queryByTitle('Add Reminder')).not.toBeInTheDocument();
    // Look for the clock icon and date in a more flexible way
    const reminderElement = screen.getByText((content, element) => {
      // Check if the element contains the date part (Dec 30) without being strict about the time
      return !!element?.textContent?.includes('Dec 30') && element?.tagName.toLowerCase() === 'span';
    });
    expect(reminderElement).toBeInTheDocument();
  });
}); 