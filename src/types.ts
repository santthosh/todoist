export interface TodoListType {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  items: TodoItemType[];
}

export interface TodoItemType {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  todoListId: string;
  reminders: ReminderType[];
}

export interface ReminderType {
  id: string;
  reminderAt: string;
  createdAt: string;
  updatedAt: string;
  todoItemId: string;
} 