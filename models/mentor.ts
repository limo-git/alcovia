import mongoose, { Document, Schema } from 'mongoose';


export interface IMentor extends Document {
  name: string;
  expertise: string[];
  contact_email: string;
  availability: [string]; 
  avatar:string;
}


const mentorSchema = new Schema<IMentor>({
  name: { type: String, required: true },
  expertise: { type: [String], required: true },
  contact_email: { type: String, required: false, unique: true },
  availability: { type: [String], required: true, }, 
  avatar: { 
    type: String, 
    required: false, // Make it optional for now
    default: 'https://example.com/default-avatar.png',
  }
});


export default mongoose.models.Mentor || mongoose.model<IMentor>('Mentor', mentorSchema);
