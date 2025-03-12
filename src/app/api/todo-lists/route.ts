import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/todo-lists - Get all todo lists
export async function GET() {
  try {
    const todoLists = await prisma.todoList.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(todoLists);
  } catch (error) {
    console.error('Error fetching todo lists:', error);
    return NextResponse.json({ error: 'Failed to fetch todo lists' }, { status: 500 });
  }
}

// POST /api/todo-lists - Create a new todo list
export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const todoList = await prisma.todoList.create({
      data: {
        title,
        description,
      },
    });
    
    return NextResponse.json(todoList, { status: 201 });
  } catch (error) {
    console.error('Error creating todo list:', error);
    return NextResponse.json({ error: 'Failed to create todo list' }, { status: 500 });
  }
} 