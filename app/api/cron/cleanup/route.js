import { connectDB } from "@/lib/db";
import Sensor from "@/models/Sensor";

export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));

    // Find all readings in the last hour, sorted by highest depth
    const logs = await Sensor.find({
      createdAt: { $gte: oneHourAgo, $lt: now }
    }).sort({ water_depth: -1 });

    if (logs.length > 3) {
      const keepIds = logs.slice(0, 3).map(l => l._id);
      // Delete the lower values to keep the database clean and relevant
      await Sensor.deleteMany({
        _id: { $nin: keepIds },
        createdAt: { $gte: oneHourAgo, $lt: now }
      });
    }
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}