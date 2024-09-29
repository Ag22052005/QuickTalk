const jwt = require('jsonwebtoken')

const jwtmiddleware = (req,res,next)=>{
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
  }
  const token = req.headers.authorization.split(' ')[1];
  if(!token) return res.status(401).json({error:"Unauthorized"})
  
  try {
    const decode = jwt.verify(token,process.env.JWT_KEY)
    req.user = decode // add a new key-value in req body as user which returns the info of user
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({error:"Unauthorized"})
  }
}

module.exports = {jwtmiddleware};