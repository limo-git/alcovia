import mongoose from "mongoose";
import {GoogleGenerativeAI} from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../utils/utils";
import Student from "../../../../models/student"; // Ensure this matches your actual model path

const genAI = new GoogleGenerativeAI("AIzaSyAyST_XCbgwjWOPJ_Kr3vN8S69GgFwnBNE");
// Connect to the database
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await dbConnect();
};

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Parse the request body
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required to get recommendations" },
        { status: 400 }
      );
    }

    // Fetch student information from the database
    const student = await Student.findOne({ email });
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const { preferred_topics, learning_style } = student.preferences;

    if (!preferred_topics || !learning_style || !student.availability) {
      return NextResponse.json(
        { error: "Incomplete student preferences" },
        { status: 400 }
      );
    }
    
  
   
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
     Based on the student's preferences, suggest one engaging and unique task:
    - Preferred Topics: ${preferred_topics.join(", ")}
    - Learning Style: ${learning_style}
    - Availability: ${student.availability.join(", ")}

    Ensure the task:
    - Matches their interests and learning style.
    - Fits their availability.
    - Includes a brief description and category.

     Please return the result in the following structured format:
      {
        "task": "Task name",
        "category": "Category name",
        "description": "Description of the task"
      }
    
    `;
    
    const result = await model.generateContent(prompt);
    
    // Correctly extract the message text from the response
    const recommendedTasks = result.response.text()

    if (!recommendedTasks) {
      return NextResponse.json(
        { message: "No recommendations could be generated" },
        { status: 200 }
      );
    }

    return NextResponse.json({ recommendedTasks }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}