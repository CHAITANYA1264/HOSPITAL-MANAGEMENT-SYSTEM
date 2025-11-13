const express = require("express");
const { AdminModel } = require("../models/Admin.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { NurseModel } = require("../models/Nurse.model");
const { DoctorModel } = require("../models/Doctor.model");
const { PatientModel } = require("../models/Patient.model");
require("dotenv").config(); 
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const admins = await AdminModel.find();
    res.status(200).send(admins);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await AdminModel.findOne({ email });
    if (admin) {
      return res.send({
        message: "Admin already exists",
      });
    }
    let value = new AdminModel(req.body);
    await value.save();
    const data = await AdminModel.findOne({ email });
    return res.send({ data, message: "Registered" });
  } catch (error) {
    res.send({ message: "error" });
  }
});

router.post("/login", async (req, res) => {
  const { adminID, password } = req.body;
  try {
    const admin = await AdminModel.findOne({ adminID, password });

    if (admin) {
      const token = jwt.sign({ foo: "bar" }, process.env.key, {
        expiresIn: "24h",
      });
      res.send({ message: "Successful", user: admin, token: token });
    } else {
      res.send({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.log({ message: "Error" });
    console.log(error);
  }
});

router.patch("/:adminId", async (req, res) => {
  const id = req.params.adminId;
  const payload = req.body;
  try {
    const admin = await AdminModel.findByIdAndUpdate({ _id: id }, payload);
    if (!admin) {
      res.status(404).send({ msg: `Admin with id ${id} not found` });
    }
    res.status(200).send(`Admin with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:adminId", async (req, res) => {
  const id = req.params.adminId;
  try {
    const admin = await AdminModel.findByIdAndDelete({ _id: id });
    if (!admin) {
      res.status(404).send({ msg: `Admin with id ${id} not found` });
    }
    res.status(200).send(`Admin with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

router.post("/password", (req, res) => {
  const { email, userId, password } = req.body;

  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // the 16-character app password
  },
});


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account ID and Password",
    text: `This is your User Id : ${userId} and  Password : ${password} .`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.send(error);
    }
    return res.send("Password reset email sent");
  });
});

router.post("/forgot", async (req, res) => {
  console.log("Incoming forgot request:", req.body);
  try {
    const { email, type } = req.body;
    if (!email || !type) {
      return res.status(400).send({ message: "Missing email or type" });
    }
    console.log("Incoming forgot request:", req.body);

    let user, userId, password;

    if (type === "nurse") {
      user = await NurseModel.findOne({ email });
      userId = user?.nurseID;
      password = user?.password;
      console.log("Found user:", user);
    } else if (type === "patient") {
      user = await PatientModel.findOne({ email });
      userId = user?.patientID;
      password = user?.password;
    } else if (type === "doctor") {
      user = await DoctorModel.findOne({ email });
      userId = user?.docID;
      password = user?.password;
    } else if (type === "admin") {
      user = await AdminModel.findOne({ email });
      userId = user?.adminID;
      password = user?.password;
    } else {
      return res.status(400).send({ message: "Invalid user type" });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // the 16-character app password
  },
});

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account ID and Password",
      text: `This is your User ID: ${userId} and Password: ${password}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res.status(500).send({ message: "Failed to send email" });
      }
      return res.send({ message: "Account details sent successfully!" });
    });
  } catch (error) {
    console.error("Forgot password internal error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = router;
