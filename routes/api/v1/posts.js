const express=require('express');
const router=express.Router();
const postApi=require('../../../controllers/api/v1/posts_api');
const passport=require('passport');
router.get('/',postApi.index);
router.get('/:id',passport.authenticate('jwt',{session:false}),postApi.destroy);
module.exports=router;
