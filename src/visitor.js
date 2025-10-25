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
    return res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};
