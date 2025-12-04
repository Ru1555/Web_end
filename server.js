// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads');
const DB_FILE = path.join(__dirname, 'data', 'photos.db');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DB_FILE))) fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

const db = new sqlite3.Database(DB_FILE);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    filename TEXT NOT NULL,
    caption TEXT,
    alt TEXT,
    width INTEGER,
    height INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER DEFAULT 0
  )`);
});

// 靜態檔
app.use('/', express.static(PUBLIC_DIR));

// 上傳設定（multer）
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

// API: 取得全部照片（JSON）
app.get('/api/photos', (req, res) => {
  db.all('SELECT * FROM photos ORDER BY "order" ASC, created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: 取得單張（可用於 metadata）
app.get('/api/photos/:id', (req, res) => {
  db.get('SELECT * FROM photos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// API: 上傳照片（multipart/form-data） - for admin
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const { title = '', caption = '', alt = '' } = req.body;
  const filename = path.basename(req.file.path);
  // 儲存基本資料（略過 width/height：可用 sharp 取得，但為了簡潔先不加）
  db.run(
    `INSERT INTO photos (title, filename, caption, alt) VALUES (?, ?, ?, ?)`,
    [title, filename, caption, alt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID, filename });
    }
  );
});

// API: 刪除（簡單範例）
app.delete('/api/photos/:id', (req, res) => {
  db.get('SELECT filename FROM photos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    const file = path.join(UPLOAD_DIR, row.filename);
    fs.unlink(file, () => {
      db.run('DELETE FROM photos WHERE id = ?', [req.params.id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true });
      });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
