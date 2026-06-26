const Lead = require('../models/Lead');
const { sendLeadEmail } = require('../utils/emailService');

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    // Send personalized email automatically in the background (fire-and-forget)
    // to avoid blocking the HTTP response on SMTP connection timeouts
    sendLeadEmail(lead)
      .then(async () => {
        lead.emailSent = true;
        await lead.save();
        console.log(`✅ Email sent to ${lead.email}`);
      })
      .catch((emailError) => {
        console.error(`❌ Email failed for ${lead.email}:`, emailError.message);
      });

    res.status(201).json({
      success: true,
      message: 'Lead Created',
      lead,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Error updating lead', error: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead', error: error.message });
  }
};
