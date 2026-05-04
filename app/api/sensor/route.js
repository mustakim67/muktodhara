import { connectDB } from "@/lib/db";
import Sensor from "@/models/Sensor";
import Node from "@/models/Node";
import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { node_id, s1, s2 } = body;

    const config = await Node.findOne({ node_id });
    if (!config) return Response.json({ error: "Node config not found" }, { status: 404 });

    // 1. Hardware Calibration & Accurate Depth Calculation
    const s1_cal = s1;
    const s2_cal = s2 - 1; // Correcting the 1cm hardware offset
    
    // Depth is calculated as the baseline (total drain height) minus current sensor reading
    const depth1 = Math.max(0, config.baseline_depth - s1_cal);
    const depth2 = Math.max(0, config.baseline_depth - s2_cal);
    
    // Use the highest detected water level for safety
    const current_depth = Math.max(depth1, depth2);
    const capacity_reached = (current_depth / config.baseline_depth) * 100;

    // 2. Updated Status Logic per your request
    let status = "GREEN";
    if (capacity_reached > 60) {
      status = "RED"; // Red for more than 60%
    } else if (capacity_reached >= 45) {
      status = "YELLOW"; // Yellow for 45% to 60%
    } else {
      status = "GREEN"; // Green for less than 45%
    }

    // 3. Email Alert Logic
    const lastLog = await Sensor.findOne({ node_id }).sort({ createdAt: -1 });

    // Trigger alert if status escalates or if both sensors confirm high levels (redundancy)
    const sensorsMatchHigh = (capacity_reached >= 45 && Math.abs(depth1 - depth2) < 5);
    const shouldNotify = (status !== "GREEN" && (!lastLog || lastLog.status !== status)) || (sensorsMatchHigh && !lastLog?.sensorsMatchHigh);

    if (shouldNotify) {
      let resourceSuggestion = "Status is stable.";
      
      // 4. Resource Suggestion Logic
      if (status === "YELLOW") {
        resourceSuggestion = "Suggest deploying 1-2 Plumbers to check for localized blockages.";
      } else if (status === "RED") {
        resourceSuggestion = "CRITICAL: Deploy 1 Municipal Engineer and a team of 4-5 workers with suction equipment.";
      }

      const subject = `${status === 'RED' ? '🔴 CRITICAL' : '🟡 WARNING'}: Muktodhara Alert - ${config.location}`;
      const message = `
        Alert Level: ${status}
        Occupied Capacity: ${capacity_reached.toFixed(1)}%
        Current Water Depth: ${current_depth.toFixed(1)} cm
        Location: ${config.location}
        
        Recommended Resources:
        -------------------------------------------
        ${resourceSuggestion}
        -------------------------------------------
        
        *Hardware Note: s2 was auto-calibrated by -1cm.*
      `;

      await sendEmail('mahfujapple95@gmail.com', subject, message); //
    }

    // 5. Save Record
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

// 6. Dashboard Fix: Dynamic Fetching without caching
export async function GET() {
  try {
    await connectDB();
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