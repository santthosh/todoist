import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/todo-lists/[id] - Get a specific todo list
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sessionId = request.headers.get('x-session-id') || '';
    
    const todoList = await prisma.todoList.findUnique({
      where: {
        id,
      },
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
    
    if (!todoList) {
      return NextResponse.json({ error: 'Todo list not found' }, { status: 404 });
    }
    
    // Verify that the todo list belongs to the current session
    if (todoList.sessionId && todoList.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized access to todo list' }, { status: 403 });
    }
    
    return NextResponse.json(todoList);
  } catch (error) {
    console.error('Error fetching todo list:', error);
    return NextResponse.json({ error: 'Failed to fetch todo list' }, { status: 500 });
  }
}

// PATCH /api/todo-lists/[id] - Update a todo list
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sessionId = request.headers.get('x-session-id') || '';
    const data = await request.json();
    
    // First, check if the todo list exists and belongs to the current session
    const existingList = await prisma.todoList.findUnique({
      where: { id }
    });
    
    if (!existingList) {
      return NextResponse.json({ error: 'Todo list not found' }, { status: 404 });
    }
    
    // Verify that the todo list belongs to the current session
    if (existingList.sessionId && existingList.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized access to todo list' }, { status: 403 });
    }
    
    const todoList = await prisma.todoList.update({
      where: { id },
      data,
    });
    
    return NextResponse.json(todoList);
  } catch (error) {
    console.error('Error updating todo list:', error);
    return NextResponse.json({ error: 'Failed to update todo list' }, { status: 500 });
  }
}

// DELETE /api/todo-lists/[id] - Delete a todo list
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sessionId = request.headers.get('x-session-id') || '';
    
    // First, check if the todo list exists and belongs to the current session
    const existingList = await prisma.todoList.findUnique({
      where: { id }
    });
    
    if (!existingList) {
      return NextResponse.json({ error: 'Todo list not found' }, { status: 404 });
    }
    
    // Verify that the todo list belongs to the current session
    if (existingList.sessionId && existingList.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized access to todo list' }, { status: 403 });
    }
    
    await prisma.todoList.delete({
      where: { id },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting todo list:', error);
    return NextResponse.json({ error: 'Failed to delete todo list' }, { status: 500 });
  }
} 