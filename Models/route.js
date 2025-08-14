import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  distanceKm: { type: Number, required: true },
  trafficLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  baseTimeMinutes: { type: Number, required: true } 
}, { timestamps: true });

export default mongoose.model('Route', routeSchema);
