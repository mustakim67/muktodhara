import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema({
  node_id: { type: String, required: true },
  location: { type: String, required: true },
  water_depth: { type: Number, required: true },
  diff_level: { type: Number, required: true },
  s1: { type: Number, default: 0 }, // Upstream raw data
  s2: { type: Number, default: 0 }, // Downstream raw data
  status: { type: String, default: "GREEN" }
}, { 
  timestamps: true // This creates your 'createdAt' field
});

export default mongoose.models.Sensor || mongoose.model("Sensor", SensorSchema);