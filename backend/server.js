import express from 'express';
import path, { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import router from './routes/goalRoutes.js';
import userRouter from './routes/userRoutes.js';
import colors from 'colors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
dotenv.config();

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 8000;

await connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/goals', router);
app.use('/api/users', userRouter);

// Serve frontend in production
if (process.env.NODE_ENV === 'production')
{
    app.use(express.static(join(__dirname, '../frontend/dist')));
    app.use((req, res) => {
        res.sendFile(resolve(__dirname, '../', 'frontend', 'dist', 'index.html'));
    });
} else
{
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}


app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});