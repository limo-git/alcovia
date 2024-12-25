import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
  taskId: number;
  taskName: string;
  description: string;
  category: string;
  duration: string;
  priority: string;
  timeOfDay: string;
}

const taskSchema = new Schema<ITask>({
  taskId: { type: Number, required: true },
  taskName: { type: String, required: true, default: 'Untitled Task' },
  description: { type: String, required: true, default: 'No description provided' },
  category: { type: String, required: true, default: 'General' },
  duration: { type: String, required: true, default: '1 hour' },
  priority: { type: String, required: true, default: 'Medium' },
  timeOfDay: { type: String, required: true, default: 'Any time' },
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);
