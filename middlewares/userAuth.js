const User = require("../models/UserModel");
const config = require("config");
const JWT_TOKEN_KEY= config.get("JWT_TOKEN_KEY");
const jwt = require("jsonwebtoken");

module.exports.userAuth= (req, res, next) => {
 	const bearerHeader = req.headers["authorization"];
	let token = "";
	if(bearerHeader){
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		token = bearerToken;
		req.token = bearerToken;
	}
	
  if (!token) {
    return res.status(500).json({ message: [{ key: 'error', value: 'User is not logged in' }] })
  }

  //FIXME: redirect to login page when status is failed
  jwt.verify(token, JWT_TOKEN_KEY, async (err, data) => {
    if (err) {
	    console.log(err)
      res.clearCookie("token")
      return res.status(500).json({ message: [{ key: 'error', value: 'User is not logged in' }] })
    } else {
      const user = await User.findById(data.id)
      if (user){
        req.user = user
        next();
      }
      
      else {
	      console.log("error 2 at middleware")
        res.clearCookie("token")
        return res.status(500).json({ message: [{ key: 'error', value: 'User is not logged in' }] })
      }
    }
  })
}
