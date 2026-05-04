import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema({
  node_id: { type: String, required: true },
  location: { type: String, required: true },
  water_depth: { type: Number, required: true },
  diff_level: { type: Number, required: true },
  s1: { type: Number, default: 0 }, 
  s2: { type: Number, default: 0 }, 
  status: { type: String, default: "GREEN" },
  // ADD THIS FIELD: Required for the redundancy alert logic to track state
  sensorsMatchHigh: { type: Boolean, default: false } 
}, { 
  timestamps: true 
});

export default mongoose.models.Sensor || mongoose.model("Sensor", SensorSchema);