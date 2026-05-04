import { connectDB } from "@/lib/db";
import Node from "@/models/Node";

// GET all nodes for the management table
export async function GET() {
  await connectDB();
  const nodes = await Node.find({});
  return Response.json(nodes);
}

// POST to create or update a node (Dynamic Info)
export async function POST(req) {
  try {
    await connectDB();
    const { node_id, location, baseline_depth } = await req.json();

    const updatedNode = await Node.findOneAndUpdate(
      { node_id },
      { location, baseline_depth },
      { upsert: true, new: true } // Create if doesn't exist, update if it does
    );

    return Response.json({ success: true, node: updatedNode });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}