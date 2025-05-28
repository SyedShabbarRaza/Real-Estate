import express from 'express';
import {google, signIn, signup } from '../controllers/auth_controller.js';
import { updateUser,deleteUser, getUserListings,getUser } from '../controllers/user_controller.js';
import { verifyUser } from '../utils/varifyUser.js';
const Router= express.Router();

Router.post('/update/:id',verifyUser,updateUser);
Router.delete('/delete/:id',verifyUser,deleteUser);
Router.get('/listings/:id',verifyUser,getUserListings)
Router.get('/:id',verifyUser,getUser)
export default Router;