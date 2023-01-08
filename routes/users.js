const user=require('../model/user');
const express=require('express');
const router=express.Router();
const passport=require('passport');
const userController=require('../controllers/users_controllers');
const homecontroller=require('../controllers/home_controller');

const User = require('../model/user');
router.get('/',homecontroller.home);
router.get('/sign_up',userController.signUp);
router.get('/signin',userController.signIn);
router.use('/post',require('./post'));
//use passport as a middleware 
router.post('/create-session',passport.authenticate(
   'local',
   {failureRedirect:'signin'}
),userController.createSession);
router.get('/profile',passport.checkAuthentication,userController.profile);
router.get('/signout',userController.destroySession);
router.post('/c',userController.c);
module.exports=router;