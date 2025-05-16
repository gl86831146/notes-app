import express from "express";
import {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    getNotesByCategory,
    updateFavoriteStatus,
    getUserStats,
    getDeletedNotes,
    restoreNote,
    permanentDeleteNote
} from "../controllers/noteController.js";

const router = express.Router();

// 回收站相关路由
router.get("/deleted/:userId", getDeletedNotes);
router.put("/restore/:id", restoreNote);
router.delete("/permanent-delete/:id", permanentDeleteNote);

// 原有路由
router.get("/stats/:userId", getUserStats);
router.get("/user/:userId", getNotes);
router.get("/categories/:userId/:categoryId", getNotesByCategory);
router.put("/:id/favorite", updateFavoriteStatus);
router.post("/", createNote);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;