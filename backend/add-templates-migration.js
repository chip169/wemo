require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Template = require("./models/Template");

async function migrate() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in .env! Cannot run migration.");
    process.exit(1);
  }

  // Load templates from data/templates.json
  const templatesPath = path.join(__dirname, "data", "templates.json");
  if (!fs.existsSync(templatesPath)) {
    console.error(`❌ templates.json not found at ${templatesPath}!`);
    process.exit(1);
  }

  let templates;
  try {
    templates = JSON.parse(fs.readFileSync(templatesPath, "utf8"));
  } catch (err) {
    console.error("❌ Error parsing templates.json:", err.message);
    process.exit(1);
  }

  console.log(`Loaded ${templates.length} templates from templates.json.`);
  console.log("Connecting to MongoDB Atlas...");
  
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB Atlas successfully.");

    for (const tpl of templates) {
      console.log(`Processing template: ${tpl.id} - "${tpl.name}"...`);
      // Upsert the template (insert if not exists, update if exists)
      const result = await Template.findOneAndUpdate(
        { id: tpl.id },
        {
          id: tpl.id,
          name: tpl.name,
          category: tpl.category,
          categoryLabel: tpl.categoryLabel,
          usageCount: tpl.usageCount || 0,
          status: tpl.status || "active",
          preview: tpl.preview,
          videoUrl: tpl.videoUrl || "",
          sampleMessage: tpl.sampleMessage || "",
          photos: tpl.photos || [],
          features: tpl.features || []
        },
        { new: true, upsert: true }
      );
      console.log(`✨ Upserted template: ${result.id} successfully.`);
    }

    // Output current state in MongoDB
    const count = await Template.countDocuments();
    console.log(`\n🎉 Migration completed! Total templates now in MongoDB Atlas: ${count}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Migration failed with error:", err);
  }
}

migrate();
