import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/todo-items/[id] - Get a specific todo item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todoItem = await prisma.todoItem.findUnique({
      where: {
        id: params.id,
      },
      include: {
        reminders: true,
      },
    });
    
    if (!todoItem) {
      return NextResponse.json({ error: 'Todo item not found' }, { status: 404 });
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
    const { title, description, isCompleted, dueDate } = await request.json();
    
    const todoItem = await prisma.todoItem.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        isCompleted,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
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
    await prisma.todoItem.delete({
      where: {
        id: params.id,
      },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting todo item:', error);
    return NextResponse.json({ error: 'Failed to delete todo item' }, { status: 500 });
  }
} 