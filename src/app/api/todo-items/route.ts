import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// POST /api/todo-items - Create a new todo item
export async function POST(request: NextRequest) {
  try {
    const { title, description, dueDate, todoListId } = await request.json();
    
    if (!title || !todoListId) {
      return NextResponse.json({ error: 'Title and todoListId are required' }, { status: 400 });
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