import { connectDB } from "@/lib/db";
import Sensor from "@/models/Sensor"; // Use the @ alias for consistency
import Node from "@/models/Node";

// CRITICAL: This stops Vercel from trying to run DB queries during the build
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    // ... your analytics logic
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}