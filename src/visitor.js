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

    // Correct call
    const sent = await SentMail(email, subject, " ", sentHTML(name));
    return res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ success: false, message: error });
  }
};
