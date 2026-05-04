import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema({
  node_id: { type: String, unique: true, required: true },
  location: { type: String, default: "New Point" },
  baseline_depth: { type: Number, default: 200 }, // Physical depth of drain
  status: { type: String, default: "GREEN" }
});

export default mongoose.models.Node || mongoose.model("Node", NodeSchema);