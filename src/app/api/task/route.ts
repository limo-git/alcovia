import mongoose from 'mongoose';
import Task from '../../../../models/task'; // Assuming Task model is stored at models/task.ts
import Student from '../../../../models/student'; // Assuming Student model is stored at models/student.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/utils';

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await dbConnect();
};

// Function to recommend tasks based on the student's preferences (Content-Based Filtering)
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required to get recommendations' }, { status: 400 });
  }

  try {
    // Fetch the student by email
    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Fetch all tasks from the Task model
    const tasks = await Task.find();

    // Content-Based Filtering - Filter tasks based on student's preferences
    const recommendedTasks = tasks.filter((task) => {
      const { category, duration, timeOfDay } = task;

      // Check if the task matches the student's preferences
      const matchesCategory = student.preferences.preferred_topics.some((topic: string) => category.includes(topic));
      const matchesLearningStyle = student.preferences.learning_style && category.includes(student.preferences.learning_style);
      const matchesTimeOfDay = student.availability.includes(timeOfDay);

      // Check if duration matches the student's available time or preferred task duration
      const matchesDuration = duration === 'Any' || duration === 'Flexible' || student.preferences.learning_style.includes(duration);

      // Task is considered a match if any of the criteria is satisfied
      return (matchesCategory || matchesLearningStyle || matchesTimeOfDay || matchesDuration);
    });

    // If no tasks matched the preferences
    if (recommendedTasks.length === 0) {
      return NextResponse.json({ message: 'No tasks match your preferences for today' }, { status: 200 });
    }

    // Return the recommended tasks
    return NextResponse.json({ recommendedTasks }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
