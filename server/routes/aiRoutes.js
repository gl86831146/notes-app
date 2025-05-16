import express from 'express';
import { generateContent } from '../controllers/aiController.js';

const router = express.Router();

// 确保路径匹配
router.post('/generate', (req, res, next) => {
    console.log('AI 路由被访问:', req.path);
    next();
}, generateContent);

export default router;