import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateTodoList } from '@/app/components/CreateTodoList';

describe('CreateTodoList Component', () => {
  const mockOnCreateList = jest.fn();

  beforeEach(() => {
    mockOnCreateList.mockClear();
  });

  it('renders with the form initially hidden', () => {
    render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    // The form should be hidden initially
    const card = screen.getByTestId('flowbite-card');
    expect(card).toHaveClass('hidden');
  });

  it('shows the form when the create button is clicked', () => {
    const { container } = render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    // Get the button by ID directly since it's hidden and can't be found by role
    const createButton = container.querySelector('#createListBtn')!;
    expect(createButton).not.toBeNull();
    fireEvent.click(createButton);
    
    // Now the form should be visible
    const titleInput = screen.getByLabelText('Title');
    expect(titleInput).toBeInTheDocument();
    expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create List' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onCreateList when form is submitted with valid data', () => {
    const { container } = render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    // Open the form
    const createButton = container.querySelector('#createListBtn')!;
    expect(createButton).not.toBeNull();
    fireEvent.click(createButton);
    
    // Fill in the form with our test data
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'Test List' } });
    
    fireEvent.change(screen.getByLabelText('Description (optional)'), { 
      target: { value: 'Test Description' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Create List' }));
    
    // Check if onCreateList was called with the correct arguments
    expect(mockOnCreateList).toHaveBeenCalledTimes(1);
    expect(mockOnCreateList).toHaveBeenCalledWith('Test List', 'Test Description');
  });

  it('does not call onCreateList when form is submitted with empty title', () => {
    const { container } = render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    // Open the form
    const createButton = container.querySelector('#createListBtn')!;
    expect(createButton).not.toBeNull();
    fireEvent.click(createButton);
    
    // Clear the title field
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: '' } });
    
    // Submit the form without filling in the title
    fireEvent.click(screen.getByRole('button', { name: 'Create List' }));
    
    // Check if onCreateList was not called
    expect(mockOnCreateList).not.toHaveBeenCalled();
  });

  it('hides the form when cancel button is clicked', () => {
    const { container } = render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    // Open the form
    const createButton = container.querySelector('#createListBtn')!;
    expect(createButton).not.toBeNull();
    fireEvent.click(createButton);
    
    // Click the cancel button
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    
    // The form should be hidden again
    const card = screen.getByTestId('flowbite-card');
    expect(card).toHaveClass('hidden');
  });
}); 