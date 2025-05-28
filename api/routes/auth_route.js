import express from 'express';
import {google, signIn, signOut, signup } from '../controllers/auth_controller.js';
import { verifyUser } from '../utils/varifyUser.js';
const Router= express.Router();

Router.post('/signup',signup);
Router.post('/signin',signIn);
Router.post('/google',google);
Router.get('/signout',signOut);

export default Router;