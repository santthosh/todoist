import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateTodoList } from '@/app/components/CreateTodoList';

describe('CreateTodoList Component', () => {
  const mockOnCreateList = jest.fn();

  beforeEach(() => {
    mockOnCreateList.mockClear();
  });

  it('renders the create button initially', () => {
    render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    expect(screen.getByText('Create New Todo List')).toBeInTheDocument();
    expect(screen.queryByText('Create New Todo List', { selector: 'h2' })).not.toBeInTheDocument();
  });

  it('shows the form when create button is clicked', () => {
    render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    fireEvent.click(screen.getByText('Create New Todo List', { selector: 'span' }));
    
    expect(screen.getByText('Create New Todo List', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create List' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onCreateList when form is submitted with valid data', () => {
    render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    // Open the form
    fireEvent.click(screen.getByText('Create New Todo List', { selector: 'span' }));
    
    // Clear the default title that's generated
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: '' } });
    
    // Fill in the form with our test data
    fireEvent.change(titleInput, { target: { value: 'Test List' } });
    fireEvent.change(screen.getByLabelText('Description (optional)'), { 
      target: { value: 'Test Description' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Create List' }));
    
    // Check if onCreateList was called with the correct arguments
    expect(mockOnCreateList).toHaveBeenCalledTimes(1);
    expect(mockOnCreateList).toHaveBeenCalledWith('Test List', 'Test Description');
    
    // Check if the form is closed and the create button is shown again
    expect(screen.getByText('Create New Todo List', { selector: 'span' })).toBeInTheDocument();
  });

  it('does not call onCreateList when form is submitted with empty title', () => {
    render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    // Open the form
    fireEvent.click(screen.getByText('Create New Todo List', { selector: 'span' }));
    
    // Clear the default title that's generated
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: '' } });
    
    // Submit the form without filling in the title
    fireEvent.click(screen.getByRole('button', { name: 'Create List' }));
    
    // Check if onCreateList was not called
    expect(mockOnCreateList).not.toHaveBeenCalled();
    
    // Check if the form is still open
    expect(screen.getByText('Create New Todo List', { selector: 'h2' })).toBeInTheDocument();
  });

  it('closes the form when cancel button is clicked', () => {
    render(<CreateTodoList onCreateList={mockOnCreateList} />);
    
    // Open the form
    fireEvent.click(screen.getByText('Create New Todo List', { selector: 'span' }));
    
    // Click the cancel button
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    
    // Check if the form is closed and the create button is shown again
    expect(screen.getByText('Create New Todo List', { selector: 'span' })).toBeInTheDocument();
    expect(screen.queryByText('Create New Todo List', { selector: 'h2' })).not.toBeInTheDocument();
  });
}); 