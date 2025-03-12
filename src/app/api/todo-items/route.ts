import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// POST /api/todo-items - Create a new todo item
export async function POST(request: NextRequest) {
  try {
    const { title, description, dueDate, todoListId } = await request.json();
    const sessionId = request.headers.get('x-session-id') || '';
    
    if (!title || !todoListId) {
      return NextResponse.json({ error: 'Title and todoListId are required' }, { status: 400 });
    }
    
    // Verify that the todo list belongs to the current session
    const todoList = await prisma.todoList.findUnique({
      where: { id: todoListId }
    });
    
    if (!todoList) {
      return NextResponse.json({ error: 'Todo list not found' }, { status: 404 });
    }
    
    // Verify that the todo list belongs to the current session
    if (todoList.sessionId && todoList.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized access to todo list' }, { status: 403 });
    }
    
    const todoItem = await prisma.todoItem.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        todoListId,
      },
    });
    
    return NextResponse.json(todoItem, { status: 201 });
  } catch (error) {
    console.error('Error creating todo item:', error);
    return NextResponse.json({ error: 'Failed to create todo item' }, { status: 500 });
  }
} 