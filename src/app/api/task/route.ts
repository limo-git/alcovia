import mongoose from 'mongoose';
import Task from '../../../../models/task'; 
import Student from '../../../../models/student'; 
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/utils';

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await dbConnect();
};


export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required to get recommendations' }, { status: 400 });
  }

  try {

    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    
    const tasks = await Task.find();


    const recommendedTasks = tasks.filter((task) => {
      const { category, duration, timeOfDay } = task;


      const matchesCategory = student.preferences.preferred_topics.some((topic: string) => category.includes(topic));
      const matchesLearningStyle = student.preferences.learning_style && category.includes(student.preferences.learning_style);
      const matchesTimeOfDay = student.availability.includes(timeOfDay);

      
      const matchesDuration = duration === 'Any' || duration === 'Flexible' || student.preferences.learning_style.includes(duration);

      
      return (matchesCategory || matchesLearningStyle || matchesTimeOfDay || matchesDuration);
    });

    
    if (recommendedTasks.length === 0) {
      return NextResponse.json({ message: 'No tasks match your preferences for today' }, { status: 200 });
    }


    return NextResponse.json({ recommendedTasks }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
