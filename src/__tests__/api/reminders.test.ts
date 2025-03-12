import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/reminders/route';
import { GET as GET_BY_ID, PATCH, DELETE } from '@/app/api/reminders/[id]/route';
import prisma from '@/lib/db';
import redis from '@/lib/redis';
import { normalizeDates } from '../utils/testHelpers';

// Mock Prisma client
jest.mock('@/lib/db', () => ({
  reminder: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  todoItem: {
    findUnique: jest.fn(),
  },
}));

// Mock Redis client
jest.mock('@/lib/redis', () => ({
  set: jest.fn(() => Promise.resolve('OK')),
  expire: jest.fn(() => Promise.resolve(1)),
  del: jest.fn(() => Promise.resolve(1)),
}));

describe('Reminders API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reminders', () => {
    it('returns all reminders', async () => {
      const mockReminders = [
        {
          id: '1',
          reminderAt: new Date('2023-12-31'),
          createdAt: new Date(),
          updatedAt: new Date(),
          todoItemId: 'item-1',
          todoItem: {
            id: 'item-1',
            title: 'Test Item',
            todoList: {
              sessionId: 'test-session'
            }
          },
        },
      ];

      prisma.reminder.findMany.mockResolvedValue(mockReminders);

      const request = new NextRequest('http://localhost:3000/api/reminders');

      const response = await GET(request);
      const data = await response.json();

      expect(prisma.reminder.findMany).toHaveBeenCalled();
      expect(data).toEqual(normalizeDates(mockReminders));
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/reminders', () => {
    it('creates a new reminder', async () => {
      const mockTodoItem = {
        id: 'item-1',
        title: 'Test Item',
        todoList: {
          id: 'list-1',
          sessionId: 'test-session'
        }
      };

      const mockReminder = {
        id: '1',
        reminderAt: new Date('2023-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        todoItemId: 'item-1',
        todoItem: mockTodoItem,
      };

      prisma.todoItem.findUnique.mockResolvedValue(mockTodoItem);
      prisma.reminder.create.mockResolvedValue(mockReminder);
      
      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        headers: {
          'x-session-id': 'test-session'
        }
      });
      
      // Mock the request body with all required fields
      Object.defineProperty(request, 'json', {
        value: jest.fn().mockResolvedValue({
          reminderAt: '2023-12-31T12:00:00.000Z',
          todoItemId: 'item-1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.todoItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoItem.findUnique).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        include: { todoList: true }
      });
      expect(prisma.reminder.create).toHaveBeenCalledTimes(1);
      expect(prisma.reminder.create).toHaveBeenCalledWith({
        data: {
          reminderAt: expect.any(Date),
          todoItemId: 'item-1',
        },
        include: {
          todoItem: true,
        },
      });
      expect(redis.set).toHaveBeenCalledTimes(1);
      // Don't strictly check redis.expire calls as they depend on time calculations
      expect(data).toEqual(normalizeDates(mockReminder));
      expect(response.status).toBe(201);
    });

    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        headers: {
          'x-session-id': 'test-session'
        }
      });
      
      // Mock the request body with missing reminderAt
      Object.defineProperty(request, 'json', {
        value: jest.fn().mockResolvedValue({
          todoItemId: 'item-1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.reminder.create).not.toHaveBeenCalled();
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(400);
    });

    it('returns 404 if todo item is not found', async () => {
      prisma.todoItem.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        headers: {
          'x-session-id': 'test-session'
        }
      });
      
      // Mock the request body
      Object.defineProperty(request, 'json', {
        value: jest.fn().mockResolvedValue({
          reminderAt: '2023-12-31T12:00:00.000Z',
          todoItemId: 'non-existent',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.todoItem.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.reminder.create).not.toHaveBeenCalled();
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/reminders/[id]', () => {
    it('returns a specific reminder', async () => {
      // Mock the Prisma response
      const mockReminder = {
        id: '1',
        reminderAt: new Date('2023-01-15T12:00:00.000Z'),
        todoItemId: '1',
        createdAt: new Date('2023-01-01T12:00:00.000Z'),
        todoItem: {
          id: '1',
          title: 'Test Item',
          todoListId: '1'
        }
      };
      
      prisma.reminder.findUnique.mockResolvedValue(mockReminder);
      
      // Create a mock request with the ID in the URL pathname
      const request = new NextRequest('http://localhost:3000/api/reminders/1', {
        headers: {
          'x-session-id': 'test-session'
        }
      });
      
      // Mock the nextUrl.pathname property
      Object.defineProperty(request, 'nextUrl', {
        value: {
          pathname: '/api/reminders/1'
        },
        writable: true
      });
      
      const response = await GET_BY_ID(request);
      const data = await response.json();

      expect(prisma.reminder.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.reminder.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          todoItem: true
        }
      });
      
      expect(data).toEqual(normalizeDates(mockReminder));
      expect(response.status).toBe(200);
    });

    it('returns 404 if reminder is not found', async () => {
      prisma.reminder.findUnique.mockResolvedValue(null);
      
      // Create a mock request with the ID in the URL pathname
      const request = new NextRequest('http://localhost:3000/api/reminders/999', {
        headers: {
          'x-session-id': 'test-session'
        }
      });
      
      // Mock the nextUrl.pathname property
      Object.defineProperty(request, 'nextUrl', {
        value: {
          pathname: '/api/reminders/999'
        },
        writable: true
      });
      
      const response = await GET_BY_ID(request);
      const data = await response.json();

      expect(prisma.reminder.findUnique).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/reminders/[id]', () => {
    it('updates a reminder', async () => {
      // Mock the Prisma response
      const mockUpdatedReminder = {
        id: '1',
        reminderAt: new Date('2023-02-15T12:00:00.000Z'), // Updated date
        todoItemId: '1',
        createdAt: new Date('2023-01-01T12:00:00.000Z'),
        todoItem: {
          id: '1',
          title: 'Test Item',
          todoListId: '1'
        }
      };
      
      // Mock the Redis functions to return successful responses
      jest.spyOn(redis, 'set').mockResolvedValue('OK');
      jest.spyOn(redis, 'expire').mockResolvedValue(1);
      
      prisma.reminder.update.mockResolvedValue(mockUpdatedReminder);
      
      // Create a mock request with the ID in the URL pathname
      const request = new NextRequest('http://localhost:3000/api/reminders/1', {
        method: 'PATCH',
        headers: {
          'x-session-id': 'test-session'
        }
      });
      
      // Mock the nextUrl.pathname property
      Object.defineProperty(request, 'nextUrl', {
        value: {
          pathname: '/api/reminders/1'
        },
        writable: true
      });
      
      // Mock the request body
      Object.defineProperty(request, 'json', {
        value: jest.fn().mockResolvedValue({
          reminderAt: '2023-02-15T12:00:00.000Z'
        }),
      });
      
      const response = await PATCH(request);
      const data = await response.json();

      expect(prisma.reminder.update).toHaveBeenCalledTimes(1);
      expect(prisma.reminder.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          reminderAt: expect.any(Date)
        },
        include: {
          todoItem: true
        }
      });
      
      expect(data).toEqual(normalizeDates(mockUpdatedReminder));
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/reminders/[id]', () => {
    it('deletes a reminder', async () => {
      prisma.reminder.delete.mockResolvedValue({});
      
      // Create a mock request with the ID in the URL pathname
      const request = new NextRequest('http://localhost:3000/api/reminders/1', {
        method: 'DELETE',
        headers: {
          'x-session-id': 'test-session'
        }
      });
      
      // Mock the nextUrl.pathname property
      Object.defineProperty(request, 'nextUrl', {
        value: {
          pathname: '/api/reminders/1'
        },
        writable: true
      });
      
      const response = await DELETE(request);

      expect(prisma.reminder.delete).toHaveBeenCalledTimes(1);
      expect(prisma.reminder.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      
      // Check Redis operations
      expect(redis.del).toHaveBeenCalledTimes(1);
      expect(redis.del).toHaveBeenCalledWith('reminder:1');
      
      expect(response.status).toBe(204);
    });
  });
}); 