const vistorModel = require("./visitorMessageModel");

exports.trackVisitor = async (req, res) => {
  try {
    console.log("hello visitor");
    // Get visitor IP
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Optional: get approximate location from IP
    let location = {};
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      location = {
        country: response.data.country,
        region: response.data.regionName,
        city: response.data.city,
      };
      console.log("loc", response);
    } catch (err) {
      console.log("Could not get location", err.message);
    }

    // Save visitor info to DB
    // const visitor = await visitorModel.create({
    //   name: "Guest", // optional, since ye form submit nahi kar raha
    //   email: "",
    //   subject: "Visitor Info",
    //   message: "Visited website",
    //   ip,
    //   location,
    // });

    // return res.status(200).json({
    //   success: true,
    //   message: "Visitor tracked successfully",
    //   visitor,
    // });
    console.log("visit", location);
  } catch (error) {
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
