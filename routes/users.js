var express = require('express');
var router = express.Router();
const {UserModel} = require('../schemas/userSchema')
const mongoose = require('mongoose')
const { dbUrl } = require('../common/dbConfig')
const { hashPwd, hashCompare,createToken,validate } = require('../common/auth')

mongoose.connect(dbUrl)

/* GET users listing. */
router.get('/',validate,async function(req, res) {
  try {
    let users =await UserModel.find();
    res.status(200).send({
      users,
      message:"Users Data Fetch Successfull!"
    })
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })    
  }
  
});

router.post('/signup',async(req,res)=>{
  try {
    let user = await UserModel.findOne({email:req.body.email})
    console.log(user);
    if(!user){
      let hashedPwd = await hashPwd(req.body.password)
      req.body.password = hashedPwd
      let user = await UserModel.create(req.body)
      res.status(201).send({
        message:"User Signup Successfull!"
      })
    }
    else{
      res.status(400).send({message:"User Alread Exists!"})
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

//login
router.post('/login',async(req,res)=>{
  try {
    let user = await UserModel.findOne({email:req.body.email})
    console.log(user);
    if(user){
      if(await hashCompare(req.body.password,user.password)){
        //create token
        let token = await createToken({
          name:user.name,
          email:user.email,
          id:user._id,
          role:user.role
        })
        res.status(200).send({
          message:"User Login Success!!",
          token
        })
      }
      else{
        res.status(402).send({
          message:"Invalid Credentials!!"
        })
      }
    }
    else{
      res.status(400).send({message:"User doesn't Exists!"})
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})


router.get('/:id', async(req, res)=> {
  try {
    let user = await UserModel.findOne({_id:req.params.id});
    res.status(200).send({
      user,
      message:"Users Data Fetch Successfull!"
    })
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
});

router.put('/:id',async(req,res)=>{
  try {
    let user = await UserModel.findOne({_id:req.params.id})
    if(user)
    {
      user.name = req.body.name
      user.email = req.body.email
      user.password = req.body.password

      await user.save()

      res.status(200).send({
        message:"User Updated Successfully!"
      })
    }
    else
    {
      res.status(400).send({message:"User Does Not Exists!"})
    }

  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.delete('/:id',async(req,res)=>{
  try {
    let user = await UserModel.findOne({_id:req.params.id})
    if(user)
    {
      let user = await UserModel.deleteOne({_id:req.params.id})
      res.status(200).send({
        message:"User Deleted Successfull!"
      })
    }
    else
    {
      res.status(400).send({message:"User Does Not Exists!"})
    }

  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})
module.exports = router;