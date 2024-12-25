import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/utils';

export async function GET() {
  try {
    // Connect to the database and get the connection object
    const connection = await dbConnect();  // This returns the connection object

    // Check if the connection is valid and the database is available
    if (!connection || !connection.db) {
      throw new Error('Database connection is not available');
    }

    // Access the database via the connection object
    const mentorsCollection = connection.db.collection('mentors');
    const mentors = await mentorsCollection.find().toArray();

    // Log mentors length for debugging
    console.log('Found mentors:', mentors.length);

    if (mentors.length === 0) {
      return NextResponse.json(
        { message: 'No mentors found' },
        { status: 404 }
      );
    }

    // Return the mentors data as JSON using NextResponse
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
