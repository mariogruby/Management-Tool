import app from './app.js';
import dotenv from 'dotenv';
import { keepAlive } from './routes/keepAlive.js';

dotenv.config();

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    keepAlive();
});