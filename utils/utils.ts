import mongoose from 'mongoose';

// dbConnect now explicitly returns mongoose.Connection type
const dbConnect = async (): Promise<mongoose.Connection> => {
  if (mongoose.connections[0].readyState) {
    // Already connected to the database
    console.log('Already connected to MongoDB');
    return mongoose.connections[0]; // Return the existing connection
  }

  try {
    // Connect to the database and return the connection object
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected successfully');
    return mongoose.connections[0]; // Return the connection object after successful connection
  } catch (error: unknown) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default dbConnect;
