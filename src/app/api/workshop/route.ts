import mongoose from 'mongoose';
import Workshop from '../../../../models/workshop'; 
import Student from '../../../../models/student';   
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/utils';    

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await dbConnect();
};


export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required to get recommendations' }, { status: 400 });
    }

    
    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    
    const workshops = await Workshop.find();
    const recommendedWorkshops = workshops.filter((workshop) => {
      const { topics, learning_style, duration, timeOfDay } = workshop;


      const matchesTopics = student.preferences.preferred_topics.some((topic : string) => topics.includes(topic));
      const matchesLearningStyle = student.preferences.learning_style && learning_style === student.preferences.learning_style;
      const matchesTimeOfDay = student.availability.includes(timeOfDay);

      const matchesDuration = duration === 'Any' || duration === 'Flexible' || student.preferences.preferred_duration === duration;

      
      return (matchesTopics || matchesLearningStyle || matchesTimeOfDay || matchesDuration);
    });

    
    if (recommendedWorkshops.length === 0) {
      return NextResponse.json({ message: 'No workshops match your preferences for today' }, { status: 200 });
    }

    
    return NextResponse.json({ recommendedWorkshops }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
