const http = require("http");
const fs = require("fs");
const { generateToken } = require("./utils/auth");

// Read the local templates.json which has the updated data
const templates = JSON.parse(fs.readFileSync("./data/templates.json", "utf8"));

// Generate a valid admin token
const token = generateToken({ username: "admin" });

async function updateTemplate(tpl) {
  const body = JSON.stringify({
    name: tpl.name,
    category: tpl.category,
    categoryLabel: tpl.categoryLabel,
    preview: tpl.preview,
    status: tpl.status,
    videoUrl: tpl.videoUrl || "",
    sampleMessage: tpl.sampleMessage || "",
    photos: tpl.photos || [],
    features: tpl.features || [],
  });

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/templates/" + tpl.id,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: "Bearer " + token,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          console.log("[" + tpl.id + "] Status:", res.statusCode, data.substring(0, 200));
          resolve();
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log("Updating " + templates.length + " templates in MongoDB via running server API...");
  console.log("Token:", token.substring(0, 30) + "...");
  for (const t of templates) {
    await updateTemplate(t);
  }
  console.log("Done! All templates synced to MongoDB.");
})();
