import userModel from "../models/user.models.js";
import { sendRegistrationMail,sendLoginMail } from "../services/email.services.js";
import jwt from "jsonwebtoken"


export async function register(req,res,next){
    try{
      const{username,email,password} = req.body
      const isExists = await userModel.findOne({
        $or : [{
            email
        },{
            username
        }]
      }).select("-password")
    
      if(isExists){
        return res.status(400).json({
            message : "This email or username already Exit"
        })
      }

      const user = await userModel.create({
        email,username,password
      })

      const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
     { expiresIn: "10m" }
      );

      user.verifyToken = token;
      user.verifyTokenExpiry = Date.now() + 10 * 60 * 1000;

       await user.save();

      sendRegistrationMail(user,token)

      res.status(201).json({
        message: "User Register Successfully",
        user
      })
    

    }catch(err){
       err.statusCode = 400;
       next(err)
    }
}



export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message: "Email not verified",
      });
    }

    // ✅ compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "lax",
    });

    // ✅ send login mail (non-blocking)
    sendLoginMail(user).catch(console.error);

    // ❌ password remove before sending
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });

  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}


export async function verifyEmail(req, res) {

  const { token } = req.query; // ✅ FIX

  try {

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
          email: decode.email,
           verifyToken: token,
           verifyTokenExpiry: { $gt: Date.now() }
     });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
      });
    }

    // ✅ FIX spelling
    user.verified = true;
    await user.save();

  const verifySuccessPage = (username) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verified – Cognify</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: #09090b;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow: hidden;
    }

    /* Mesh */
    .mesh {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,58,199,0.2) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 90%, rgba(20,184,166,0.13) 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 60% 40%, rgba(6,182,212,0.07) 0%, transparent 55%);
    }
    .grid {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 56px 56px;
      -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
    }

    /* Card */
    .card {
      position: relative; z-index: 10;
      background: rgba(18,18,22,0.88);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: 20px;
      padding: 40px 36px;
      width: 100%;
      max-width: 400px;
      text-align: center;
      animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 32px;
    }
    .logo-mark {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .logo-name {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.03em;
    }

    /* Icon cluster */
    .icon-wrap {
      position: relative;
      width: 96px; height: 96px;
      margin: 0 auto 28px;
      display: flex; align-items: center; justify-content: center;
    }
    .ring-outer, .ring-inner {
      position: absolute; inset: 0;
    }
    .ring-outer svg { animation: spin-slow 10s linear infinite; }
    .ring-inner svg { animation: spin-reverse 7s linear infinite; width: 68px; height: 68px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
    .ping {
      position: absolute; inset: 0;
      border-radius: 9999px;
      background: rgba(16,185,129,0.12);
      animation: ping-slow 2.2s cubic-bezier(0,0,0.2,1) infinite;
    }
    .center-icon {
      position: relative; z-index: 10;
      width: 56px; height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(16,185,129,0.22), rgba(6,182,212,0.18));
      border: 1px solid rgba(16,185,129,0.35);
      box-shadow: 0 0 32px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      animation: float 3.2s ease-in-out infinite;
    }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.25);
      color: #6ee7b7;
      font-size: 11px;
      font-weight: 500;
      font-family: 'Syne', sans-serif;
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 20px;
    }
    .badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 6px #34d399;
    }

    /* Heading */
    h1 {
      font-family: 'Syne', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
      line-height: 1.2;
    }
    .subtitle {
      color: #71717a;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 6px;
    }
    .username {
      color: #c4b5fd;
      font-weight: 500;
    }

    /* Email pill */
    .welcome-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.22);
      color: #c4b5fd;
      font-size: 13px;
      padding: 8px 16px;
      border-radius: 10px;
      margin: 16px 0 24px;
    }

    /* Divider */
    .divider {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 20px;
    }
    .divider::before, .divider::after {
      content: ''; flex: 1; height: 1px;
      background: rgba(255,255,255,0.08);
    }
    .divider span { font-size: 11px; color: rgba(255,255,255,0.2); }

    /* CTA Button */
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 13px;
      border-radius: 10px;
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-decoration: none;
      box-shadow: 0 0 24px rgba(124,58,237,0.35);
      transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    }
    .btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 0 36px rgba(124,58,237,0.5);
    }

    /* Features strip */
    .strip {
      display: flex;
      justify-content: space-between;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .strip-item { text-align: center; }
    .strip-stat { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; color: #d4d4d8; }
    .strip-label { font-size: 11px; color: #52525b; margin-top: 2px; }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes spin-slow    { from { transform: rotate(0deg); }  to { transform: rotate(360deg); } }
    @keyframes spin-reverse { from { transform: rotate(0deg); }  to { transform: rotate(-360deg); } }
    @keyframes ping-slow {
      0%   { transform: scale(1);   opacity: 0.5; }
      80%  { transform: scale(2.1); opacity: 0; }
      100% { transform: scale(2.1); opacity: 0; }
    }
  </style>
</head>
<body>
  <div class="mesh"></div>
  <div class="grid"></div>

  <div class="card">

    <!-- Logo -->
    <div class="logo">
      <div class="logo-mark">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" fill="white" fill-opacity="0.9"/>
          <path d="M10 6L14 8.5V13.5L10 16L6 13.5V8.5L10 6Z" fill="white" fill-opacity="0.35"/>
        </svg>
      </div>
      <span class="logo-name">Cognify</span>
    </div>

    <!-- Icon -->
    <div class="icon-wrap">
      <div class="ring-outer">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="44" stroke="url(#rg1)" stroke-width="1" stroke-dasharray="6 10" stroke-linecap="round"/>
          <defs>
            <linearGradient id="rg1" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
              <stop stop-color="#10b981" stop-opacity="0.7"/>
              <stop offset="1" stop-color="#06b6d4" stop-opacity="0.3"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="ring-inner">
        <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
          <circle cx="34" cy="34" r="30" stroke="url(#rg2)" stroke-width="1" stroke-dasharray="4 7" stroke-linecap="round"/>
          <defs>
            <linearGradient id="rg2" x1="0" y1="0" x2="68" y2="68" gradientUnits="userSpaceOnUse">
              <stop stop-color="#06b6d4" stop-opacity="0.6"/>
              <stop offset="1" stop-color="#10b981" stop-opacity="0.2"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="ping"></span>
      <div class="center-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stop-color="#6ee7b7"/>
              <stop offset="1" stop-color="#67e8f9"/>
            </linearGradient>
          </defs>
          <polyline points="20 6 9 17 4 12" stroke="url(#cg)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Badge -->
    <div class="badge">
      <span class="badge-dot"></span>
      Verified successfully
    </div>

    <!-- Heading -->
    <h1>You're all set!</h1>
    <p class="subtitle">Hello <span class="username">${username}</span>, your email has been verified.</p>
    <p class="subtitle">Welcome to <strong style="color:#e4e4e7;">Cognify AI</strong> — start thinking smarter.</p>

    <!-- Welcome pill -->
    <div class="welcome-pill">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      Account activated
    </div>

    <!-- Divider -->
    <div class="divider"><span>ready to go</span></div>

    <!-- CTA -->
    <a href="http://localhost:5173/login" class="btn">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
        <polyline points="10 17 15 12 10 7"/>
        <line x1="15" y1="12" x2="3" y2="12"/>
      </svg>
      Go to Login
    </a>

    <!-- Strip -->
    <div class="strip">
      <div class="strip-item">
        <div class="strip-stat">1M+</div>
        <div class="strip-label">tokens / mo</div>
      </div>
      <div class="strip-item">
        <div class="strip-stat">Fast</div>
        <div class="strip-label">responses</div>
      </div>
      <div class="strip-item">
        <div class="strip-stat">No ads</div>
        <div class="strip-label">ever</div>
      </div>
    </div>

  </div>
</body>
</html>
`;

// module.exports = verifySuccessPage;

    return res.send(verifySuccessPage(user.username));

  } catch (err) {
    return res.status(400).json({
      message: "Token expired or invalid",
      error: err.message,
    });
  }
}

export async function getMe(req, res) {
  try {
    const { email } = req.user;

    const user = await userModel.findOne({ email }).select("-password");

    return res.status(200).json({
      message: "User Fetch Successfully",
      user,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
}

export async function resendVerification(req, res) {
  try {
    const userId = req.body.userId; // ya token se nikal

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Already verified" });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    user.verifyToken = token;
    user.verifyTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendRegistrationMail(user, token);

    res.json({
      message: `Verification email sent to ${user.email}`
    });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
}