const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
            <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%); border-radius:16px; overflow:hidden; border:1px solid rgba(99,102,241,0.2);">
              
              <!-- Header -->
              <tr>
                <td style="padding:40px 40px 20px; text-align:center;">
                  <div style="width:60px; height:60px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:14px; margin:0 auto 20px; line-height:60px; font-size:28px;">
                    📧
                  </div>
                  <h1 style="color:#f1f5f9; font-size:26px; margin:0 0 8px; font-weight:600;">
                    Thank You, ${lead.name}!
                  </h1>
                  <p style="color:#94a3b8; font-size:15px; margin:0;">
                    We've received your submission
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:20px 40px;">
                  <div style="background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.15); border-radius:12px; padding:24px;">
                    <p style="color:#cbd5e1; font-size:15px; line-height:1.7; margin:0 0 16px;">
                      Hi <strong style="color:#a5b4fc;">${lead.name}</strong>,
                    </p>
                    <p style="color:#cbd5e1; font-size:15px; line-height:1.7; margin:0 0 16px;">
                      Thank you for reaching out to us. We've received your requirement and our team will review it shortly.
                    </p>
                    <div style="background:rgba(139,92,246,0.1); border-left:3px solid #8b5cf6; border-radius:0 8px 8px 0; padding:16px 20px; margin:16px 0;">
                      <p style="color:#94a3b8; font-size:13px; margin:0 0 6px; text-transform:uppercase; letter-spacing:1px;">
                        Your Requirement
                      </p>
                      <p style="color:#e2e8f0; font-size:15px; margin:0; font-style:italic;">
                        "${lead.requirement}"
                      </p>
                    </div>
                    <p style="color:#cbd5e1; font-size:15px; line-height:1.7; margin:16px 0 0;">
                      We'll get back to you within 24 hours with a personalized solution.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td style="padding:20px 40px; text-align:center;">
                  <a href="${trackableLinkUrl}" style="display:inline-block; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#ffffff; text-decoration:none; padding:14px 36px; border-radius:10px; font-size:15px; font-weight:600; letter-spacing:0.5px;">
                    Learn More About Our Solutions →
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px 32px; text-align:center; border-top:1px solid rgba(99,102,241,0.15);">
                  <p style="color:#64748b; font-size:13px; margin:0;">
                    Warm regards,<br>
                    <strong style="color:#94a3b8;">The LeadTracker Team</strong>
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
