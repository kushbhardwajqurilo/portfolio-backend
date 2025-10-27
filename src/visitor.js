const SentMail = require("./mailConfig");
const { visitorRecorModel, vistorModel } = require("./visitorMessageModel");
exports.trackVisitor = async (req, res) => {
  try {
    console.log("📡 Tracking visitor...");

    // Get visitor IP safely
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket.remoteAddress;

    if (!ip) {
      return res.status(400).json({ success: false, message: "IP not found" });
    }

    // Check if visitor already exists
    const existingVisitor = await visitorRecorModel.findOne({ ip });
    if (existingVisitor) {
      console.log("⚠️ Visitor already tracked:", ip);
      return res.status(200).json({
        success: true,
        message: "Visitor already tracked",
        data: existingVisitor,
      });
    }

    // Get location from IP
    let location = {};
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);

      location = {
        country: response.data.country || "Unknown",
        region: response.data.regionName || "Unknown",
        city: response.data.city || "Unknown",
      };
    } catch (err) {
      console.log("🌍 Could not get location", err.message);
      location = { country: "Unknown", region: "Unknown", city: "Unknown" };
    }

    // Save new visitor
    const visitor = await visitorRecorModel.create({
      ip,
      ...location,
    });

    console.log("✅ New visitor added:", ip, location);

    return res.status(200).json({
      success: true,
      message: "Visitor tracked successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("❌ Visitor tracking error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.vistorMessage = async (req, res) => {
  try {
    const validation = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };
    Object.keys(validation).forEach((val) => {
      if (req.body[val].toString().trim().length === 0 || !req.body[val]) {
        return res
          .status(400)
          .json({ success: false, message: `${val} Required` });
      }
    });
    const { name, email, subject, message } = req.body;
    const visitMessage = await vistorModel.create({
      name,
      email,
      subject,
      message,
    });
    if (!visitMessage) {
      return res.status(400).json({
        success: false,
        message: "Faild to send message",
      });
    }
    const sentHTML = (name) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Thank You for Reaching Out!</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; color: #333; margin:0; padding:0; }
      .container { max-width:600px; background:#fff; margin:40px auto; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.08); overflow:hidden; }
      .header { background: linear-gradient(135deg, #0078ff, #00c6ff); padding:20px; color:white; text-align:center; }
      .header h1 { margin:0; font-size:22px; }
      .content { padding:25px; line-height:1.6; }
      .content h2 { font-size:20px; color:#0078ff; }
      .footer { background:#f1f3f4; text-align:center; padding:15px; font-size:13px; color:#777; }
      a { color:#0078ff; text-decoration:none; }
      .signature { margin-top:20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Thank You for Contacting Me!</h1>
      </div>
      <div class="content">
        <h2>Hey ${name},</h2>
        <p>
          I just wanted to say thank you for getting in touch! 🙌<br/>
          Your message has been received successfully, and I’ll get back to you as soon as possible.
        </p>
        <p>I really appreciate you taking the time to connect — it means a lot! 💬</p>
        <div class="signature">
          <p>
            Warm regards,<br/>
            <strong>Kush Bhardwaj</strong><br/>
           
          </p>
        </div>
      </div>
      <div class="footer">
        <p>This is an automated reply. Please don’t reply to this email.<br/>
        © ${new Date().getFullYear()} Kush Bhardwaj | All Rights Reserved.</p>
      </div>
    </div>
  </body>
</html>
`;

    const adminMailTemplate = (name, email, message) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>New Portfolio Message</title>
    <style>
      body,html{margin:0;padding:0;background:#f3f4f6;font-family:Inter,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#111}
      .wrapper{max-width:700px;margin:30px auto;padding:0 16px}
      .card{background:#fff;border-radius:14px;box-shadow:0 4px 16px rgba(0,0,0,0.08);overflow:hidden}
      .header{background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff;text-align:center;padding:24px 20px}
      .header h1{margin:0;font-size:22px;font-weight:600}
      .body{padding:28px 24px}
      .body h2{margin-top:0;color:#0f172a;font-size:18px}
      .info{display:flex;flex-direction:column;gap:10px;margin:16px 0}
      .info-item{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px}
      .info-item strong{display:block;font-size:13px;color:#475569;margin-bottom:4px}
      .message-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;font-size:14px;line-height:1.6;color:#0f172a;white-space:pre-wrap}
      .footer{text-align:center;padding:18px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;background:#fafafa}
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card">
        <div class="header">
          <h1>📩 New Message from Portfolio</h1>
        </div>
        <div class="body">
          <h2>New message received</h2>

          <div class="info">
            <div class="info-item">
              <strong>👤 Name</strong>
              ${name}
            </div>
            <div class="info-item">
              <strong>✉️ Email</strong>
              ${email}
            </div>
          </div>

          <div>
            <strong style="font-size:13px;color:#475569;">💬 Message</strong>
            <div class="message-box">
${message}
            </div>
          </div>
        </div>

        <div class="footer">
          Message sent from your portfolio contact form — ${new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  </body>
</html>
`;

    // Correct call
    const sent = await SentMail(email, subject, " ", sentHTML(name));

    const sentToMe = await SentMail(
      process.env.E_EMAIL,
      subject,
      " ",
      adminMailTemplate(name, email, message)
    );
    return res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ success: false, message: error });
  }
};
