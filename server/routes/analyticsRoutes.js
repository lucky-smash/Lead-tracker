const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

router.get("/", async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const emailsSent = await Lead.countDocuments({ emailSent: true });
    const emailsOpened = await Lead.countDocuments({ opened: true });
    const linksClicked = await Lead.countDocuments({ clicked: true });

    const openRate = emailsSent > 0
      ? Math.round((emailsOpened / emailsSent) * 100)
      : 0;

    const clickRate = emailsSent > 0
      ? Math.round((linksClicked / emailsSent) * 100)
      : 0;

    res.json({
      totalLeads,
      emailsSent,
      emailsOpened,
      openRate,
      linksClicked,
      clickRate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching analytics",
      error: error.message,
    });
  }
});

module.exports = router;
