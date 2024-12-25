import mongoose from 'mongoose';
import Student from '../../../../models/student'; 
import dbConnect from '../../../../utils/utils';
import { NextRequest, NextResponse } from 'next/server';

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await dbConnect();
};

// Handle the POST request to save or fetch the student data
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { name, email, strengths, weaknesses, preferences, interests, availability } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Check if the student already exists in the database by email
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      // If student exists, return the student data
      return NextResponse.json({ userExists: true, student: existingStudent }, { status: 200 });
    }

    // If student doesn't exist, create a new student with provided data or default values
    const newStudent = new Student({
      name,
      email,
      strengths,
      weaknesses,
      preferences,
      interests,
      availability,
    });

    // Save the new student to the database
    await newStudent.save();
    return NextResponse.json({ userExists: false, student: newStudent }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error saving or fetching data' }, { status: 500 });
  }
}
