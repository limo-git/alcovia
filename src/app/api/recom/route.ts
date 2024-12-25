import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/utils';
import students from '../../../../models/student';
import Mentor from '../../../../models/mentor';
import axios from 'axios';

type Mentor = {
  name: string;
  email: string;
  expertise: string[];
  availability: string[];
};

function createMentorText(mentor: Mentor): string {
  const expertise = Array.isArray(mentor.expertise) ? mentor.expertise.join(', ') : 'No expertise listed';
  const availability = Array.isArray(mentor.availability) ? mentor.availability.join(', ') : 'No availability listed';
  return `Name: ${mentor.name}. Expertise: ${expertise}. Availability: ${availability}. Contact Email: ${mentor.email}.`;
}
export async function POST(req: NextRequest): Promise<NextResponse> {
  await dbConnect();

  const { email, goals, strengths, type, weaknesses, preferences, availability } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing email' }, { status: 400 });
  }

  try {
    
    const student = await students.findOne({ email });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }


    const studentText = `Goals: ${goals || 'Not provided'}. Strengths: ${strengths || student.strengths.join(', ')}. Interests: ${type || student.interests.join(', ')}. Weaknesses: ${weaknesses || student.weaknesses.join(', ')}. Availability: ${availability || "Not found"} Preferences: ${preferences || JSON.stringify(student.preferences)}.`;

    const huggingFaceAPI = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';
    const headers = {
      Authorization: `Bearer ${process.env.HUGGINIG_FACE_TOKEN}`,
    };

    const mentors = await Mentor.find();

    const mentorTexts = mentors.map(mentor => createMentorText(mentor));


    const embeddingResponse = await axios.post(
      huggingFaceAPI,
      {
        inputs: {
          source_sentence: studentText,
          sentences: mentorTexts,
        },
      },
      { headers }
    );

    if (!embeddingResponse.data || !Array.isArray(embeddingResponse.data)) {
      throw new Error('Failed to fetch valid embeddings from Hugging Face API');
    }

    const scores: number[] = embeddingResponse.data;


    const mentorRecommendations = mentors
      .map((mentor, idx) => ({ mentor, score: scores[idx] }))
      .sort((a, b) => b.score - a.score);


    const topMentor = mentorRecommendations[0];

    
    const mentorData = await Mentor.findOne({ email: topMentor.mentor.email });

    if (!mentorData) {
      return NextResponse.json({ error: 'Mentor not found in the database' }, { status: 404 });
    }

    return NextResponse.json({
      mentor: {
        name: mentorData.name,
        email: mentorData.email,
        expertise: mentorData.expertise,
        availability: mentorData.availability,
        contact_email: mentorData.email,  
        score: topMentor.score,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
