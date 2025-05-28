import express from 'express';
import db from './mongo-connection.js';
import authRouter from './routes/auth_route.js';
import userRouter from './routes/user_route.js';
import listingRouter from './routes/listing_route.js';
import cookieParser from 'cookie-parser';

import path from 'path';//for deployment

const __dirname=path.resolve();
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.listen(3000,()=>{
    console.log('server is running at 3000!!');
  }) 
  
  app.use('/api/auth',authRouter);
  app.use('/api/user',userRouter);
  app.use('/api/listing',listingRouter);
  
  app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
      });
    });

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


