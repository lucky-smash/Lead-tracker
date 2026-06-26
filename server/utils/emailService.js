const nodemailer = require("nodemailer");

const transporterConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

// If Ethereal test email is used, override with Ethereal SMTP settings
if (process.env.EMAIL_USER && process.env.EMAIL_USER.endsWith("@ethereal.email")) {
  transporterConfig.service = undefined;
  transporterConfig.host = "smtp.ethereal.email";
  transporterConfig.port = 587;
  transporterConfig.secure = false;
}

const transporter = nodemailer.createTransport(transporterConfig);

const sendLeadEmail = async (lead) => {
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
  const redirectUrl = process.env.REDIRECT_URL || "https://google.com";

  const trackingPixelUrl = `${serverUrl}/api/track/open/${lead._id}`;
  const trackableLinkUrl = `${serverUrl}/api/track/click/${lead._id}?redirect=${encodeURIComponent(redirectUrl)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#0f0f13; font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f13; padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%); border-radius:16px; overflow:hidden; border:1px solid rgba(99,102,241,0.2); text-align: left;">
              
              <!-- Body -->
              <tr>
                <td style="padding:40px; color:#cbd5e1; font-size:16px; line-height:1.8;">
                  <p style="margin:0 0 16px; font-size:18px; color:#ffffff;">Hi <strong>${lead.name}</strong>,</p>
                  <p style="margin:0 0 16px;">Thank you for reaching out.</p>
                  <p style="margin:0 0 24px;">We received your requirement: <strong style="color:#a5b4fc;">"${lead.requirement}"</strong></p>
                  
                  <!-- CTA Button -->
                  <div style="margin:24px 0 32px;">
                    <a href="${trackableLinkUrl}" style="display:inline-block; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:600; font-size:15px; box-shadow:0 4px 12px rgba(99,102,241,0.3);">
                      Learn more
                    </a>
                  </div>
                  
                  <p style="margin:0; color:#94a3b8; font-size:14px; border-top:1px solid rgba(99,102,241,0.15); padding-top:20px;">
                    Regards,<br>
                    <strong style="color:#ffffff;">Team</strong>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

      <!-- Tracking Pixel (invisible) -->
      <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"LeadTracker" <${process.env.EMAIL_USER}>`,
    to: lead.email,
    subject: `Hi ${lead.name}, we received your requirement!`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendLeadEmail };
