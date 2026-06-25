const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// 1x1 transparent GIF pixel (base64)
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

// Email open tracking — serves a tracking pixel
router.get("/open/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead && !lead.opened) {
      lead.opened = true;
      lead.openedAt = new Date();
      await lead.save();
      console.log(`📧 Email opened by: ${lead.name} (${lead.email})`);
    }
  } catch (error) {
    console.error("Open tracking error:", error.message);
  }

  // Always return the pixel regardless of DB success
  res.set({
    "Content-Type": "image/gif",
    "Content-Length": TRANSPARENT_GIF.length,
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });
  res.end(TRANSPARENT_GIF);
});

// Link click tracking — records click then redirects
router.get("/click/:id", async (req, res) => {
  const redirectUrl = req.query.redirect || "https://google.com";

  try {
    const lead = await Lead.findById(req.params.id);

    if (lead && !lead.clicked) {
      lead.clicked = true;
      lead.clickedAt = new Date();
      await lead.save();
      console.log(`🔗 Link clicked by: ${lead.name} (${lead.email})`);
    }
  } catch (error) {
    console.error("Click tracking error:", error.message);
  }

  // Always redirect regardless of DB success
  res.redirect(302, redirectUrl);
});

module.exports = router;
