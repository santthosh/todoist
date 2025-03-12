import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/todo-lists/[id] - Get a specific todo list
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todoList = await prisma.todoList.findUnique({
      where: {
        id: params.id,
      },
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
    
    if (!todoList) {
      return NextResponse.json({ error: 'Todo list not found' }, { status: 404 });
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
    const { title, description, isArchived } = await request.json();
    
    const todoList = await prisma.todoList.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        isArchived,
      },
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
    await prisma.todoList.delete({
      where: {
        id: params.id,
      },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting todo list:', error);
    return NextResponse.json({ error: 'Failed to delete todo list' }, { status: 500 });
  }
} 