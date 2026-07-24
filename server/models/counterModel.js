import mongoose from 'mongoose';

// Generic atomic-sequence store. One document per counter name (e.g.
// "orderNumber"), incremented via findByIdAndUpdate + $inc so concurrent
// requests never collide on the same number.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 100000 },
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
