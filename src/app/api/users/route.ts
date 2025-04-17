import { NextResponse } from 'next/server';
import { Repository } from '@/lib/Repository';

const repository = new Repository();

export async function GET() {
  try {
    const users = await repository.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = await repository.createUser(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
  }
}