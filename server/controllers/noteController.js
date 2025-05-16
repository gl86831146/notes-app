import pool from "../config/db.js";

// 创建笔记
export const createNote = async (req, res) => {
  try {
    const { userId, title, content, categoryId, tags } = req.body;
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content, category_id, tags) VALUES (?, ?, ?, ?, ?)",
      [userId, title, content, categoryId, JSON.stringify(tags)]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      title,
      content,
      categoryId,
      tags,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取笔记列表（包含收藏筛选）
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { favorite } = req.query;
    
    let query = "SELECT * FROM notes WHERE user_id = ? AND deleted_at IS NULL";
    const params = [userId];

    if (favorite === 'true') {
      query += " AND is_favorite = 1";
    }

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新笔记收藏状态
export const updateFavoriteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFavorite } = req.body;
    await pool.query(
      "UPDATE notes SET is_favorite = ? WHERE id = ?",
      [isFavorite ? 1 : 0, id]
    );
    // 获取更新后的笔记信息
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    res.status(200).json({
      message: isFavorite ? "笔记已收藏" : "已取消收藏",
      note: rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除单独的 getFavorites 函数，因为已经合并到 getNotes 中
export const getNotesByCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND category_id = ?",
      [userId, categoryId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取单个笔记
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ errors: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新笔记
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId, tags } = req.body;
    await pool.query(
      "UPDATE notes SET title = ?, content = ?, category_id = ?, tags = ? WHERE id = ?",
      [title, content, categoryId, JSON.stringify(tags), id]
    );
    res.status(200).json({ id, title, content, categoryId, tags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 软删除笔记（移到回收站）
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE notes SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );
    res.status(200).json({ message: "Note moved to recycle bin" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取已删除的笔记
export const getDeletedNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND deleted_at IS NOT NULL",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 恢复已删除的笔记
export const restoreNote = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE notes SET deleted_at = NULL WHERE id = ?",
      [id]
    );
    res.status(200).json({ message: "Note restored" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 永久删除笔记
export const permanentDeleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notes WHERE id = ?", [id]);
    res.status(200).json({ message: "Note permanently deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取用户统计数据
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 获取笔记总数
    const [totalNotesResult] = await pool.query(
      "SELECT COUNT(*) as total FROM notes WHERE user_id = ?",
      [userId]
    );
    
    // 获取收藏笔记数
    const [favoriteNotesResult] = await pool.query(
      "SELECT COUNT(*) as total FROM notes WHERE user_id = ? AND is_favorite = 1",
      [userId]
    );
    
    // 从 categories 表获取分类总数
    const [totalCategoriesResult] = await pool.query(
      "SELECT COUNT(*) as total FROM categories",
      []
    );

    res.status(200).json({
      totalNotes: totalNotesResult[0].total,
      favoriteNotes: favoriteNotesResult[0].total,
      totalCategories: totalCategoriesResult[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};