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

      const token = jwt.sign({email : user.email},process.env.JWT_SECRET)

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

    const user = await userModel.findOne({ email: decode.email });

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
<html>
<head>
  <title>Email Verified</title>
  <style>
    body {
      font-family: Arial;
      background:#f4f6f8;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
    }
    .card {
      background:#fff;
      padding:40px;
      border-radius:10px;
      text-align:center;
    }
    .btn {
      display:inline-block;
      margin-top:20px;
      padding:12px 20px;
      background:#2563eb;
      color:#fff;
      text-decoration:none;
      border-radius:5px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>🎉 Email Verified!</h2>
    <p>Hello ${username}, your email has been verified.</p>

    <p>Welcome to <b>Cognify AI</b> 🚀</p>

    <a href="http://localhost:3000/login" class="btn">
      Go to Login
    </a>
  </div>
</body>
</html>
`;

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