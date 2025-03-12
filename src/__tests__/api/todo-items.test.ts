import { NextRequest } from 'next/server';
import { POST } from '@/app/api/todo-items/route';
import { GET, PATCH, DELETE } from '@/app/api/todo-items/[id]/route';
import prisma from '@/lib/db';
import { normalizeDates } from '../utils/testHelpers';

// Mock Prisma client
jest.mock('@/lib/db', () => ({
  todoItem: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  todoList: {
    findUnique: jest.fn(),
  }
}));

// Mock session ID for tests
const TEST_SESSION_ID = 'test-session-id';

describe('Todo Items API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/todo-items', () => {
    it('creates a new todo item', async () => {
      const mockTodoList = {
        id: 'list-1',
        title: 'Test List',
        sessionId: TEST_SESSION_ID
      };

      const mockTodoItem = {
        id: '1',
        title: 'New Item',
        description: 'New Description',
        isCompleted: false,
        dueDate: new Date('2023-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        todoListId: 'list-1',
        reminders: [],
      };

      (prisma.todoList.findUnique as jest.Mock).mockResolvedValue(mockTodoList);
      (prisma.todoItem.create as jest.Mock).mockResolvedValue(mockTodoItem);

      const request = new NextRequest('http://localhost:3000/api/todo-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': TEST_SESSION_ID
        },
        body: JSON.stringify({
          title: 'New Item',
          description: 'New Description',
          dueDate: '2023-12-31T12:00:00.000Z',
          todoListId: 'list-1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.todoList.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.findUnique).toHaveBeenCalledWith({
        where: { id: 'list-1' }
      });
      expect(prisma.todoItem.create).toHaveBeenCalledTimes(1);
      expect(prisma.todoItem.create).toHaveBeenCalledWith({
        data: {
          title: 'New Item',
          description: 'New Description',
          dueDate: expect.any(Date),
          todoListId: 'list-1',
        },
      });
      expect(data).toEqual(normalizeDates(mockTodoItem));
      expect(response.status).toBe(201);
    });

    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/todo-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': TEST_SESSION_ID
        },
        body: JSON.stringify({
          description: 'New Description',
          dueDate: '2023-12-31T12:00:00.000Z',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.todoItem.create).not.toHaveBeenCalled();
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/todo-items/[id]', () => {
    it('returns a specific todo item', async () => {
      const mockTodoItem = {
        id: '1',
        title: 'Test Item',
        description: 'Test Description',
        isCompleted: false,
        dueDate: new Date('2023-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        todoListId: 'list-1',
        reminders: [],
        todoList: {
          id: 'list-1',
          sessionId: TEST_SESSION_ID
        }
      };

      (prisma.todoItem.findUnique as jest.Mock).mockResolvedValue(mockTodoItem);

      const params = { id: '1' };
      const request = new NextRequest('http://localhost:3000/api/todo-items/1', {
        headers: {
          'x-session-id': TEST_SESSION_ID
        }
      });
      const response = await GET(request, { params });
      const data = await response.json();

      expect(prisma.todoItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoItem.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          todoList: true,
          reminders: true,
        },
      });
      expect(data).toEqual(normalizeDates(mockTodoItem));
      expect(response.status).toBe(200);
    });

    it('returns 404 if todo item is not found', async () => {
      (prisma.todoItem.findUnique as jest.Mock).mockResolvedValue(null);

      const params = { id: '999' };
      const request = new NextRequest('http://localhost:3000/api/todo-items/999', {
        headers: {
          'x-session-id': TEST_SESSION_ID
        }
      });
      const response = await GET(request, { params });
      const data = await response.json();

      expect(prisma.todoItem.findUnique).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/todo-items/[id]', () => {
    it('updates a todo item', async () => {
      const params = { id: '1' };
      const requestBody = {
        title: 'Updated Item',
        description: 'Updated Description',
        isCompleted: true,
        dueDate: '2024-01-15T12:00:00.000Z'
      };
      
      const request = new NextRequest(`http://localhost/api/todo-items/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': TEST_SESSION_ID
        },
        body: JSON.stringify(requestBody)
      });

      prisma.todoItem.findUnique.mockResolvedValue({
        id: '1',
        title: 'Test Item',
        description: 'Test Description',
        isCompleted: false,
        dueDate: new Date('2023-12-31T12:00:00.000Z'),
        todoListId: '1',
        todoList: {
          sessionId: TEST_SESSION_ID
        }
      });

      prisma.todoItem.update.mockResolvedValue({
        id: '1',
        title: 'Updated Item',
        description: 'Updated Description',
        isCompleted: true,
        dueDate: new Date('2024-01-15T12:00:00.000Z'),
        todoListId: '1'
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(prisma.todoItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoItem.update).toHaveBeenCalledTimes(1);
      expect(prisma.todoItem.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: requestBody
      });
      expect(response.status).toBe(200);
      expect(data.id).toBe('1');
    });
  });

  describe('DELETE /api/todo-items/[id]', () => {
    it('deletes a todo item', async () => {
      const mockExistingTodoItem = {
        id: '1',
        title: 'Test Item',
        todoList: {
          id: 'list-1',
          sessionId: TEST_SESSION_ID
        }
      };

      (prisma.todoItem.findUnique as jest.Mock).mockResolvedValue(mockExistingTodoItem);
      (prisma.todoItem.delete as jest.Mock).mockResolvedValue({});

      const params = { id: '1' };
      const request = new NextRequest('http://localhost:3000/api/todo-items/1', {
        method: 'DELETE',
        headers: {
          'x-session-id': TEST_SESSION_ID
        }
      });

      const response = await DELETE(request, { params });

      expect(prisma.todoItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoItem.delete).toHaveBeenCalledTimes(1);
      expect(prisma.todoItem.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(response.status).toBe(204);
    });
  });
}); 