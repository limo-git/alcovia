import mongoose from 'mongoose';
import Activity from '../../../../models/activities';  
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

    const activities = await Activity.find();

    
    const recommendedActivities = activities.filter((activity) => {
      const { category, duration, timeOfDay } = activity;

      
      const matchesWeakness = student.weaknesses.some((weakness: string) => category.includes(weakness));


      const matchesTimeOfDay = student.availability.includes(timeOfDay);

      
      const matchesDuration = duration === 'Any' || duration === 'Flexible' || student.preferences.learning_style.includes(duration);

      return (matchesWeakness || matchesTimeOfDay || matchesDuration);
    });


    if (recommendedActivities.length === 0) {
      return NextResponse.json({ message: 'No activities match your weaknesses for today' }, { status: 200 });
    }


    return NextResponse.json({ recommendedActivities }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
