import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import redis from '@/lib/redis';

// GET /api/reminders/[id] - Get a specific reminder
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reminder = await prisma.reminder.findUnique({
      where: {
        id: params.id,
      },
      include: {
        todoItem: true,
      },
    });
    
    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }
    
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error fetching reminder:', error);
    return NextResponse.json({ error: 'Failed to fetch reminder' }, { status: 500 });
  }
}

// PATCH /api/reminders/[id] - Update a reminder
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reminderAt } = await request.json();
    
    const reminder = await prisma.reminder.update({
      where: {
        id: params.id,
      },
      data: {
        reminderAt: new Date(reminderAt),
      },
      include: {
        todoItem: true,
      },
    });
    
    // Update reminder in Redis
    const reminderKey = `reminder:${reminder.id}`;
    await redis.set(reminderKey, JSON.stringify(reminder));
    
    // Update expiration for the Redis key
    const now = new Date();
    const reminderDate = new Date(reminderAt);
    const ttlSeconds = Math.floor((reminderDate.getTime() - now.getTime()) / 1000);
    
    if (ttlSeconds > 0) {
      await redis.expire(reminderKey, ttlSeconds);
    }
    
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}

// DELETE /api/reminders/[id] - Delete a reminder
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.reminder.delete({
      where: {
        id: params.id,
      },
    });
    
    // Remove from Redis
    await redis.del(`reminder:${params.id}`);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
  }
} 