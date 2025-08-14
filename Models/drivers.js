import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentShiftHours: { type: Number, required: true, default: 0 }, // hours worked today
  pastWeekHours: { type: [Number], default: [] } // hours worked for last 7 days
}, { timestamps: true });

export default mongoose.model('Driver', driverSchema);