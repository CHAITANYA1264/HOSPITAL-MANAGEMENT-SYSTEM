const express = require("express");
const { PatientModel } = require("../models/Patient.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { ReportModel } = require("../models/Report.model");
const nodemailer = require("nodemailer");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const patients = await PatientModel.find();
    res.status(200).send({ patients });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

// This register route will be used when adding a patient via patient or doctor or admin
router.post("/register", async (req, res) => {
  const { email, name } = req.body;
  try {
    const patient = await PatientModel.findOne({ email });
    if (patient) {
      return res.send({
        message: "Patient already exists",
        id: patient.patientID,
      });
    }

    const newPatient = new PatientModel(req.body);
    await newPatient.save();

    // ✅ Send registration email
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
      from: `"Hospital Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Hospital Management System",
      text: `Dear ${name || "Patient"},\n\nYour registration was successful.\nYour Patient ID is ${newPatient.patientID}.\n\nThank you,\nHospital Management Team.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.send({ id: newPatient.patientID, message: "Patient registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Something went wrong while registering the patient" });
  }
});


router.post("/login", async (req, res) => {
  const { patientID, password } = req.body;
  try {
    const patient = await PatientModel.findOne({ patientID, password });

    if (patient) {
      const token = jwt.sign({ foo: "bar" }, process.env.key, {
        expiresIn: "24h",
      });
      let email = patient.email;
      let report = await ReportModel.find({ email });
      res.send({
        message: "Login Successful.",
        user: patient,
        token: token,
        report,
      });
    } else {
      res.send({ message: "Wrong credentials, Please try again." });
    }
  } catch (error) {
    console.log({ message: "Error occurred, unable to Login." });
    console.log(error);
  }
});

// Only Admin should be able to update or delete patient
router.patch("/:patientId", async (req, res) => {
  const id = req.params.patientId;
  const payload = req.body;
  try {
    const patient = await PatientModel.findByIdAndUpdate({ _id: id }, payload);
    if (!patient) {
      res.status(404).send({ msg: `Patient with id ${id} not found` });
    }
    res.status(200).send(`Patient with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:patientId", async (req, res) => {
  const id = req.params.patientId;
  try {
    const patient = await PatientModel.findByIdAndDelete({ _id: id });
    if (!patient) {
      res.status(404).send({ msg: `Patient with id ${id} not found` });
    }
    res.status(200).send(`Patient with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;
