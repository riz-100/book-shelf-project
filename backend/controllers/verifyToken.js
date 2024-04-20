const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token){
        res.status(401).json({message: "No Token Provided"});
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
        if(err){
            res.status(401).json({message: "Invalid token"});
            console.log(req);
        }
        else{
        req.user = decoded;
        next();
        }
    });
}

