import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import  userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

// const allowedOrigns = ["http://8.136.110.222:9090"];
const allowedOrigns = ["http://localhost:5173"];
app.use(
    cors({
        origin: function(origin, callback){
            if(!origin) return callback(null, true);
            if(allowedOrigns.indexOf(origin) === -1){
                const msg = "这个网站的跨域资源共享（CORS) 策略不允许访问。"
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    })
)

app.use(express.json())

// 将 AI 路由放在其他路由之前
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;