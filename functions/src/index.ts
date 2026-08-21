import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

const db = admin.firestore();

// Helper to construct a nodemailer transport dynamically
const getTransporter = async () => {
  const host = process.env.SMTP_HOST || "smtp.ethereal.email";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Fallback: Ethereal email (auto-generates dynamic test accounts)
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.warn("Failed to create Ethereal test account, using simulated local relay", err);
    return nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      ignoreTLS: true
    });
  }
};

/**
 * Triggered on new consultation booking creation (legacy format support)
 */
export const onBookingCreated = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snapshot, context) => {
    const bookingData = snapshot.data();
    if (!bookingData) return;

    const bookingId = context.params.bookingId;
    console.log(`New consultation booking created: ${bookingId}`, bookingData);

    try {
      // Perform automated classification confirmation or dispatch log
      await db.collection("system_logs").add({
        type: "NEW_BOOKING_NOTIFICATION",
        message: `Advisory scheduled for ${bookingData.clientName} (${bookingData.companyName})`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        referenceId: bookingId,
      });

      console.log(`Success: Logged system notification for booking ${bookingId}`);
    } catch (err) {
      console.error("Error processing booking log:", err);
    }
  });

/**
 * Triggered when a new contact message is created in contactMessages collection.
 * Sends confirmation email to client and alert notification to IQzyme Admin.
 */
export const onContactMessageCreated = functions.firestore
  .document("contactMessages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const messageData = snapshot.data();
    if (!messageData) return;

    const messageId = context.params.messageId;
    const name = messageData.name || "Valued Partner";
    const email = messageData.email;
    const projectNo = messageData.projectNo || "N/A";
    const message = messageData.message || "";
    const adminEmail = process.env.ADMIN_EMAIL || "yashicajindal1806@gmail.com";

    console.log(`Processing contact message trigger for message: ${messageId} (${email})`);

    try {
      const transporter = await getTransporter();

      // HTML template for Client Confirmation
      const clientHtml = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #2d3748; background-color: #ffffff;">
          <div style="background-color: #2D3A55; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">IQzyme Regulatory Advisory</h1>
            <p style="color: #00C4B7; margin: 6px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Compliance & Technical Strategy</p>
          </div>
          <div style="padding: 32px 24px; background-color: #ffffff;">
            <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #2D3A55;">Dear ${name},</p>
            <p style="font-size: 14px; line-height: 1.6; color: #4a5568;">Thank you for getting in touch with IQzyme. We have successfully registered your corporate inquiry. Our senior compliance officer and healthcare digital strategist are reviewing your requirements.</p>
            
            <div style="background-color: #FAF9F5; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px; margin: 24px 0;">
              <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #2D3A55; text-transform: uppercase; letter-spacing: 0.5px; border-b: 1px solid #e2e8f0; padding-bottom: 6px;">Inquiry Portfolio Summary</h3>
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; color: #718096; width: 130px;">Liaison Name:</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #2D3A55;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #718096;">Work Email:</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #2D3A55;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #718096;">Project File Reference:</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #2D3A55; font-family: monospace;">${projectNo}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #4a5568;"><strong>Next Steps:</strong> We will evaluate your specifications and get back to you within 24 business hours to share an initial technical briefing or coordinate a detailed strategic consultation.</p>
            
            <div style="margin-top: 32px; border-top: 1px solid #edf2f7; padding-top: 16px;">
              <p style="font-size: 13px; line-height: 1.6; margin-bottom: 0; color: #718096;">Best regards,<br><strong style="color: #2D3A55;">The IQzyme Operations Board</strong></p>
            </div>
          </div>
          <div style="background-color: #FAF9F5; padding: 16px; text-align: center; border-top: 1px solid #edf2f7; font-size: 11px; color: #a0aec0;">
            This is an automated operational notification. For urgent clearance, please reply directly.
          </div>
        </div>
      `;

      // HTML template for Admin Notification
      const adminHtml = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #feb2b2; border-radius: 8px; overflow: hidden; color: #2d3748; background-color: #ffffff;">
          <div style="background-color: #e53e3e; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">[Urgent Alert] New Portal Inquiry Submitted</h1>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <p style="font-size: 14px; line-height: 1.6; margin-top: 0; color: #2D3A55;">Hello Administrator,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #4a5568;">An external partner has filed a new strategic inquiry portfolio on the IQzyme portal. Please find the details below:</p>
            
            <div style="background-color: #fffaf0; border: 1px solid #feebc8; border-radius: 6px; padding: 18px; margin: 20px 0;">
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #718096; width: 140px; font-weight: bold;">Liaison Name:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Work Email:</td>
                  <td style="padding: 6px 0; color: #2d3748;"><a href="mailto:${email}" style="color: #3182ce; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Project Reference:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-family: monospace;">${projectNo}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold; vertical-align: top;">Detailed Message:</td>
                  <td style="padding: 6px 0; color: #2d3748; white-space: pre-wrap; line-height: 1.5; font-family: inherit;">${message}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 24px; margin-bottom: 8px;">
              <a href="https://ais-dev-embgwc3d6jtpc7zwvrbpqz-970488046071.asia-east1.run.app/admin" style="background-color: #2D3A55; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 4px; display: inline-block;">Open Administrative Console</a>
            </div>
          </div>
        </div>
      `;

      // 1. Send Client Confirmation Email
      if (email) {
        const clientMailInfo = await transporter.sendMail({
          from: `"IQzyme Advisory" <no-reply@iqzyme-regulatory.com>`,
          to: email,
          subject: "We have received your inquiry - IQzyme Regulatory Advisory",
          text: `Dear ${name},\n\nThank you for getting in touch with IQzyme. We have successfully registered your inquiry.\n\nSummary:\n- Liaison: ${name}\n- Project/File ID: ${projectNo}\n\nWe will evaluate your specifications and get back to you within 24 business hours.\n\nBest regards,\nIQzyme Advisory Board`,
          html: clientHtml
        });
        console.log(`Client confirmation sent: ${clientMailInfo.messageId}. URL: ${nodemailer.getTestMessageUrl(clientMailInfo) || 'N/A'}`);
      }

      // 2. Send Admin Notification Email
      const adminMailInfo = await transporter.sendMail({
        from: `"IQzyme Portal" <no-reply@iqzyme-regulatory.com>`,
        to: adminEmail,
        subject: `[URGENT PORTAL INQUIRY] Submission from ${name}`,
        text: `Hello Administrator,\n\nA visitor has filed a new strategic inquiry on the IQzyme portal.\n\nDetails:\n- Liaison: ${name}\n- Email: ${email}\n- Project ID: ${projectNo}\n- Message: ${message}`,
        html: adminHtml
      });
      console.log(`Admin notification sent: ${adminMailInfo.messageId}. URL: ${nodemailer.getTestMessageUrl(adminMailInfo) || 'N/A'}`);

    } catch (err) {
      console.error("Error dispatching contact message emails:", err);
    }
  });

