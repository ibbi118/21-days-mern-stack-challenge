import nodemailer from "nodemailer";
import crypto from "crypto";

// ✅ Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email server error:", error);
  } else {
    console.log("✅ Email server ready");
  }
});


// ✅ Base Template
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; background:#f4f6f8; }
    .container { max-width:600px; margin:auto; background:#fff; border-radius:10px; }
    .header { background:#111827; color:#fff; padding:20px; text-align:center; font-size:22px; }
    .content { padding:30px; }
    .btn { padding:12px 20px; background:#2563eb; color:#fff; text-decoration:none; border-radius:5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Cognify AI</div>
    <div class="content">${content}</div>
  </div>
</body>
</html>
`;


// ✅ Generic Email
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({
      from: `"Cognify AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};



// ✅ 🔥 Registration Email (WITH VERIFY LINK)
export const sendRegistrationMail = async (user,token) => {

  // generate token

  // 👉 SAVE THIS TOKEN IN DB (important)
  // user.verifyToken = token;
  // await user.save();

  const verifyLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

  const content = `
    <h2>Welcome ${user.username} 👋</h2>

    <p>You're one step away from unlocking <b>Cognify AI</b> — your intelligent search & AI assistant.</p>

    <p>Click below to verify your email and continue:</p>

    <a href="${verifyLink}" class="btn">Verify Email</a>

    <p style="margin-top:20px;">After verification, you'll be redirected to login.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Verify your email - Cognify AI 🚀",
    html: baseTemplate(content),
    text: `Verify your email: ${verifyLink}`,
  });
};



// ✅ 🔐 Login Email (Cognify branding)
export const sendLoginMail = async (user) => {

  const content = `
    <h2>Hello ${user.username} 👋</h2>

    <p>You have successfully logged into <b>Cognify AI</b>.</p>

    <p>Cognify is your AI-powered search assistant that helps you explore answers, insights, and knowledge instantly.</p>

    <p>If this wasn't you, please secure your account immediately.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Login Alert - Cognify AI 🔐",
    html: baseTemplate(content),
    text: "New login detected",
  });
};