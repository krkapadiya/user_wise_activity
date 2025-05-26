const express=require('express');
const router=express.Router()
const {register,registeruser,login,loginuser,dashboard,activity,addactivity,updateActivityOrder,updateactivity,deleteactivity,oldactivity}=require('./../controller/C_user_activity');


router.get('/',register);
router.post('/registeruser',registeruser);
router.get('/login',login);
router.post('/loginuser',loginuser);
router.get('/dashboard',dashboard)
router.get('/add-activity',activity)
router.post('/add-activity',addactivity);
router.post('/update-activity-order',updateActivityOrder);
router.post('/update-activity',updateactivity); 
router.get('/edit-activity/:id',oldactivity )
router.post('/deleteactivity',deleteactivity)

module.exports=router