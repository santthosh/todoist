import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import redis from '@/lib/redis';

// POST /api/reminders - Create a new reminder
export async function POST(request: NextRequest) {
  console.log('🔍 POST /api/reminders - Request received');
  
  try {
    const body = await request.json();
    console.log('📥 Request body:', JSON.stringify(body, null, 2));
    
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
    
    // Verify the todo item exists
    console.log(`🔍 Checking if todo item exists: ${todoItemId}`);
    const todoItem = await prisma.todoItem.findUnique({
      where: { id: todoItemId }
    });
    
    if (!todoItem) {
      console.error(`❌ Todo item not found with ID: ${todoItemId}`);
      return NextResponse.json({ error: 'Todo item not found' }, { status: 404 });
    }
    
    console.log(`✅ Todo item found: ${todoItem.title}`);
    
    // Parse the reminder date
    const reminderDate = new Date(reminderAt);
    console.log(`📅 Reminder date parsed as: ${reminderDate.toISOString()}`);
    
    // Create the reminder
    console.log('💾 Creating reminder in database...');
    const reminder = await prisma.reminder.create({
      data: {
        reminderAt: reminderDate,
        todoItemId,
      },
      include: {
        todoItem: true,
      },
    });
    
    console.log(`✅ Reminder created with ID: ${reminder.id}`);
    console.log('📊 Reminder data:', JSON.stringify(reminder, null, 2));
    
    // Store reminder in Redis for quick access
    const reminderKey = `reminder:${reminder.id}`;
    console.log(`🔄 Storing reminder in Redis with key: ${reminderKey}`);
    
    await redis.set(reminderKey, JSON.stringify(reminder));
    
    // Set expiration for the Redis key to match the reminder time
    const now = new Date();
    const ttlSeconds = Math.floor((reminderDate.getTime() - now.getTime()) / 1000);
    
    if (ttlSeconds > 0) {
      console.log(`⏱️ Setting Redis key to expire in ${ttlSeconds} seconds`);
      await redis.expire(reminderKey, ttlSeconds);
    } else {
      console.log(`⚠️ Reminder date is in the past, not setting expiration`);
    }
    
    console.log('✅ Successfully created reminder');
    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating reminder:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Failed to create reminder',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/reminders - Get all reminders
export async function GET() {
  try {
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