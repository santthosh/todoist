'use client';

import { useState } from 'react';
import { Button, Card, Label, TextInput, Textarea } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';

interface CreateTodoListProps {
  onCreateList: (title: string, description?: string) => void;
}

export function CreateTodoList({ onCreateList }: CreateTodoListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateList(title, description);
      setTitle('');
      setDescription('');
      setIsCreating(false);
    }
  };

  const generateFriendlyDateTime = () => {
    const now = new Date();
    
    // Format: "Todo List - March 12, 2024 at 10:30 AM"
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    // Add a unique timestamp suffix to avoid duplicates
    const timestamp = now.getTime().toString().slice(-4);
    return `Todo List - ${now.toLocaleDateString('en-US', options)} (${timestamp})`;
  };

  const handleStartCreating = () => {
    setTitle(generateFriendlyDateTime());
    setIsCreating(true);
  };

  return (
    <Card className="mb-6">
      {isCreating ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Create new todo list</h2>
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
              rows={3}
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" color="blue">
              Create List
            </Button>
            <Button color="gray" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          color="blue"
          onClick={handleStartCreating}
          className="w-full flex items-center justify-center"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Create new todo list
        </Button>
      )}
    </Card>
  );
} 