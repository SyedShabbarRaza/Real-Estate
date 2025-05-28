import express from 'express';
import db from '../mongo-connection.js';
import authRouter from '../routes/auth_route.js';
import userRouter from '../routes/user_route.js';
import listingRouter from '../routes/listing_route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path'
import serverless from 'serverless-http'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(join(__dirname, '../client/dist')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ⬇️ Wrap Express app as a Vercel serverless function
export const handler = serverless(app);
