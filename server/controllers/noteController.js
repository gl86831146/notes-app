import pool from "../config/db.js";

// 创建笔记
export const createNote = async (req, res) => {
  try {
    const { userid, title, content, categoryid, tags } = req.body;
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content, category_id, tags) VALUES (?, ?, ?, ?, ?)",
      [userid, title, content, categoryid, JSON.stringify(tags)]
    );
    res.status(201).json({
      id: result.insertId,
      userid,
      title,
      content,
      categoryid,
      tags,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取笔记列表
export const getNotes = async (req, res) => {
  try {
    const { userid } = req.params;
    const [rows] = await pool.query("SELECT * FROM notes WHERE user_id = ?", [userid]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据分类获取笔记列表
export const getNotesByCategory = async (req, res) => {
  try {
    const { userid, categoryid } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND category_id = ?",
      [userid, categoryid]
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
    const { title, content, categoryid, tags } = req.body;
    await pool.query(
      "UPDATE notes SET title = ?, content = ?, category_id = ?, tags = ? WHERE id = ?",
      [title, content, categoryid, JSON.stringify(tags), id]
    );
    res.status(200).json({ id, title, content, categoryid, tags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除笔记
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notes WHERE id = ?", [id]);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};