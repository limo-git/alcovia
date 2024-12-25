import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/utils';

export async function GET() {
  try {
    
    const connection = await dbConnect();  


    if (!connection || !connection.db) {
      throw new Error('Database connection is not available');
    }


    const mentorsCollection = connection.db.collection('mentors');
    const mentors = await mentorsCollection.find().toArray();

    console.log('Found mentors:', mentors.length);

    if (mentors.length === 0) {
      return NextResponse.json(
        { message: 'No mentors found' },
        { status: 404 }
      );
    }

    
    return NextResponse.json({
      success: true,
      data: mentors,
    });
  } catch (error: unknown) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json(
      { message: 'Failed to fetch mentors', error: (error as Error).message },
      { status: 500 }
    );
  }
}
