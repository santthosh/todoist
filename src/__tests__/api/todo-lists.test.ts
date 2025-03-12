import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/todo-lists/route';
import { GET as GET_BY_ID, PATCH, DELETE } from '@/app/api/todo-lists/[id]/route';
import prisma from '@/lib/db';
import { normalizeDates } from '../utils/testHelpers';

// Mock Prisma client
jest.mock('@/lib/db', () => ({
  todoList: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Todo Lists API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/todo-lists', () => {
    it('returns all todo lists', async () => {
      const mockTodoLists = [
        {
          id: '1',
          title: 'Test List',
          description: 'Test Description',
          createdAt: new Date(),
          updatedAt: new Date(),
          isArchived: false,
          items: [],
        },
      ];

      (prisma.todoList.findMany as jest.Mock).mockResolvedValue(mockTodoLists);

      const response = await GET();
      const data = await response.json();

      expect(prisma.todoList.findMany).toHaveBeenCalledTimes(1);
      expect(data).toEqual(normalizeDates(mockTodoLists));
      expect(response.status).toBe(200);
    });

    it('handles errors', async () => {
      (prisma.todoList.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await GET();
      const data = await response.json();

      expect(prisma.todoList.findMany).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/todo-lists', () => {
    it('creates a new todo list', async () => {
      const mockTodoList = {
        id: '1',
        title: 'New List',
        description: 'New Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
      };

      (prisma.todoList.create as jest.Mock).mockResolvedValue(mockTodoList);

      const request = new NextRequest('http://localhost:3000/api/todo-lists', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New List',
          description: 'New Description',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.todoList.create).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.create).toHaveBeenCalledWith({
        data: {
          title: 'New List',
          description: 'New Description',
        },
      });
      expect(data).toEqual(normalizeDates(mockTodoList));
      expect(response.status).toBe(201);
    });

    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/todo-lists', {
        method: 'POST',
        body: JSON.stringify({
          description: 'New Description',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(prisma.todoList.create).not.toHaveBeenCalled();
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/todo-lists/[id]', () => {
    it('returns a specific todo list', async () => {
      const mockTodoList = {
        id: '1',
        title: 'Test List',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
        items: [],
      };

      (prisma.todoList.findUnique as jest.Mock).mockResolvedValue(mockTodoList);

      const params = { id: '1' };
      const request = new NextRequest('http://localhost:3000/api/todo-lists/1');
      const response = await GET_BY_ID(request, { params });
      const data = await response.json();

      expect(prisma.todoList.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          items: {
            include: {
              reminders: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
      expect(data).toEqual(normalizeDates(mockTodoList));
      expect(response.status).toBe(200);
    });

    it('returns 404 if todo list is not found', async () => {
      (prisma.todoList.findUnique as jest.Mock).mockResolvedValue(null);

      const params = { id: '999' };
      const request = new NextRequest('http://localhost:3000/api/todo-lists/999');
      const response = await GET_BY_ID(request, { params });
      const data = await response.json();

      expect(prisma.todoList.findUnique).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/todo-lists/[id]', () => {
    it('updates a todo list', async () => {
      const mockUpdatedTodoList = {
        id: '1',
        title: 'Updated List',
        description: 'Updated Description',
        isArchived: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.todoList.update as jest.Mock).mockResolvedValue(mockUpdatedTodoList);

      const params = { id: '1' };
      const request = new NextRequest('http://localhost:3000/api/todo-lists/1', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'Updated List',
          description: 'Updated Description',
          isArchived: true,
        }),
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(prisma.todoList.update).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: 'Updated List',
          description: 'Updated Description',
          isArchived: true,
        },
      });
      expect(data).toEqual(normalizeDates(mockUpdatedTodoList));
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/todo-lists/[id]', () => {
    it('deletes a todo list', async () => {
      (prisma.todoList.delete as jest.Mock).mockResolvedValue({});

      const params = { id: '1' };
      const request = new NextRequest('http://localhost:3000/api/todo-lists/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });

      expect(prisma.todoList.delete).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(response.status).toBe(204);
    });
  });
}); 