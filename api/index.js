import express from 'express';
import db from './mongo-connection.js';

const app=express();

app.listen(3000,()=>{
    console.log('server is running at 3000!!');
}) 