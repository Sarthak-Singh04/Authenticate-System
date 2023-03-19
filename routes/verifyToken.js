const jwt=require('jsonwebtoken');
const token_secret="AttackonTitan";

module.exports= function(req,res,next){

    const token=req.header('auth-token');
    if(!token){
        return res.status(401).send("Authenticate yourself");
    }
    try{
        const verified=jwt.verify(token,token_secret);
        req.user=verified;
        next();

    }catch(err){
        res.status(400).send('Authenticate yourself ')
    }




}