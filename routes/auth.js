const router = require('express').Router();
const Joi = require('@hapi/joi');
const User = require('../model/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const token_secret="AttackonTitan";

// Validate the data
const register_validation = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(4).required()
});
const login_validation = Joi.object({
 
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(4).required()
});

router.post('/register', async (req, res) => {
    const { error } = register_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //check if their is data already present in the database

    const Check_UserEmail=await User.findOne({email:req.body.email});

    if(Check_UserEmail){
        return res.status(400).send('Email already exist');
    }

    //hash the password

    const salt=await bcrypt.genSalt(10);
    const hashed_password=await bcrypt.hash(req.body.password,salt)



    //create the user data

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashed_password
    });

    try {
        const saveUser = await user.save();
        res.send(saveUser._id);
    } catch (err) {
        res.status(400).send(err);
    }
});

//Api for login page


router.post('/login',async(req,res)=>{
    const { error } = login_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const user=await User.findOne({email:req.body.email});
    
    if(!user){
        return res.status(400).send('Email does not exist');
    }
    const valid_password=await bcrypt.compare(req.body.password,user.password);

    if(!valid_password){
        return res.status(400).send('Invalid password');
    }

    //creating a token and assign to them

    const token=jwt.sign({_id: user._id},token_secret);
    res.header('auth-token',token).send(token);


  

})




module.exports = router;
