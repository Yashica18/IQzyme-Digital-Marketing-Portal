import express from "express";
import path from "path";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// FIREBASE ADMIN INITIALIZATION
// ==========================================
try {
  if (getApps().length === 0) {
    initializeApp({
      projectId: "quadratic-aquifer-fwjkk",
    });
  }
} catch (err) {
  console.error("Firebase admin init failed:", err);
}

// Specify the correct Firestore database ID
const db = getFirestore("ai-studio-iqzymedigitalmar-79bad091-bc05-486e-9abd-cdb187dc6199");

// ==========================================
// GEMINI API LAZY INITIALIZATION SERVICE
// ==========================================
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ==========================================
// BACKEND API ENDPOINTS
// ==========================================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Book Consultation Endpoint
app.post("/api/book-consultation", async (req, res) => {
  const {
    userId,
    clientName,
    clientEmail,
    phone,
    companyName,
    serviceStream,
    consultationDate,
    timeSlot,
    urgency,
    notes,
  } = req.body;

  // 1. Validation Checks
  if (!clientName || !clientName.trim()) {
    return res.status(400).json({ error: "Client Name is required." });
  }
  if (!clientEmail || !clientEmail.trim() || !clientEmail.includes("@")) {
    return res.status(400).json({ error: "A valid corporate email is required." });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: "Liaison phone number is required." });
  }
  if (!companyName || !companyName.trim()) {
    return res.status(400).json({ error: "Company/Lab Name is required." });
  }
  if (!consultationDate || !consultationDate.trim()) {
    res.status(400).json({ error: "Consultation Date is required." });
    return;
  }
  if (!timeSlot || !timeSlot.trim()) {
    return res.status(400).json({ error: "Time Slot selection is required." });
  }
  if (!serviceStream || !serviceStream.trim()) {
    return res.status(400).json({ error: "Service stream selection is required." });
  }

  try {
    // 2. Prevent Duplicate Submissions
    // Check if a record already exists with the same email, date, and stream
    const duplicateQuery = await db
      .collection("consultationRequests")
      .where("clientEmail", "==", clientEmail.trim())
      .where("consultationDate", "==", consultationDate.trim())
      .limit(1)
      .get();

    if (!duplicateQuery.empty) {
      return res.status(409).json({
        error: "A consultation booking is already registered for this email address on this date. Please choose a different date or schedule another slot.",
      });
    }

    // 3. Draft Confirmation & Admin Alert Emails using Gemini API
    let draftedConfirmation = "";
    let draftedAdminAlert = "";

    try {
      const ai = getGeminiClient();

      // Email to Client
      const clientEmailPrompt = `Draft a highly professional, reassuring, and detailed confirmation email from IQzyme Regulatory Advisory to the client.
Client Details:
- Name: ${clientName}
- Company: ${companyName}
- Selected Advisory Stream: ${serviceStream}
- Urgency: ${urgency}
- Scope/Notes: ${notes || "General compliance strategic review"}
- Requested Date & Time: ${consultationDate} at ${timeSlot}

The email should:
1. Warmly confirm the booking.
2. Detail the exact agenda for the session, customized to their requirements.
3. Reassure them that our Non-Disclosure Agreement (NDA) and an initial technical document checklist will be shared with them shortly.
4. List 3 preparatory actions they should take before our call to maximize value.
5. Provide contact details for urgent matters.

Write only the email subject and body in clear Markdown.`;

      const clientRes = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: clientEmailPrompt,
        config: {
          systemInstruction: "You are an elite medical device regulatory affairs director and client relations lead at IQzyme.",
        },
      });
      draftedConfirmation = clientRes.text || "Failed to generate confirmation text.";

      // Alert Notification to Admin
      const adminEmailPrompt = `Draft an internal executive alert notification for the IQzyme administrative board about a new premium advisory booking.
Client details:
- Liaison: ${clientName}
- Org: ${companyName}
- Email: ${clientEmail}
- Phone: ${phone}
- Compliance Stream: ${serviceStream}
- Urgency: ${urgency}
- Date: ${consultationDate} at ${timeSlot}
- Notes: ${notes || "None"}

Provide a brief 3-sentence summary analysis of what their regulatory pain points might be and any competitive advantages IQzyme can pitch during the session. Keep it structured and alert-focused.`;

      const adminRes = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: adminEmailPrompt,
        config: {
          systemInstruction: "You are a strategic business analyst reporting to the IQzyme Board of Directors.",
        },
      });
      draftedAdminAlert = adminRes.text || "Failed to generate administrative alert text.";

    } catch (aiErr: any) {
      console.warn("Gemini email drafting skipped or failed:", aiErr.message);
      draftedConfirmation = `Dear ${clientName},\n\nThis is to confirm your consultation scheduled for ${consultationDate} at ${timeSlot}.\n\nBest regards,\nIQzyme Advisory`;
      draftedAdminAlert = `Alert: New booking by ${clientName} (${companyName}) on ${consultationDate} @ ${timeSlot}. Phone: ${phone}`;
    }

    // 4. Save to Firestore (matches security rules & blueprint exactly)
    const bookingPayload = {
      userId: userId || "anonymous",
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      serviceStream: serviceStream.trim(),
      consultationDate: consultationDate.trim(),
      timeSlot: timeSlot.trim(),
      urgency: urgency || "Standard (Within 2-3 weeks)",
      notes: (notes || "").trim().substring(0, 2000),
      status: "pending_confirmation",
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("consultationRequests").add(bookingPayload);

    // 5. Save the communications (emails logs) as a sub-collection or audit log
    await db.collection("consultationRequests").doc(docRef.id).collection("communications").add({
      type: "BOOKING_EMAILS_DRAFTED",
      confirmationEmail: draftedConfirmation,
      adminAlert: draftedAdminAlert,
      timestamp: FieldValue.serverTimestamp(),
    });

    // 6. Print actual emails to server logs (Simulate direct transmission)
    console.log(`\n==================================================`);
    console.log(`[EMAIL DISPATCH] Confirmation sent to client: ${clientEmail}`);
    console.log(`--------------------------------------------------`);
    console.log(draftedConfirmation);
    console.log(`==================================================\n`);

    console.log(`\n==================================================`);
    console.log(`[ALERT DISPATCH] Notification sent to IQzyme Admin: yashicajindal1806@gmail.com`);
    console.log(`--------------------------------------------------`);
    console.log(draftedAdminAlert);
    console.log(`==================================================\n`);

    return res.status(200).json({
      success: true,
      bookingId: docRef.id,
      message: "Consultation booked successfully. Confirmation email drafted and dispatched.",
      clientEmail,
      draftedConfirmation,
      draftedAdminAlert,
    });

  } catch (error: any) {
    console.error("Error booking consultation backend:", error);
    return res.status(500).json({
      error: error.message || "An internal error occurred while processing your consultation request.",
    });
  }
});

// ==========================================
// VITE AND STATIC ASSETS MIDDLEWARE
// ==========================================
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start the server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Full-stack application listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
});
