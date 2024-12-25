import mongoose from 'mongoose';
import Student from '../../../../models/student'; 
import dbConnect from '../../../../utils/utils';
import { NextRequest, NextResponse } from 'next/server';


const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await dbConnect();
};


export async function POST(req: NextRequest): Promise<NextResponse> {
  const { name, email, strengths, weaknesses, preferences, interests, availability } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      
      return NextResponse.json({ userExists: true, student: existingStudent }, { status: 200 });
    }

    
    const newStudent = new Student({
      name,
      email,
      strengths,
      weaknesses,
      preferences,
      interests,
      availability,
    });

    
    await newStudent.save();
    return NextResponse.json({ userExists: false, student: newStudent }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error saving or fetching data' }, { status: 500 });
  }
}
