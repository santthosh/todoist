import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import redis from '@/lib/redis';

// POST /api/reminders - Create a new reminder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = request.headers.get('x-session-id') || '';
    
    const { reminderAt, todoItemId } = body;
    
    // Validate required fields
    if (!reminderAt) {
      console.error('❌ Missing reminderAt in request');
      return NextResponse.json({ error: 'Reminder time is required' }, { status: 400 });
    }
    
    if (!todoItemId) {
      console.error('❌ Missing todoItemId in request');
      return NextResponse.json({ error: 'todoItemId is required' }, { status: 400 });
    }
    
    // Verify the todo item exists and belongs to the current session
    const todoItem = await prisma.todoItem.findUnique({
      where: { id: todoItemId },
      include: { todoList: true }
    });
    
    if (!todoItem) {
      console.error(`❌ Todo item not found with ID: ${todoItemId}`);
      return NextResponse.json({ error: 'Todo item not found' }, { status: 404 });
    }
    
    // Verify that the todo item belongs to the current session
    if (todoItem.todoList.sessionId && todoItem.todoList.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized access to todo item' }, { status: 403 });
    }
    
    // Parse the reminder date
    const reminderDate = new Date(reminderAt);
    
    // Create the reminder
    const reminder = await prisma.reminder.create({
      data: {
        reminderAt: reminderDate,
        todoItemId,
      },
      include: {
        todoItem: true,
      },
    });
    
    // Store reminder in Redis for quick access
    const reminderKey = `reminder:${reminder.id}`;
    
    await redis.set(reminderKey, JSON.stringify(reminder));
    
    // Set expiration for the Redis key to match the reminder time
    const now = new Date();
    const ttlSeconds = Math.floor((reminderDate.getTime() - now.getTime()) / 1000);
    
    if (ttlSeconds > 0) {
      await redis.expire(reminderKey, ttlSeconds);
    }
    
    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}

// GET /api/reminders - Get all reminders
export async function GET() {
  try {
    // In a real application, you would filter reminders by session ID
    // by joining with todoItem and todoList
    const reminders = await prisma.reminder.findMany({
      include: {
        todoItem: true,
      },
      orderBy: {
        reminderAt: 'asc',
      },
    });
    
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
} 