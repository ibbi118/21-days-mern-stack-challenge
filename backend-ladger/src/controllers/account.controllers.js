const accountModel = require("../models/account.model");

async function accountCreation(req, res) {
  try {
    const user = req.user;

    // Safety check
    if (!user || !user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Prevent duplicate account
    const existingAccount = await accountModel.findOne({
      user: user._id,
    });

    if (existingAccount) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    // Create account
    const account = await accountModel.create({
      user: user._id,
    });

    return res.status(201).json({
      message: "Account Created Successfully",
      account,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  accountCreation,
};