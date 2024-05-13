import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const FRONTEND_URL = 'https://todo-app-tool.vercel.app';

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
