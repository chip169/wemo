const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

// Helper to ensure data directory and files exist
const initStorage = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const defaultFiles = {
    "gifts.json": "[]",
    "orders.json": "[]",
    "nfc.json": "[]",
    "messages.json": "[]",
    "settings.json": "{}",
    "templates.json": JSON.stringify([
      {
        id: "love-romantic",
        name: "Mãi Yêu Thương (Mạng Lưới 3D)",
        category: "romance",
        categoryLabel: "Tình yêu & Lãng mạn",
        usageCount: 378,
        status: "active",
        preview: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
        videoUrl: "",
        sampleMessage: "Anh/Em yêu, mỗi khoảnh khắc bên em/anh đều là một trang ký ức đẹp nhất trong cuốn sách cuộc đời. Cảm ơn em/anh đã là ánh nắng của ngày tôi, là bến bờ của những giông tố. Tôi yêu em/anh mãi mãi."
      },
      {
        id: "solid-heart",
        name: "Mẫu Tinh Cầu 3D Vũ Trụ",
        category: "romance",
        categoryLabel: "Tình yêu & Lãng mạn",
        usageCount: 12,
        status: "active",
        preview: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400",
        videoUrl: "",
        sampleMessage: "Em ơi, một năm bên nhau là một năm anh cảm thấy mình là người hạnh phúc nhất thế giới. Cảm ơn em đã bước vào cuộc sống của anh và vẽ nên bức tranh tình yêu lấp lánh như ngàn tinh tú. Anh yêu em mãi mãi! 💖"
      }
    ], null, 2),
  };

  Object.entries(defaultFiles).forEach(([file, defaultContent]) => {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, defaultContent, "utf8");
    }
  });
};

// Initialize immediately on start
initStorage();

// Read JSON File Asynchronously
const readJsonFile = async (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file ${filename}:`, err);
    return [];
  }
};

// Write queues to prevent concurrent write collisions (race conditions)
const writeQueues = {};

const writeJsonFile = async (filename, data) => {
  if (!writeQueues[filename]) {
    writeQueues[filename] = Promise.resolve();
  }

  // Chain the new write operation to the file's queue
  const nextWrite = writeQueues[filename]
    .then(async () => {
      const filePath = path.join(DATA_DIR, filename);
      const tempPath = `${filePath}.tmp`;
      
      // Perform atomic-like write: write to temp file then rename
      await fs.promises.writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
      await fs.promises.rename(tempPath, filePath);
      return true;
    })
    .catch((err) => {
      console.error(`Error writing file ${filename}:`, err);
      return false;
    });

  writeQueues[filename] = nextWrite;
  return nextWrite;
};

module.exports = { readJsonFile, writeJsonFile, initStorage };
