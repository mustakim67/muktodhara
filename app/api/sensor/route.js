import { connectDB } from "@/lib/db";
import Sensor from "@/models/Sensor";
import Node from "@/models/Node";
import { sendEmail } from "@/lib/mailer";

// CRITICAL: Prevents Vercel build errors by forcing dynamic execution
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { node_id, s1, s2 } = body;

    // Fetch configuration for the specific node (e.g., NODE_A)
    const config = await Node.findOne({ node_id });
    if (!config) {
      return Response.json({ error: "Node config not found" }, { status: 404 });
    }

    // 1. Hardware Calibration & Depth Calculation
    const s1_cal = s1;
    const s2_cal = s2 - 1; // Correcting the 1cm hardware offset for Sensor 2
    
    // Depth is (total drain height) - (current distance reading)
    const depth1 = Math.max(0, config.baseline_depth - s1_cal);
    const depth2 = Math.max(0, config.baseline_depth - s2_cal);
    
    // Safety: Use the highest detected level
    const current_depth = Math.max(depth1, depth2);
    const capacity_reached = (current_depth / config.baseline_depth) * 100;

    // 2. Project Muktodhara Status Logic
    let status = "GREEN";
    if (capacity_reached > 60) {
      status = "RED"; // Critical Alert
    } else if (capacity_reached >= 45) {
      status = "YELLOW"; // Warning Alert
    }

    // 3. Email Notification Logic
    const lastLog = await Sensor.findOne({ node_id }).sort({ createdAt: -1 });
    const sensorsMatchHigh = (capacity_reached >= 45 && Math.abs(depth1 - depth2) < 5);

    // Only send email if status changes or sensors confirm critical levels
    const shouldNotify = (status !== "GREEN" && (!lastLog || lastLog.status !== status)) || (sensorsMatchHigh && !lastLog?.sensorsMatchHigh);

    if (shouldNotify) {
      let resourceSuggestion = status === "RED" 
        ? "CRITICAL: Deploy 1 Municipal Engineer and a team of 4-5 workers with suction equipment." 
        : "Suggest deploying 1-2 Plumbers to check for localized blockages.";

      const subject = `${status === 'RED' ? '🔴 CRITICAL' : '🟡 WARNING'}: Muktodhara Alert - ${config.location}`;
      const message = `
        Location: ${config.location}
        Alert Level: ${status}
        Occupied Capacity: ${capacity_reached.toFixed(1)}%
        Water Depth: ${current_depth.toFixed(1)} cm
        
        Recommended Action:
        -------------------------------------------
        ${resourceSuggestion}
        -------------------------------------------
      `;

      await sendEmail('mahfujapple95@gmail.com', subject, message);
    }

    // 4. Save Record to MongoDB
    const log = await Sensor.create({
      node_id,
      location: config.location,
      water_depth: current_depth,
      diff_level: Math.abs(s1_cal - s2_cal),
      s1: s1_cal,
      s2: s2_cal,
      status,
      sensorsMatchHigh 
    });

    return Response.json(log, { status: 201 });
  } catch (err) {
    console.error("POST Error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    // Retrieve latest 40 readings for the AquaVision dashboard
    const logs = await Sensor.find().sort({ createdAt: -1 }).limit(40).lean();
    
    return new Response(JSON.stringify(logs), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return Response.json([], { status: 500 });
  }
}