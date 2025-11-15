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
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));
router.use('/friends',require('./friends'));
router.use('/chat',require('./chat'));
router.use('/notifications',require('./notifications'));
router.use('/twitter',require('./twitter'));
router.use('/social-graph',require('./social_graph'));
router.get('/update-Information',userController.updateInformation);
router.get('/all-users',passport.checkAuthentication,require('../controllers/all_users_controller').allUsers);
//use passport as a middleware 
router.post('/create-session',passport.authenticate(
   'local',
   {failureRedirect:'signin'}
),userController.createSession);
router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.get('/profile',passport.checkAuthentication,userController.profile);
router.get('/signout',userController.destroySession);
router.post('/c',userController.c);
router.post('/update/:id',userController.update);
router.use('/api',require('./api/index'));
router.get('/users/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/users/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signin'}),userController.createSession);

module.exports=router;