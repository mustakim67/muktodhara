import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mahfujapple95@gmail.com',
        pass: 'cgha yudc khel yewj' 
      }
    });

    await transporter.sendMail({
      from: '"Muktodhara Alert" <mahfujapple95@gmail.com>',
      to: 'mustakimapple95@gmail.com',
      subject: `🚨 ALERT: ${body.status} level at ${body.location}`,
      html: `<h3>Emergency Report</h3>
             <p>Location: ${body.location}</p>
             <p>Water Depth: ${body.water_depth}cm</p>
             <p>Status: ${body.status}</p>`
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}