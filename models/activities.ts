import mongoose, { Schema, Document } from 'mongoose';

interface IActivity extends Document {
  activityId: number;
  activityName: string;
  description: string;
  category: string;
  duration: string;
  priority: string;
  timeOfDay: string;
  location: string;
}

const activitySchema = new Schema<IActivity>({
  activityId: { type: Number, required: true },
  activityName: { type: String, required: true, default: 'Untitled Activity' },
  description: { type: String, required: true, default: 'No description provided' },
  category: { type: String, required: true, default: 'General' },
  duration: { type: String, required: true, default: '1 hour' },
  priority: { type: String, required: true, default: 'Medium' },
  timeOfDay: { type: String, required: true, default: 'Any time' },
  location: { type: String, required: true, default: 'Online' }, // Default location
});

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);
