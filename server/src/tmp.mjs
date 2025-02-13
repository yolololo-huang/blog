import express from 'express';
import morgan from 'morgan'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { v4 as uuidv4 } from 'uuid';
import degRoutes from './routes/degRoutes.mjs';

import path from 'path';
import { fileURLToPath } from 'url'; // 导入 fileURLToPath

const app = express();
const PORT = process.env.PORT || 3008;

// 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

app.use(morgan(':date[clf] :method :url :status :response-time ms'));
//使用cors middleware, 允许所有域访问
app.use(cors({
    origin: '*', // 前端应用的地址
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())

app.listen(PORT, () => {
    console.log(`running on PORT ${PORT}`);
});

app.get('/', (req, res) => {
    res.status(200).send({ msg: "200" });
});

app.use('/api', degRoutes);

app.post('/api/accept-cookies', (req, res) => {
    const cookieValue = uuidv4(); // 生成唯一的 Cookie 值
    res.cookie('userSession', cookieValue, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.status(200).send({ message: 'Cookies accepted' });
});

app.get('/api/check-cookies', (req, res) => {
    const cookiesAccepted = !!req.cookies.userSession;
    res.status(200).send({ cookiesAccepted });
});