import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  valueRs: { type: Number, required: true },
  assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  deliveryTimestamp: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);