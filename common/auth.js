const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const saltRounds = 10;
const secretKey = "AsdfGhjkl;!@#"

const hashPwd = async(password)=>{
    let salt = await bcrypt.genSalt(saltRounds)
    let hashedPwd = await bcrypt.hash(password,salt)
    return hashedPwd
}

const hashCompare = async(password,hashedPwd)=>{
    return await bcrypt.compare(password,hashedPwd)
}

const createToken = async(payload)=>{
    console.log(payload);
    let token = await jwt.sign(payload,secretKey,{expiresIn:'2m'})
    return token;
}

const validate = async(req,res,next)=>{
    if(req.headers.authorization)
    {
        let token = req.headers.authorization.split(" ")[1];
        let data = await jwt.decode(token);
        if(Math.floor((+new Date())/1000) < data.exp)
            next()
        else
            res.status(402).send({message:"Token Expired"})
    }
    else{
        res.status(400).send({message:"Token not found"})
    }
}


module.exports={hashPwd,hashCompare,createToken,validate}