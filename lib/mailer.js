import nodemailer from "nodemailer";

/**
 * Sends an automated alert email for Project Muktodhara.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject line.
 * @param {string} text - The body content (including AI prediction).
 */
export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mahfujapple95@gmail.com',
        pass: 'fccm tnbt xfce xqpu' // Your verified 16-digit App Password
      },
    });

    const mailOptions = {
      from: '"Muktodhara Alert System" <mahfujapple95@gmail.com>',
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Alert Email Sent: ${result.messageId}`);
    return result;
  } catch (error) {
    // This will help you catch any network-level blocks if you're on university Wi-Fi
    console.error("❌ Mailer Error:", error.message);
  }
};