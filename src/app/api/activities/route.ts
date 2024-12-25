import mongoose from 'mongoose';
import Activity from '../../../../models/activities';  // Activity model
import Student from '../../../../models/student'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/utils';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await dbConnect();
};

// Function to recommend activities based on the student's preferences (Content-Based Filtering)
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required to get recommendations' }, { status: 400 });
  }

  try {
    // Fetch the student by email (assuming you have a Student model and student preferences)
    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Fetch all activities from the Activity model
    const activities = await Activity.find();

    // Content-Based Filtering - Filter activities based on student's preferences
    const recommendedActivities = activities.filter((activity) => {
      const { category, duration, timeOfDay } = activity;

      // Check if the activity matches the student's preferences
      const matchesCategory = student.preferences.preferred_topics.some((topic: string) => category.includes(topic));
      const matchesLearningStyle = student.preferences.learning_style && category.includes(student.preferences.learning_style);
      const matchesTimeOfDay = student.availability.includes(timeOfDay);

      // Check if duration matches the student's available time or preferred task duration
      const matchesDuration = duration === 'Any' || duration === 'Flexible' || student.preferences.learning_style.includes(duration);

      // Activity is considered a match if any of the criteria is satisfied
      return (matchesCategory || matchesLearningStyle || matchesTimeOfDay || matchesDuration);
    });

    // If no activities matched the preferences
    if (recommendedActivities.length === 0) {
      return NextResponse.json({ message: 'No activities match your preferences for today' }, { status: 200 });
    }

    // Return the recommended activities
    return NextResponse.json({ recommendedActivities }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
