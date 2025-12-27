import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    
    let query: any = {};
    if (email) query.email = email;
    if (role) query.role = role;
    
    const users = await db.collection('users').find(query).toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      address
    } = body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }
    
    const user = {
      email,
      password, // In production, this should be hashed
      firstName,
      lastName,
      role,
      phone,
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      profileCompleted: false,
      profileCompletionPercentage: 0,
      signupDate: new Date(),
    };
    
    const result = await db.collection('users').insertOne(user);
    const savedUser = { ...user, _id: result.insertedId };
    
    // Remove password from response
    const { password: _, ...userResponse } = savedUser;
    
    return NextResponse.json({ 
      success: true, 
      data: userResponse 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    
    const body = await request.json();
    const { userId, updates } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const result = await db.collection('users').findOneAndUpdate(
      { _id: userId },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove password from response
    const { password, ...userResponse } = result;
    
    return NextResponse.json({ 
      success: true, 
      data: userResponse 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
