import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the student document
interface IStudent extends Document {
  name: string;
  email: string;
  strengths: string[];
  weaknesses: string[];
  interests: string[];
  availability: string[];
  preferences: {
    learning_style: string;
    preferred_topics: string[];
  };
}

const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true, default: 'Anonymous' },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => /.+@.+\..+/.test(v), // Simple email validation regex
      message: (props: { value: string }) => `${props.value} is not a valid email!`,
    },
  },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  availability: { type: [String], default: ['Weekends'] },
  preferences: {
    learning_style: { type: String, default: 'Visual' },
    preferred_topics: { type: [String], default: ['Web Development'] },
  },
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);
