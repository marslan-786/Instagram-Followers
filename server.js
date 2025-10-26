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
const RECEIVER_EMAIL = "marslansalfias@gmail.com";

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

    await transporter.sendMail({
      from: `"Website Message" <${SENDER_EMAIL}>`,
      to: RECEIVER_EMAIL,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nMessage: ${message}`
    });

    attemptCount++;

    if (attemptCount < 3) {
      res.json({
        success: false,
        message: "❌ Your request submission failed. Please check your details."
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
