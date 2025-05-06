import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { projectRoutes } from './routes/project.routes';
import { initializeConnection } from './database/client';

const bootstrap = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  await initializeConnection();

  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
  app.use(express.json());

  app.use('/api/projects', projectRoutes);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

bootstrap()