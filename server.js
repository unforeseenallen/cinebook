/* =========================================
   CINEBOOK BACKEND SERVER
   Express + Nodemailer (auto e-ticket email)
========================================= */

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname)));  // serve frontend files

// ── Email transporter (Gmail) ──────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection on startup
transporter.verify(function (error) {
    if (error) {
        console.error("⚠  Email configuration error:", error.message);
        console.error("   Make sure you set EMAIL_USER and EMAIL_PASS in the .env file.");
    } else {
        console.log("✅ Email service is ready to send tickets.");
    }
});

// ── API: Send E-Ticket ─────────────────────
app.post("/api/send-ticket", async function (req, res) {
    try {
        const {
            email,
            movie,
            theatre,
            screen,
            date,
            time,
            seats,
            total,
            bookingId,
            paymentMethod
        } = req.body;

        // Validate required fields
        if (!email || !bookingId) {
            return res.status(400).json({ success: false, message: "Missing email or booking ID." });
        }

        // ── Build QR code data ──────────────
        const qrData = [
            "CINEBOOK E-TICKET",
            "Booking ID: " + bookingId,
            "Movie: " + movie,
            "Theatre: " + theatre,
            "Screen: " + screen,
            "Date: " + date,
            "Time: " + time,
            "Seats: " + seats,
            "Email: " + email
        ].join("\n");

        const qrUrl =
            "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
            encodeURIComponent(qrData);

        // ── Build HTML email ────────────────
        const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#1a1a2e; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a2e; padding:30px 0;">
        <tr>
            <td align="center">
                <table width="500" cellpadding="0" cellspacing="0" style="background:#16213e; border-radius:16px; overflow:hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #e94560, #c23152); padding:24px; text-align:center;">
                            <h1 style="margin:0; color:#fff; font-size:28px; letter-spacing:1px;">
                                Cine<span style="color:#ffd700;">Book</span>
                            </h1>
                            <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">
                                Your E-Ticket Confirmation
                            </p>
                        </td>
                    </tr>

                    <!-- Success Badge -->
                    <tr>
                        <td style="padding:24px 30px 8px; text-align:center;">
                            <div style="display:inline-block; background:#0f3460; border:2px solid #e94560; border-radius:50%; width:56px; height:56px; line-height:56px; font-size:28px; color:#4ecca3;">
                                ✓
                            </div>
                            <h2 style="color:#e94560; margin:12px 0 4px; font-size:20px;">Booking Confirmed!</h2>
                            <p style="color:#aaa; margin:0; font-size:13px;">Booking ID: <strong style="color:#ffd700;">${bookingId}</strong></p>
                        </td>
                    </tr>

                    <!-- Ticket Details -->
                    <tr>
                        <td style="padding:16px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f3460; border-radius:12px; overflow:hidden;">
                                <tr>
                                    <td style="padding:20px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:8px 0; color:#8a8a9a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Movie</td>
                                                <td style="padding:8px 0; color:#fff; font-size:15px; font-weight:600; text-align:right;">${movie}</td>
                                            </tr>
                                            <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.08);"></td></tr>
                                            <tr>
                                                <td style="padding:8px 0; color:#8a8a9a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Theatre</td>
                                                <td style="padding:8px 0; color:#fff; font-size:14px; text-align:right;">${theatre}</td>
                                            </tr>
                                            <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.08);"></td></tr>
                                            <tr>
                                                <td style="padding:8px 0; color:#8a8a9a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Screen</td>
                                                <td style="padding:8px 0; color:#fff; font-size:14px; text-align:right;">${screen}</td>
                                            </tr>
                                            <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.08);"></td></tr>
                                            <tr>
                                                <td style="padding:8px 0; color:#8a8a9a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Date</td>
                                                <td style="padding:8px 0; color:#fff; font-size:14px; text-align:right;">${date}</td>
                                            </tr>
                                            <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.08);"></td></tr>
                                            <tr>
                                                <td style="padding:8px 0; color:#8a8a9a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Time</td>
                                                <td style="padding:8px 0; color:#fff; font-size:14px; text-align:right;">${time}</td>
                                            </tr>
                                            <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.08);"></td></tr>
                                            <tr>
                                                <td style="padding:8px 0; color:#8a8a9a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Seats</td>
                                                <td style="padding:8px 0; color:#ffd700; font-size:14px; font-weight:600; text-align:right;">${seats}</td>
                                            </tr>
                                            <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.08);"></td></tr>
                                            <tr>
                                                <td style="padding:8px 0; color:#8a8a9a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Payment</td>
                                                <td style="padding:8px 0; color:#4ecca3; font-size:14px; text-align:right;">Paid (${paymentMethod})</td>
                                            </tr>
                                            <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.08);"></td></tr>
                                            <tr>
                                                <td style="padding:10px 0; color:#8a8a9a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Total Amount</td>
                                                <td style="padding:10px 0; color:#e94560; font-size:20px; font-weight:700; text-align:right;">₹${total}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- QR Code -->
                    <tr>
                        <td style="padding:8px 30px 20px; text-align:center;">
                            <div style="display:inline-block; background:#fff; border-radius:12px; padding:14px;">
                                <img src="${qrUrl}" width="180" height="180" alt="Ticket QR Code" style="display:block;" />
                            </div>
                            <p style="color:#8a8a9a; margin:10px 0 0; font-size:12px;">Scan this QR code at the cinema entrance</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#0f3460; padding:16px 30px; text-align:center; border-top:1px solid rgba(255,255,255,0.05);">
                            <p style="margin:0; color:#8a8a9a; font-size:12px;">
                                Thank you for booking with <strong style="color:#e94560;">CineBook</strong>!<br>
                                Please arrive 15 minutes before showtime.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        // ── Send the email ──────────────────
        const mailOptions = {
            from: '"CineBook" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: "🎬 CineBook E-Ticket — " + bookingId,
            html: htmlEmail
        };

        await transporter.sendMail(mailOptions);

        console.log("📧 E-ticket sent to " + email + " (Booking: " + bookingId + ")");
        res.json({ success: true, message: "E-ticket sent to " + email });

    } catch (error) {
        console.error("❌ Email send error details:");
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Failed to send email" });
    }
});

// ── Start Server ───────────────────────────
app.listen(PORT, function () {
    console.log("");
    console.log("🎬 CineBook Server is running!");
    console.log("   Open: http://localhost:" + PORT);
    console.log("");
});
