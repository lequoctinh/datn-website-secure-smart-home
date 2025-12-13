router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        
        // Ví dụ query MySQL
        const sql = "SELECT * FROM products WHERE name LIKE ?";
        const searchTerm = `%${keyword}%`; // Thêm % để tìm gần đúng

        db.query(sql, [searchTerm], (err, results) => {
            if (err) throw err;
            res.json(results); // Trả về mảng kết quả
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
});