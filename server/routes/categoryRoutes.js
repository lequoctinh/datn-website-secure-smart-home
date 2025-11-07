const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middlewares/auth");
const { ensureAuth, requireRole } = require("../middlewares/authorize");

router.use(auth, ensureAuth, requireRole("admin", "nhan_vien"));

router.get("/", async (req, res, next) => {
try {
    const [rows] = await pool.query(
    "SELECT id, ten_danh_muc FROM danh_muc ORDER BY ten_danh_muc ASC"
    );
    res.json({ items: rows });
} catch (e) { next(e); }
});

let categories = [
    { id: 1, name: 'KHÓA CỬA THÔNG MINH' },
    { id: 2, name: 'CỬA NHỰA COMPOSITE' },
    { id: 3, name: 'CAMERA GIÁM SÁT' },
    { id: 4, name: 'PHỤ KIỆN' },
  ];
  
  router.get('/', (req, res) => {
    res.json(categories);
  });
  
  router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const category = categories.find(c => c.id === id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json(category);
  });
  
  router.post('/', (req, res) => {
    const newCategory = { id: Date.now(), name: req.body.name };
    categories.push(newCategory);
    res.status(201).json(newCategory);
  });
  
  router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  
    categories[index].name = req.body.name;
    res.json({ message: 'Cập nhật thành công', category: categories[index] });
  });
  
  router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    categories = categories.filter(c => c.id !== id);
    res.json({ message: 'Đã xóa danh mục' });
  });

module.exports = router;
