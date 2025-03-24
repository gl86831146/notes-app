import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import  userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express();

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

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;