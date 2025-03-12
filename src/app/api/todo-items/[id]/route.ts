import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/todo-items/[id] - Get a specific todo item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sessionId = request.headers.get('x-session-id') || '';
    
    const todoItem = await prisma.todoItem.findUnique({
      where: {
        id,
      },
      include: {
        todoList: true,
        reminders: true,
      },
    });
    
    if (!todoItem) {
      return NextResponse.json({ error: 'Todo item not found' }, { status: 404 });
    }
    
    // Verify that the todo item belongs to the current session
    if (todoItem.todoList.sessionId && todoItem.todoList.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized access to todo item' }, { status: 403 });
    }
    
    return NextResponse.json(todoItem);
  } catch (error) {
    console.error('Error fetching todo item:', error);
    return NextResponse.json({ error: 'Failed to fetch todo item' }, { status: 500 });
  }
}

// PATCH /api/todo-items/[id] - Update a todo item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sessionId = request.headers.get('x-session-id') || '';
    const data = await request.json();
    
    // First, check if the todo item exists and belongs to the current session
    const existingItem = await prisma.todoItem.findUnique({
      where: { id },
      include: { todoList: true }
    });
    
    if (!existingItem) {
      return NextResponse.json({ error: 'Todo item not found' }, { status: 404 });
    }
    
    // Verify that the todo item belongs to the current session
    if (existingItem.todoList.sessionId && existingItem.todoList.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized access to todo item' }, { status: 403 });
    }
    
    const todoItem = await prisma.todoItem.update({
      where: { id },
      data,
    });
    
    return NextResponse.json(todoItem);
  } catch (error) {
    console.error('Error updating todo item:', error);
    return NextResponse.json({ error: 'Failed to update todo item' }, { status: 500 });
  }
}

// DELETE /api/todo-items/[id] - Delete a todo item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sessionId = request.headers.get('x-session-id') || '';
    
    // First, check if the todo item exists and belongs to the current session
    const existingItem = await prisma.todoItem.findUnique({
      where: { id },
      include: { todoList: true }
    });
    
    if (!existingItem) {
      return NextResponse.json({ error: 'Todo item not found' }, { status: 404 });
    }
    
    // Verify that the todo item belongs to the current session
    if (existingItem.todoList.sessionId && existingItem.todoList.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized access to todo item' }, { status: 403 });
    }
    
    await prisma.todoItem.delete({
      where: { id },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting todo item:', error);
    return NextResponse.json({ error: 'Failed to delete todo item' }, { status: 500 });
  }
} 