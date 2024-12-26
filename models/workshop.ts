import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  mentor:{type:String},
  topics: [String], 
  learning_style: { type: String }, 
  duration: { type: String }, 
  timeOfDay: { type: String }, 
  image: { type: String },
});

export default mongoose.models.Workshop || mongoose.model('Workshop', workshopSchema);
