import mongoose, { Document, Schema } from 'mongoose';

// Define the Mentor interface that extends mongoose.Document
export interface IMentor extends Document {
  name: string;
  expertise: string[];
  contact_email: string;
  availability: [string];
}

// Define the mentorSchema with type IStudent
const mentorSchema = new Schema<IMentor>({
  name: { type: String, required: true },
  expertise: { type: [String], required: true },
  contact_email: { type: String, required: false, unique: true },
  availability: { type: [String], required: true, }, 
});

// Export the Mentor model or fallback to the existing model if it already exists
export default mongoose.models.Mentor || mongoose.model<IMentor>('Mentor', mentorSchema);
