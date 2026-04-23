const nodemailer = require('nodemailer');

// ✅ Transporter inside same file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email server error:', error);
  } else {
    console.log('✅ Email server ready');
  }
});


// ✅ Base Email Template
const baseTemplate = (content) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
      }
      .header {
        background: #111827;
        color: #fff;
        padding: 20px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
      }
      .content {
        padding: 30px;
        color: #333;
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background: #2563eb;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Backend Ladger</div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Backend Ladger
      </div>
    </div>
  </body>
  </html>
  `;
};


// ✅ Generic Send Function
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ladger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('📩 Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};


// ✅ Registration Email
const sendRegistrationMail = async (user) => {
  const content = `
    <h2>Welcome ${user.username} 👋</h2>
    <p>Your account has been created successfully.</p>
    <a href="http://localhost:3000/login" class="btn">Login</a>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Welcome to Backend Ladger 🎉',
    html: baseTemplate(content),
    text: `Welcome ${user.username}, your account is created.`,
  });
};


// ✅ Login Email
const sendLoginMail = async (user) => {
  const content = `
    <h2>Hello ${user.username}</h2>
    <p>You just logged into your account.</p>
    <p>If this wasn't you, secure your account.</p>
    <a href="#" class="btn">Secure Account</a>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Login Alert 🔐',
    html: baseTemplate(content),
    text: `Login detected`,
  });
};


module.exports = {
  sendEmail,
  sendRegistrationMail,
  sendLoginMail,
};