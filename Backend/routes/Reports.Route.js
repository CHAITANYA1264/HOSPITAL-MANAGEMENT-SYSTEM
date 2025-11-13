const express = require("express");
const { ReportModel } = require("../models/Report.model");

const router = express.Router();

router.get("/", async (req, res) => {
  let query = req.query;
  try {
    const reports = await ReportModel.find(query);
    res.status(200).send(reports);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

router.get("/patient/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Find reports where 'email' matches patient's email
    const reports = await ReportModel.find({ email });

    if (reports.length === 0) {
      return res.status(404).send({ message: "No reports found for this email" });
    }

    res.status(200).send(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).send({ message: "Error fetching reports" });
  }
});


router.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const report = new ReportModel(payload);
    await report.save();
    res.send({ message: "Report successfully created", report });
  } catch (error) {
    res.send(error);
  }
});

router.patch("/:reportId", async (req, res) => {
  const id = req.params.reportId;
  const payload = req.body;
  try {
    const report = await ReportModel.findByIdAndUpdate({ _id: id }, payload);
    if (!report) {
      res.status(404).send({ msg: `Report with id ${id} not found` });
    }
    res.status(200).send(`Report with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:reportId", async (req, res) => {
  const id = req.params.reportId;
  try {
    const report = await ReportModel.findByIdAndDelete({ _id: id });
    if (!report) {
      res.status(404).send({ msg: `Report with id ${id} not found` });
    }
    res.status(200).send(`Report with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;
