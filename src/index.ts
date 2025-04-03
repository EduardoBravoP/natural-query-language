import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { AppDataSource } from './config/database';
import userRoutes from './routes/user.routes';
import bookRoutes from './routes/book.routes';
import purchaseRoutes from './routes/purchase.routes';
import dataRoutes from './routes/data.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/data', dataRoutes);

const startServer = async () => {
  try {
    // Initialize TypeORM
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 