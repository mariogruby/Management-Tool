import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser'; // Corregido el error de importación
import cors from 'cors';

const FRONTEND_URL = "http://localhost:3000";

const configureApp = (app) => {
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  );

  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

export default configureApp;
