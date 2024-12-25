import mongoose from 'mongoose';
import Workshop from '../../../../models/workshop'; // Workshop model
import Student from '../../../../models/student';   // Student model
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/utils';    // Utility to connect to the database

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await dbConnect();
};

// Function to recommend workshops based on the student's preferences (Content-Based Filtering)
export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { email } = await req.json();  // Extract the email from the request body

    if (!email) {
      return NextResponse.json({ error: 'Email is required to get recommendations' }, { status: 400 });
    }

    // Fetch the student by email
    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Fetch all workshops from the Workshop model
    const workshops = await Workshop.find();

    // Filter workshops based on the student's preferences
    const recommendedWorkshops = workshops.filter((workshop) => {
      const { topics, learning_style, duration, timeOfDay } = workshop;

      // Check if the workshop matches the student's preferences
      const matchesTopics = student.preferences.preferred_topics.some((topic : string) => topics.includes(topic));
      const matchesLearningStyle = student.preferences.learning_style && learning_style === student.preferences.learning_style;
      const matchesTimeOfDay = student.availability.includes(timeOfDay);

      // Check if duration matches the student's preferred task duration
      const matchesDuration = duration === 'Any' || duration === 'Flexible' || student.preferences.preferred_duration === duration;

      // Workshop is considered a match if any of the criteria is satisfied
      return (matchesTopics || matchesLearningStyle || matchesTimeOfDay || matchesDuration);
    });

    // If no workshops match, return a message
    if (recommendedWorkshops.length === 0) {
      return NextResponse.json({ message: 'No workshops match your preferences for today' }, { status: 200 });
    }

    // Return the recommended workshops
    return NextResponse.json({ recommendedWorkshops }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
