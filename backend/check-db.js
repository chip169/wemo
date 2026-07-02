require("dotenv").config();
const mongoose = require("mongoose");
const Template = require("./models/Template");

async function check() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not defined in .env!");
    process.exit(1);
  }
  
  console.log("Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");
    const count = await Template.countDocuments();
    console.log(`Total templates in MongoDB: ${count}`);
    const templates = await Template.find({});
    console.log("Current templates in MongoDB:");
    console.log(JSON.stringify(templates, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

check();
