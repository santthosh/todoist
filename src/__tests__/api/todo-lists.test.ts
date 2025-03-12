import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/todo-lists/route';
import { GET as GET_BY_ID, PATCH, DELETE } from '@/app/api/todo-lists/[id]/route';
import prisma from '@/lib/db';
import { normalizeDates } from '../utils/testHelpers';
import { createMockRequestWithParams } from '../utils/apiHelpers';

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

// Mock session ID for tests
const TEST_SESSION_ID = 'test-session-id';

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
          sessionId: TEST_SESSION_ID,
          items: [],
        },
      ];

      (prisma.todoList.findMany as jest.Mock).mockResolvedValue(mockTodoLists);

      // Create request with session ID header
      const request = new NextRequest('http://localhost:3000/api/todo-lists', {
        headers: {
          'x-session-id': TEST_SESSION_ID
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(prisma.todoList.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.findMany).toHaveBeenCalledWith({
        where: {
          sessionId: TEST_SESSION_ID
        },
        include: expect.any(Object),
        orderBy: expect.any(Object)
      });
      expect(data).toEqual(normalizeDates(mockTodoLists));
      expect(response.status).toBe(200);
    });

    it('handles errors', async () => {
      (prisma.todoList.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Create request with session ID header
      const request = new NextRequest('http://localhost:3000/api/todo-lists', {
        headers: {
          'x-session-id': TEST_SESSION_ID
        }
      });

      const response = await GET(request);
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
        sessionId: TEST_SESSION_ID,
      };

      (prisma.todoList.create as jest.Mock).mockResolvedValue(mockTodoList);

      const request = new NextRequest('http://localhost:3000/api/todo-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': TEST_SESSION_ID
        },
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
          sessionId: TEST_SESSION_ID
        },
      });
      expect(data).toEqual(normalizeDates(mockTodoList));
      expect(response.status).toBe(201);
    });

    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/todo-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': TEST_SESSION_ID
        },
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
      // Mock the Prisma response
      const mockTodoList = {
        id: '1',
        title: 'Test Todo List',
        description: 'Test description',
        isArchived: false,
        sessionId: TEST_SESSION_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };
      
      (prisma.todoList.findUnique as jest.Mock).mockResolvedValue(mockTodoList);
      
      // Create a mock request with the ID in the URL
      const request = createMockRequestWithParams(
        'http://localhost:3000/api/todo-lists/1',
        { id: '1' },
        { 'x-session-id': TEST_SESSION_ID }
      );
      
      const response = await GET_BY_ID(request);
      const data = await response.json();

      expect(prisma.todoList.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          items: {
            include: {
              reminders: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        },
      });
      
      expect(data).toEqual(normalizeDates(mockTodoList));
      expect(response.status).toBe(200);
    });

    it('returns 404 if todo list is not found', async () => {
      (prisma.todoList.findUnique as jest.Mock).mockResolvedValue(null);
      
      // Create a mock request with the ID in the URL
      const request = createMockRequestWithParams(
        'http://localhost:3000/api/todo-lists/999',
        { id: '999' },
        { 'x-session-id': TEST_SESSION_ID }
      );
      
      const response = await GET_BY_ID(request);
      const data = await response.json();

      expect(prisma.todoList.findUnique).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty('error');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/todo-lists/[id]', () => {
    it('updates a todo list', async () => {
      // Mock the Prisma responses
      const mockExistingList = {
        id: '1',
        title: 'Test Todo List',
        description: 'Test description',
        isArchived: false,
        sessionId: TEST_SESSION_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockUpdatedList = {
        ...mockExistingList,
        title: 'Updated Title',
        isArchived: true,
      };
      
      (prisma.todoList.findUnique as jest.Mock).mockResolvedValue(mockExistingList);
      (prisma.todoList.update as jest.Mock).mockResolvedValue(mockUpdatedList);
      
      // Create a mock request with the ID in the URL
      const request = createMockRequestWithParams(
        'http://localhost:3000/api/todo-lists/1',
        { id: '1' },
        { 'x-session-id': TEST_SESSION_ID }
      );
      
      // Mock the request body
      Object.defineProperty(request, 'json', {
        value: jest.fn().mockResolvedValue({
          title: 'Updated Title',
          isArchived: true,
        }),
      });
      
      const response = await PATCH(request);
      const data = await response.json();

      expect(prisma.todoList.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.update).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: 'Updated Title',
          isArchived: true,
        },
      });
      
      expect(data).toEqual(normalizeDates(mockUpdatedList));
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/todo-lists/[id]', () => {
    it('deletes a todo list', async () => {
      // Mock the Prisma response
      const mockExistingList = {
        id: '1',
        title: 'Test Todo List',
        description: 'Test description',
        isArchived: false,
        sessionId: TEST_SESSION_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      (prisma.todoList.findUnique as jest.Mock).mockResolvedValue(mockExistingList);
      
      // Create a mock request with the ID in the URL
      const request = createMockRequestWithParams(
        'http://localhost:3000/api/todo-lists/1',
        { id: '1' },
        { 'x-session-id': TEST_SESSION_ID }
      );
      
      const response = await DELETE(request);

      expect(prisma.todoList.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.delete).toHaveBeenCalledTimes(1);
      expect(prisma.todoList.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      
      expect(response.status).toBe(204);
    });
  });
}); 