// config/mail.config.mjs

const SibApiV3Sdk = require("sib-api-v3-sdk");
const dotenv = require("dotenv");

dotenv.config();
// console.log("ENV Mail", process.env.EMAIL);
//  Setup Brevo client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// kush testing for volunteer template
// const client = SibApiV3Sdk.ApiClient.instance;
// client.authentications["api-key"].apiKey = process.env.KUSH_BRAVO_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

//  MAIN FUNCTION
exports.sendEmailFromBravo = async (name, email) => {
  // console.log("emails", email);
  // console.log("emails data", data);

  try {
    const res = await tranEmailApi.sendTransacEmail({
      sender: {
        email: `${process.env.BREVO_MAIL}`,
        name: "Kush Bhardwaj",
      },

      to: [{ email }],

      templateId: 1,
      params: {
        FIRSTNAME: name,
        year: new Date().getFullYear(),
      },
    });

    console.log("✅ Email sent:", res);
    return res;
  } catch (err) {
    console.error("❌ Email error:", err.response?.body || err);
  }
};