/**
 * Triggered when a new consultation request is created in consultationRequests collection.
 * Sends confirmation email to client and alert notification to IQzyme Admin.
 */
export const onConsultationRequestCreated = functions.firestore
  .document("consultationRequests/{requestId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    if (!data) return;

    const requestId = context.params.requestId;
    const clientName = data.clientName || "Valued Partner";
    const clientEmail = data.clientEmail;
    const companyName = data.companyName || "N/A";
    const phone = data.phone || "N/A";
    const serviceStream = data.serviceStream || "General Regulatory Review";
    const consultationDate = data.consultationDate || "TBD";
    const timeSlot = data.timeSlot || "TBD";
    const urgency = data.urgency || "Standard";
    const notes = data.notes || "";
    const adminEmail = process.env.ADMIN_EMAIL || "yashicajindal1806@gmail.com";

    console.log(`Processing consultation booking trigger for request: ${requestId} (${clientEmail})`);

    try {
      const transporter = await getTransporter();

      // HTML template for Client Confirmation
      const clientHtml = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #2d3748; background-color: #ffffff;">
          <div style="background-color: #2D3A55; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Consultation Confirmed</h1>
            <p style="color: #99CE43; margin: 6px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">IQzyme Advisory Scheduled</p>
          </div>
          <div style="padding: 32px 24px; background-color: #ffffff;">
            <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #2D3A55;">Dear ${clientName},</p>
            <p style="font-size: 14px; line-height: 1.6; color: #4a5568;">We are pleased to confirm that your premium regulatory/digital audit has been successfully scheduled with IQzyme. Below are your meeting coordinates:</p>
            
            <div style="background-color: #FAF9F5; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 24px 0;">
              <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #2D3A55; text-transform: uppercase; letter-spacing: 1px; border-b: 1px solid #e2e8f0; padding-bottom: 6px;">Session Parameters</h3>
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; color: #718096; width: 140px;">Advisory Stream:</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #2D3A55;">${serviceStream}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #718096;">Date:</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #2D3A55;">${consultationDate}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #718096;">Time Slot:</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #2D3A55; font-family: monospace;">${timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #718096;">Host Consultant:</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #2D3A55;">Mr. Sinto Poulose, Founder Director</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #718096;">Urgency Level:</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #e53e3e;">${urgency}</td>
                </tr>
              </table>
            </div>

            <div style="margin: 24px 0; padding: 16px; border-left: 4px solid #00C4B7; background-color: #ebf8ff; border-radius: 0 4px 4px 0; font-size: 13px;">
              <strong style="color: #2b6cb0; display: block; margin-bottom: 6px;">Next Steps & Preparation:</strong>
              <ul style="margin: 0; padding-left: 18px; line-height: 1.5; color: #2d3748;">
                <li>Our mutual Non-Disclosure Agreement (NDA) is being compiled for digital signatures.</li>
                <li>Please ensure any existing device classification records or technical histories are ready.</li>
                <li>A secure meeting coordinator invitation link has been updated in your calendar.</li>
              </ul>
            </div>

            <div style="margin-top: 32px; border-top: 1px solid #edf2f7; padding-top: 16px;">
              <p style="font-size: 13px; line-height: 1.6; margin-bottom: 0; color: #718096;">Best regards,<br><strong style="color: #2D3A55;">The IQzyme Operations Board</strong></p>
            </div>
          </div>
          <div style="background-color: #FAF9F5; padding: 16px; text-align: center; border-top: 1px solid #edf2f7; font-size: 11px; color: #a0aec0;">
            IQzyme Compliance & Digital Strategy Portal. For modifications, please reply directly.
          </div>
        </div>
      `;

      // HTML template for Admin Notification
      const adminHtml = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e0; border-radius: 8px; overflow: hidden; color: #2d3748; background-color: #ffffff;">
          <div style="background-color: #2D3A55; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">[New Booking] Premium Advisory Consultation</h1>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <p style="font-size: 14px; line-height: 1.6; margin-top: 0; color: #2D3A55;">Hello Administrator,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #4a5568;">An enterprise partner has booked a premium advisory consultation session. Details are compiled below:</p>
            
            <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-radius: 6px; padding: 18px; margin: 20px 0;">
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #718096; width: 140px; font-weight: bold;">Client Liaison:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-weight: bold;">${clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Corporate Email:</td>
                  <td style="padding: 6px 0; color: #2d3748;"><a href="mailto:${clientEmail}" style="color: #3182ce; text-decoration: none;">${clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Company Name:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Phone Number:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Advisory Stream:</td>
                  <td style="padding: 6px 0; color: #3182ce; font-weight: bold;">${serviceStream}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Requested Date:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-weight: bold;">${consultationDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Time Slot:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-family: monospace;">${timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold;">Urgency Level:</td>
                  <td style="padding: 6px 0; color: #e53e3e; font-weight: bold;">${urgency}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096; font-weight: bold; vertical-align: top;">Scope & Notes:</td>
                  <td style="padding: 6px 0; color: #2d3748; white-space: pre-wrap; line-height: 1.5; font-family: inherit;">${notes}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 24px; margin-bottom: 8px;">
              <a href="https://ais-dev-embgwc3d6jtpc7zwvrbpqz-970488046071.asia-east1.run.app/admin" style="background-color: #2D3A55; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 4px; display: inline-block;">Manage Consultation Bookings</a>
            </div>
          </div>
        </div>
      `;

      // 1. Send Client Confirmation Email
      if (clientEmail) {
        const clientMailInfo = await transporter.sendMail({
          from: `"IQzyme Advisory" <no-reply@iqzyme-regulatory.com>`,
          to: clientEmail,
          subject: "Confirmed: Consultation Booking Scheduled - IQzyme Advisory",
          text: `Dear ${clientName},\n\nWe are pleased to confirm that your premium business audit has been successfully scheduled.\n\nSession Parameters:\n- Advisory Stream: ${serviceStream}\n- Date: ${consultationDate}\n- Time Slot: ${timeSlot}\n- Urgency: ${urgency}\n\nBest regards,\nIQzyme Advisory Team`,
          html: clientHtml
        });
        console.log(`Client confirmation sent: ${clientMailInfo.messageId}. URL: ${nodemailer.getTestMessageUrl(clientMailInfo) || 'N/A'}`);
      }

      // 2. Send Admin Notification Email
      const adminMailInfo = await transporter.sendMail({
        from: `"IQzyme Portal" <no-reply@iqzyme-regulatory.com>`,
        to: adminEmail,
        subject: `[NEW CONSULTATION BOOKING] ${companyName} - ${serviceStream}`,
        text: `Hello Administrator,\n\nA new advisory consultation session has been booked.\n\nClient: ${clientName} (${companyName})\nPhone: ${phone}\nStream: ${serviceStream}\nDate: ${consultationDate} @ ${timeSlot}\nUrgency: ${urgency}\nNotes: ${notes}`,
        html: adminHtml
      });
      console.log(`Admin notification sent: ${adminMailInfo.messageId}. URL: ${nodemailer.getTestMessageUrl(adminMailInfo) || 'N/A'}`);

    } catch (err) {
      console.error("Error dispatching consultation booking emails:", err);
    }
  });

/**
 * HTTPS Callable function to get system statistics (Only for admin roles)
 */
export const getSystemStats = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // Check if user is an admin
  const userToken = context.auth.token;
  if (!userToken.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only administrator accounts can query system metrics."
    );
  }

  try {
    const bookingsSnap = await db.collection("bookings").count().get();
    const messagesSnap = await db.collection("contactMessages").count().get();
    const consultationSnap = await db.collection("consultationRequests").count().get();
    const usersSnap = await db.collection("users").count().get();

    return {
      status: "success",
      metrics: {
        totalBookings: bookingsSnap.data().count,
        totalContactMessages: messagesSnap.data().count + consultationSnap.data().count,
        totalRegisteredUsers: usersSnap.data().count,
      },
    };
  } catch (error) {
    console.error("Error retrieving system statistics:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to query database metrics."
    );
  }
});
