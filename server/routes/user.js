const nodemailer = require("nodemailer");
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/admin");
const validObjectID = require("../middleware/validObjectId");
const crypto = require("crypto");

require("dotenv").config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service provider, e.g., 'gmail'
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// create user
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(403)
        .send({ message: "User with given email already exists!!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const emailToken = crypto.randomBytes(64).toString("hex");

    const newUser = await new User({
      ...req.body,
      password: hashPassword,
      emailToken,
    }).save();

    // Send email verification
    const mailOptions = {
      from: `LOFI BBT ${process.env.EMAIL}`, // Replace with your email
      to: newUser.email,
      subject: "Email Verification",
      text: `Click the following link to verify your email:`,
      html: `<div style="text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #007bff; margin-bottom: 20px; font-size: 24px;">Welcome 👋 ${newUser.name}</h1>
      <p style="color: #333; font-size: 16px; line-height: 1.5em;">To complete your registration, click the following link to verify your email:</p>
      <a href='${process.env.BASEURL}/verify-email/${emailToken}' style="color: #fff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email</a>
  </div>
  
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    newUser.password = undefined;
    newUser.__v = undefined;

    res
      .status(200)
      .send({ data: newUser, message: "Account created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// get all user
router.get("/", authAdmin, async (req, res) => {
  const users = await User.find().select("-password -__v");
  res.status(200).send({ data: users });
});

// get user by id
router.get("/:id", [validObjectID, auth], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -__v");
  res.status(200).send({ data: user });
});

//  update user by id
router.put("/:id", [validObjectID, auth], async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  ).select("-password -__v");
  res.status(200).send({ data: user });
});

// delete user by id
router.delete("/:id", [validObjectID, authAdmin], async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Successfully deleted user" });
});

//  verify email
router.post("/verify-email", async (req, res) => {
  try {
    const emailToken = req.body.emailToken;
    if (!emailToken) return res.status(404).json("emailToken not found...");

    const user = await User.findOne({ emailToken });

    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();

      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });
    } else res.status(404).json("Email veification failed, invalid token! ");
  } catch (error) {
    console.log(error);
  }
});

// resend email verification
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).send({ message: "User is already verified" });
    }

    const emailToken = crypto.randomBytes(64).toString("hex");
    user.emailToken = emailToken;
    await user.save();

    // Send the new email verification
    const mailOptions = {
      from: process.env.EMAIL, // Replace with your email
      to: user.email,
      subject: "Email Verification",
      text: `Click the following link to verify your email:`,
      html: `<div>
       <a href ='http://localhost:5173/verify-email/${emailToken}'>Verify</a>
      </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .send({ message: "Error sending verification email" });
      } else {
        console.log("Email sent:", info.response);
        return res
          .status(200)
          .send({ message: "Verification email resent successfully" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
