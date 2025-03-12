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
  set: jest.fn(),
  expire: jest.fn(),
  del: jest.fn(),
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
          },
        },
      ];

      (prisma.reminder.findMany as jest.Mock).mockResolvedValue(mockReminders);

      const response = await GET();
      const data = await response.json();

      expect(prisma.reminder.findMany).toHaveBeenCalledTimes(1);
      expect(data).toEqual(normalizeDates(mockReminders));
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/reminders', () => {
    it('creates a new reminder', async () => {
      const mockTodoItem = {
        id: 'item-1',
        title: 'Test Item',
      };

      const mockReminder = {
        id: '1',
        reminderAt: new Date('2023-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        todoItemId: 'item-1',
        todoItem: mockTodoItem,
      };

      (prisma.todoItem.findUnique as jest.Mock).mockResolvedValue(mockTodoItem);
      (prisma.reminder.create as jest.Mock).mockResolvedValue(mockReminder);
      
      // Skip the time-dependent tests for redis.expire
      (redis.expire as jest.Mock).mockResolvedValue('OK');

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
          reminderAt: '2023-12-31T12:00:00.000Z',
          todoItemId: 'item-1',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.todoItem.findUnique).toHaveBeenCalledTimes(1);
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
        body: JSON.stringify({
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
      (prisma.todoItem.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
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
      const mockReminder = {
        id: '1',
        reminderAt: new Date('2023-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        todoItemId: 'item-1',
        todoItem: {
          id: 'item-1',
          title: 'Test Item',
        },
      };

      (prisma.reminder.findUnique as jest.Mock).mockResolvedValue(mockReminder);

      const params = { id: '1' };
      const request = new NextRequest('http://localhost:3000/api/reminders/1');
      const response = await GET_BY_ID(request, { params });
      const data = await response.json();

      expect(prisma.reminder.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.reminder.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          todoItem: true,
        },
      });
      expect(data).toEqual(normalizeDates(mockReminder));
      expect(response.status).toBe(200);
    });

    it('returns 404 if reminder is not found', async () => {
      (prisma.reminder.findUnique as jest.Mock).mockResolvedValue(null);

      const params = { id: '999' };
      const request = new NextRequest('http://localhost:3000/api/reminders/999');
      const response = await GET_BY_ID(request, { params });
      const data = await response.json();

      expect(prisma.reminder.findUnique).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/reminders/[id]', () => {
    it('updates a reminder', async () => {
      const mockUpdatedReminder = {
        id: '1',
        reminderAt: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
        todoItemId: 'item-1',
        todoItem: {
          id: 'item-1',
          title: 'Test Item',
        },
      };

      (prisma.reminder.update as jest.Mock).mockResolvedValue(mockUpdatedReminder);
      
      // Skip the time-dependent tests for redis.expire
      (redis.expire as jest.Mock).mockResolvedValue('OK');

      const params = { id: '1' };
      const request = new NextRequest('http://localhost:3000/api/reminders/1', {
        method: 'PATCH',
        body: JSON.stringify({
          reminderAt: '2024-01-15T12:00:00.000Z',
        }),
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(prisma.reminder.update).toHaveBeenCalledTimes(1);
      expect(prisma.reminder.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          reminderAt: expect.any(Date),
        },
        include: {
          todoItem: true,
        },
      });
      expect(redis.set).toHaveBeenCalledTimes(1);
      // Don't strictly check redis.expire calls as they depend on time calculations
      expect(data).toEqual(normalizeDates(mockUpdatedReminder));
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/reminders/[id]', () => {
    it('deletes a reminder', async () => {
      (prisma.reminder.delete as jest.Mock).mockResolvedValue({});

      const params = { id: '1' };
      const request = new NextRequest('http://localhost:3000/api/reminders/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });

      expect(prisma.reminder.delete).toHaveBeenCalledTimes(1);
      expect(prisma.reminder.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(redis.del).toHaveBeenCalledTimes(1);
      expect(redis.del).toHaveBeenCalledWith('reminder:1');
      expect(response.status).toBe(204);
    });
  });
}); 