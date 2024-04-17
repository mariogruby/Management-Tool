import express from 'express';
import dotenv from 'dotenv';
import './db/index.js'; // Asumiendo que 'db' configura la base de datos correctamente
import configureApp from './config/index.js';
import api from './routes/index.js';
import handleErrors from './error-handling/index.js';

dotenv.config();

const app = express();

configureApp(app);

app.use(api)

handleErrors(app);

export default app;